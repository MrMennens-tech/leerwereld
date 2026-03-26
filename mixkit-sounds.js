/**
 * LeerZone - Mixkit Sound Database
 * Alle ID's zijn geverifieerd via data-audio-player-item-id-value op mixkit.co
 *
 * URL formaat: https://assets.mixkit.co/active_storage/sfx/{id}/{id}-preview.mp3
 *
 * Eigen ID vinden: ga naar mixkit.co → F12 DevTools → inspecteer afspeelknop
 * → zoek: data-audio-player-item-id-value="[GETAL]"
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
                { id: '91',   name: 'Kat miauw (zacht)',    icon: '🐱' },
                { id: '45',   name: 'Kat miauw (honger)',   icon: '🐱' },
                { id: '1',    name: 'Hond blaf',            icon: '🐕' },
                { id: '54',   name: 'Hond blaf (groot)',    icon: '🐕' },
                { id: '1751', name: 'Koe loeit',            icon: '🐄' },
                { id: '1744', name: 'Koe moe',              icon: '🐄' },
                { id: '85',   name: 'Paard hinnik',         icon: '🐴' },
                { id: '83',   name: 'Paard galop',          icon: '🐴' },
                { id: '6',    name: 'Leeuw brul',           icon: '🦁' },
                { id: '108',  name: 'Aap giechelt',         icon: '🐒' },
                { id: '105',  name: 'Aap gilt',             icon: '🐒' },
                { id: '2462', name: 'Haan kraait',          icon: '🐓' },
                { id: '17',   name: 'Vogels zingen',        icon: '🐦' },
                { id: '23',   name: 'Vogel tjilpt',         icon: '🐦' },
                { id: '2466', name: 'Uil',                  icon: '🦉' },
                { id: '1775', name: 'Wolf huilt',           icon: '🐺' },
                { id: '1770', name: 'Ezel balk',            icon: '🫏' },
            ]
        },

        spel: {
            label: 'Spel & Winnen',
            icon: '🎮',
            sounds: [
                { id: '2059', name: 'Level klaar',          icon: '🎉' },
                { id: '226',  name: 'Fanfare',              icon: '🎺' },
                { id: '2069', name: 'Munt pakken',          icon: '🪙' },
                { id: '2058', name: 'Bonus!',               icon: '⭐' },
                { id: '2062', name: 'Level omhoog',         icon: '⬆️' },
                { id: '2043', name: 'Sprong',               icon: '🦘' },
                { id: '2045', name: 'Extra leven',          icon: '❤️' },
                { id: '265',  name: 'Goed zo!',             icon: '✅' },
                { id: '952',  name: 'Goed antwoord',        icon: '🏆' },
                { id: '2042', name: 'Fout / verlies',       icon: '💀' },
                { id: '946',  name: 'Fout antwoord',        icon: '❌' },
                { id: '276',  name: 'Game over',            icon: '😵' },
                { id: '237',  name: 'Retro klik',           icon: '👾' },
                { id: '277',  name: 'Laser bubbel',         icon: '🎯' },
            ]
        },

        ui: {
            label: 'UI & Knoppen',
            icon: '🔔',
            sounds: [
                { id: '2870', name: 'Juist toon',           icon: '✅' },
                { id: '2867', name: 'Bevestiging',          icon: '👆' },
                { id: '933',  name: 'Bel ding',             icon: '🛎️' },
                { id: '937',  name: 'Vrolijke bel',         icon: '🔔' },
                { id: '951',  name: 'Positief',             icon: '📢' },
                { id: '2574', name: 'Interface start',      icon: '💡' },
                { id: '2575', name: 'Interface terug',      icon: '↩️' },
                { id: '2576', name: 'Interface verwijder',  icon: '🗑️' },
                { id: '2357', name: 'Bubbel pop',           icon: '💬' },
                { id: '2356', name: 'Pop melding',          icon: '🔔' },
                { id: '2580', name: 'Lichte klik',          icon: '👆' },
                { id: '2864', name: 'Deurbel',              icon: '🚪' },
                { id: '896',  name: 'Afwijzing',            icon: '🚫' },
            ]
        },

        natuur: {
            label: 'Natuur & Weer',
            icon: '🌿',
            sounds: [
                { id: '2393', name: 'Zachte regen',         icon: '🌧️' },
                { id: '2390', name: 'Regen en onweer',      icon: '⛈️' },
                { id: '2405', name: 'Blikseminslag',        icon: '⚡' },
                { id: '2658', name: 'Wind',                 icon: '💨' },
                { id: '2427', name: 'Bries door bomen',     icon: '🌿' },
                { id: '2472', name: 'Ochtendvogels',        icon: '🌅' },
                { id: '3126', name: 'Stromend water',       icon: '💧' },
                { id: '3000', name: 'Waterbubbel',          icon: '💦' },
                { id: '2443', name: 'Vulkaanuitbarsting',   icon: '🌋' },
            ]
        },

        voertuigen: {
            label: 'Voertuigen',
            icon: '🚗',
            sounds: [
                { id: '718',  name: 'Auto claxon',          icon: '🚗' },
                { id: '1565', name: 'Klassieke claxon',     icon: '🚗' },
                { id: '720',  name: 'Vrachtwagen toeter',   icon: '🚚' },
                { id: '1535', name: 'Auto starten',         icon: '🔑' },
                { id: '1538', name: 'Auto rijdt voorbij',   icon: '🏎️' },
                { id: '1564', name: 'Autodeur dicht',       icon: '🚪' },
                { id: '3129', name: 'Autodeur sluiten',     icon: '🚪' },
                { id: '1484', name: 'Swoosh',               icon: '💨' },
            ]
        },
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
