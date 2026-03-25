/**
 * LeerZone - Custom Theme Store
 * Beheert gebruiker-gemaakte thema's in localStorage
 */

import { Themes as BuiltinThemes } from './themes.js?v=4';

const STORAGE_KEY = 'leerzone_custom_themes';

export const CustomThemeStore = {

    getAll() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Fout bij laden custom themas:', e);
            return {};
        }
    },

    save(theme) {
        const themes = this.getAll();
        if (!theme.id) {
            theme.id = 'custom-' + Date.now();
        }
        theme.isCustom = true;
        themes[theme.id] = theme;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
        return theme.id;
    },

    delete(themeId) {
        const themes = this.getAll();
        delete themes[themeId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
    },

    get(themeId) {
        return this.getAll()[themeId] || null;
    },

    getAllThemes() {
        return { ...BuiltinThemes, ...this.getAll() };
    },

    exportJSON(themeId) {
        const theme = this.get(themeId);
        if (!theme) return;

        const exportData = {
            leerzone_theme_v1: true,
            exportedAt: new Date().toISOString(),
            theme
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leerzone-thema-${theme.name || 'nieuw'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.leerzone_theme_v1 || !data.theme) {
                        reject(new Error('Ongeldig LeerZone thema bestand'));
                        return;
                    }
                    const theme = data.theme;
                    theme.id = 'custom-' + Date.now();
                    const id = this.save(theme);
                    resolve(id);
                } catch (err) {
                    reject(new Error('Fout bij lezen bestand: ' + err.message));
                }
            };
            reader.onerror = () => reject(new Error('Kan bestand niet lezen'));
            reader.readAsText(file);
        });
    }
};
