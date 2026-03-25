/**
 * LeerZone - Configuratie Manager
 * Beheert custom thema's en item instellingen
 */

import { Themes as DefaultThemes } from './themes.js';

export const ConfigManager = {
    STORAGE_KEY: 'leerzone_custom_config',
    config: {
        customThemes: {},
        modifiedDefaultThemes: {}
    },

    init() {
        this.load();
    },

    load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.config = JSON.parse(saved);
            } catch (e) {
                console.error('Fout bij laden config:', e);
            }
        }
    },

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    },

    /**
     * Haalt alle beschikbare thema's op (default + custom)
     */
    getAllThemes() {
        const allThemes = { ...DefaultThemes };

        // Overschrijf met aanpassingen aan default thema's
        for (const [id, modifiedTheme] of Object.entries(this.config.modifiedDefaultThemes)) {
            if (allThemes[id]) {
                allThemes[id] = { ...allThemes[id], ...modifiedTheme };
            }
        }

        // Voeg custom thema's toe
        return { ...allThemes, ...this.config.customThemes };
    },

    /**
     * Bewaar een (geüpdatet) thema
     */
    saveTheme(themeId, themeData, isCustom = false) {
        if (isCustom || !DefaultThemes[themeId]) {
            this.config.customThemes[themeId] = themeData;
        } else {
            this.config.modifiedDefaultThemes[themeId] = themeData;
        }
        this.save();
    },

    /**
     * Verwijder een custom thema of reset een aangepast default thema
     */
    deleteTheme(themeId) {
        if (this.config.customThemes[themeId]) {
            delete this.config.customThemes[themeId];
        } else if (this.config.modifiedDefaultThemes[themeId]) {
            delete this.config.modifiedDefaultThemes[themeId];
        }
        this.save();
    },

    /**
     * Utility om image naar base64 te converteren
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
};
