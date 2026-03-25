/**
 * LeerZone - Mixkit Sound Database
 * Geverifieerde geluids-ID's van mixkit.co
 *
 * URL formaat: https://assets.mixkit.co/active_storage/sfx/{id}/{id}-preview.mp3
 *
 * Eigen ID vinden: ga naar mixkit.co/free-sound-effects, open F12 DevTools,
 * klik Inspecteren op een afspeelknop en zoek: data-audio-player-item-id-value="[GETAL]"
 *
 * BEHEER: Voeg nieuwe geverifieerde ID's toe aan de juiste categorie.
 */

export const MIXKIT_CDN = 'https://assets.mixkit.co/active_storage/sfx';

export function getMixkitUrl(id) {
    return `${MIXKIT_CDN}/${id}/${id}-preview.mp3`;
}

export const MixkitSounds = {

    categories: {
        dieren: {
            label: 'Dieren',
            icon: '🐾',
            sounds: [
                { id: '78',   name: 'Kat miauw',       icon: '🐱' },
                { id: '2355', name: 'Hond blaf',        icon: '🐕' },
                { id: '54',   name: 'Grote hond blaf',  icon: '🐶' },
                { id: '2344', name: 'Koe',              icon: '🐄' },
                { id: '2346', name: 'Schaap',           icon: '🐑' },
                { id: '2347', name: 'Kip',              icon: '🐔' },
                { id: '2333', name: 'Paard',            icon: '🐴' },
                { id: '2517', name: 'Vogel tjilp',      icon: '🐦' },
                { id: '2518', name: 'Vogels ochtend',   icon: '🌅' },
                { id: '2680', name: 'Uil',              icon: '🦉' },
            ]
        },

        spel: {
            label: 'Spel & Winnen',
            icon: '🎮',
            sounds: [
                { id: '2639', name: 'Tada fanfare',     icon: '🎺' },
                { id: '2003', name: 'Magische sparkle', icon: '✨' },
                { id: '2016', name: 'Level up',         icon: '⬆️' },
                { id: '2019', name: 'Munt pakken',      icon: '🪙' },
                { id: '2018', name: 'Power up',         icon: '⚡' },
                { id: '2574', name: 'Retro blip',       icon: '👾' },
                { id: '2575', name: '8-bit sprong',     icon: '🕹️' },
                { id: '2576', name: 'Game over',        icon: '💀' },
                { id: '2571', name: 'Succes chime',     icon: '✅' },
                { id: '2568', name: 'Fout buzz',        icon: '❌' },
            ]
        },

        ui: {
            label: 'UI & Knoppen',
            icon: '🔔',
            sounds: [
                { id: '2869', name: 'Notificatie pop',  icon: '🔔' },
                { id: '2870', name: 'Alert ping',       icon: '📢' },
                { id: '2867', name: 'Klik',             icon: '👆' },
                { id: '1111', name: 'Bel ding',         icon: '🛎️' },
                { id: '2358', name: 'Swoosh',           icon: '💨' },
                { id: '2004', name: 'Harp glissando',   icon: '🎵' },
            ]
        },

        natuur: {
            label: 'Natuur & Weer',
            icon: '🌿',
            sounds: [
                { id: '2515', name: 'Regen zacht',      icon: '🌧️' },
                { id: '2523', name: 'Onweer',           icon: '⛈️' },
                { id: '2520', name: 'Wind',             icon: '💨' },
                { id: '178',  name: 'Water plons',      icon: '💦' },
            ]
        },

        voertuigen: {
            label: 'Voertuigen',
            icon: '🚗',
            sounds: [
                { id: '2589', name: 'Auto claxon',      icon: '🚗' },
                { id: '2601', name: 'Motor start',      icon: '🏍️' },
                { id: '2585', name: 'Trein fluit',      icon: '🚂' },
                { id: '1489', name: 'Sirene',           icon: '🚨' },
                { id: '2605', name: 'Vliegtuig',        icon: '✈️' },
            ]
        },

        huis: {
            label: 'Huis & Dagelijks',
            icon: '🏠',
            sounds: [
                { id: '2578', name: 'Deur klop',        icon: '🚪' },
                { id: '2579', name: 'Deur open',        icon: '🚪' },
                { id: '2353', name: 'Telefoon',         icon: '📞' },
                { id: '2359', name: 'Wekker',           icon: '⏰' },
                { id: '2367', name: 'Slurp',            icon: '🥤' },
                { id: '2368', name: 'Kauwen',           icon: '🍎' },
            ]
        },

        actie: {
            label: 'Actie & Beweging',
            icon: '💥',
            sounds: [
                { id: '2360', name: 'Sprong',           icon: '🦘' },
                { id: '2361', name: 'Rennen',           icon: '🏃' },
                { id: '2362', name: 'Val',              icon: '💥' },
                { id: '2364', name: 'Kurk pop',         icon: '🍾' },
            ]
        }
    },

    getUrl(id) {
        return getMixkitUrl(id);
    },

    getAllSounds() {
        const all = [];
        for (const [catId, cat] of Object.entries(this.categories)) {
            for (const sound of cat.sounds) {
                all.push({ ...sound, category: catId, categoryLabel: cat.label });
            }
        }
        return all;
    },

    getSoundsByCategory(catId) {
        return this.categories[catId]?.sounds || [];
    },

    search(query) {
        const q = query.toLowerCase();
        return this.getAllSounds().filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.categoryLabel.toLowerCase().includes(q)
        );
    }
};
