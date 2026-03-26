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
                { id: '91',   name: 'Kat miauw (zacht)',      icon: '🐱' },
                { id: '45',   name: 'Kat miauw (honger)',     icon: '🐱' },
                { id: '1',    name: 'Hond blaf',              icon: '🐕' },
                { id: '54',   name: 'Hond blaf (groot)',      icon: '🐕' },
                { id: '1751', name: 'Koe loeit',              icon: '🐄' },
                { id: '1744', name: 'Koe moe',                icon: '🐄' },
                { id: '85',   name: 'Paard hinnik',           icon: '🐴' },
                { id: '83',   name: 'Paard galop',            icon: '🐴' },
                { id: '6',    name: 'Leeuw brul',             icon: '🦁' },
                { id: '13',   name: 'Beest brul',             icon: '🐻' },
                { id: '108',  name: 'Aap giechelt',           icon: '🐒' },
                { id: '105',  name: 'Aap gilt',               icon: '🐒' },
                { id: '2462', name: 'Haan kraait',            icon: '🐓' },
                { id: '7',    name: 'Boerderij ochtend',      icon: '🐔' },
                { id: '17',   name: 'Vogels zingen',          icon: '🐦' },
                { id: '23',   name: 'Vogel tjilpt',           icon: '🐦' },
                { id: '1212', name: 'Bosvogels',              icon: '🌿' },
                { id: '2466', name: 'Uil',                    icon: '🦉' },
                { id: '1775', name: 'Wolf huilt',             icon: '🐺' },
                { id: '1770', name: 'Ezel balk',              icon: '🫏' },
                { id: '1780', name: 'Krekel',                 icon: '🦗' },
                { id: '2437', name: 'Kaketoe schreeuwt',      icon: '🦜' },
                { id: '2457', name: 'Vis in water',           icon: '🐟' },
                { id: '309',  name: 'Draak grolt',            icon: '🐉' },
            ]
        },

        water: {
            label: 'Water & Zee',
            icon: '💧',
            sounds: [
                { id: '1311', name: 'Waterplons',             icon: '💦' },
                { id: '1180', name: 'Sprong in water',        icon: '🏊' },
                { id: '1198', name: 'Zeegolf plons',          icon: '🌊' },
                { id: '1185', name: 'Zeegolven met vogels',   icon: '🏖️' },
                { id: '1317', name: 'Waterbubbel',            icon: '🫧' },
                { id: '3000', name: 'Vloeibare bubbel',       icon: '💧' },
                { id: '3126', name: 'Stromend water',         icon: '🏞️' },
                { id: '2826', name: 'Water inschenken',       icon: '🥛' },
                { id: '2921', name: 'Vis in water',           icon: '🐟' },
                { id: '1187', name: 'Houten schip op zee',    icon: '⛵' },
                { id: '1183', name: 'Motorboot',              icon: '🚤' },
                { id: '2513', name: 'Waterval',               icon: '🌊' },
                { id: '2364', name: 'Harde pop klik',         icon: '💥' },
            ]
        },

        spel: {
            label: 'Spel & Winnen',
            icon: '🎮',
            sounds: [
                { id: '2059', name: 'Level klaar',            icon: '🎉' },
                { id: '226',  name: 'Fanfare',                icon: '🎺' },
                { id: '462',  name: 'Publiek juicht',         icon: '🏆' },
                { id: '2069', name: 'Munt pakken',            icon: '🪙' },
                { id: '2058', name: 'Bonus!',                 icon: '⭐' },
                { id: '2062', name: 'Level omhoog',           icon: '⬆️' },
                { id: '2043', name: 'Sprong',                 icon: '🦘' },
                { id: '2045', name: 'Extra leven',            icon: '❤️' },
                { id: '265',  name: 'Goed zo!',               icon: '✅' },
                { id: '952',  name: 'Goed antwoord',          icon: '🏆' },
                { id: '2042', name: 'Fout / verlies',         icon: '💀' },
                { id: '946',  name: 'Fout antwoord',          icon: '❌' },
                { id: '473',  name: 'Nee-piano',              icon: '🎹' },
                { id: '276',  name: 'Game over',              icon: '😵' },
                { id: '237',  name: 'Retro klik',             icon: '👾' },
                { id: '277',  name: 'Laser bubbel',           icon: '🎯' },
            ]
        },

        sport: {
            label: 'Sport',
            icon: '⚽',
            sounds: [
                { id: '2108', name: 'Voetbal schop',          icon: '⚽' },
                { id: '2099', name: 'Voetbal trap',           icon: '⚽' },
                { id: '2089', name: 'Bal stuitert',           icon: '🏀' },
                { id: '2084', name: 'Basketbal in net',       icon: '🏀' },
                { id: '2093', name: 'Basketbal harde hit',    icon: '🏀' },
                { id: '2083', name: 'Bal op de grond',        icon: '⚾' },
                { id: '2124', name: 'Golfslag lucht',         icon: '🏌️' },
                { id: '615',  name: 'Fluitje',                icon: '🎽' },
                { id: '362',  name: 'Publiek applaus',        icon: '👏' },
                { id: '522',  name: 'Ritmisch applaus',       icon: '👏' },
                { id: '504',  name: 'Publiek en applaus',     icon: '🎊' },
                { id: '1232', name: 'Rennen in bos',          icon: '🏃' },
            ]
        },

        cartoon: {
            label: 'Grappig & Cartoon',
            icon: '🤪',
            sounds: [
                { id: '2894', name: 'Boing!',                 icon: '🤸' },
                { id: '616',  name: 'Speelgoedfluitje',       icon: '🎵' },
                { id: '110',  name: 'Cartoon deurbel',        icon: '🔔' },
                { id: '2882', name: 'Cartoon lach',           icon: '😂' },
                { id: '414',  name: 'Lachend creature',       icon: '😄' },
                { id: '107',  name: 'Aap spot-lach',          icon: '🐒' },
                { id: '395',  name: 'Vallend fluitje',        icon: '😜' },
                { id: '473',  name: 'Nee-piano',              icon: '🎹' },
                { id: '744',  name: 'Trombone fail',          icon: '🎺' },
                { id: '2886', name: 'Claxon-clown',           icon: '🤡' },
            ]
        },

        kerst: {
            label: 'Kerst & Feest',
            icon: '🎄',
            sounds: [
                { id: '2988', name: 'Kerst onthulling',       icon: '🎄' },
                { id: '2986', name: 'Magische kerstmelodie',  icon: '✨' },
                { id: '2987', name: 'Kerstorkest',            icon: '🎻' },
                { id: '700',  name: 'Muziekdoosje lullaby',   icon: '🎁' },
                { id: '937',  name: 'Vrolijke bel',           icon: '🔔' },
                { id: '933',  name: 'Bel ding',               icon: '🛎️' },
                { id: '2059', name: 'Feestelijk tadaa',       icon: '🎉' },
                { id: '226',  name: 'Fanfare',                icon: '🎺' },
            ]
        },

        ui: {
            label: 'UI & Knoppen',
            icon: '🔔',
            sounds: [
                { id: '2870', name: 'Juist toon',             icon: '✅' },
                { id: '2867', name: 'Bevestiging',            icon: '👆' },
                { id: '933',  name: 'Bel ding',               icon: '🛎️' },
                { id: '937',  name: 'Vrolijke bel',           icon: '🔔' },
                { id: '951',  name: 'Positief',               icon: '📢' },
                { id: '1583', name: 'Radar ping',             icon: '📡' },
                { id: '2344', name: 'Magische ring',          icon: '✨' },
                { id: '2574', name: 'Interface start',        icon: '💡' },
                { id: '2575', name: 'Interface terug',        icon: '↩️' },
                { id: '2576', name: 'Interface verwijder',    icon: '🗑️' },
                { id: '2357', name: 'Bubbel pop',             icon: '💬' },
                { id: '2356', name: 'Pop melding',            icon: '🔔' },
                { id: '2580', name: 'Lichte klik',            icon: '👆' },
                { id: '2864', name: 'Deurbel',                icon: '🚪' },
                { id: '110',  name: 'Cartoon deurbel',        icon: '🔔' },
                { id: '896',  name: 'Afwijzing',              icon: '🚫' },
            ]
        },

        natuur: {
            label: 'Natuur & Weer',
            icon: '🌿',
            sounds: [
                { id: '2393', name: 'Zachte regen',           icon: '🌧️' },
                { id: '2390', name: 'Regen en onweer',        icon: '⛈️' },
                { id: '2405', name: 'Blikseminslag',          icon: '⚡' },
                { id: '2658', name: 'Wind',                   icon: '💨' },
                { id: '1157', name: 'Kerkhof wind',           icon: '🌬️' },
                { id: '2427', name: 'Bries door bomen',       icon: '🌿' },
                { id: '2472', name: 'Ochtendvogels',          icon: '🌅' },
                { id: '2428', name: 'Droge bladeren',         icon: '🍂' },
                { id: '2443', name: 'Vulkaanuitbarsting',     icon: '🌋' },
            ]
        },

        voertuigen: {
            label: 'Voertuigen',
            icon: '🚗',
            sounds: [
                { id: '718',  name: 'Auto claxon',            icon: '🚗' },
                { id: '1565', name: 'Klassieke claxon',       icon: '🚗' },
                { id: '720',  name: 'Vrachtwagen toeter',     icon: '🚚' },
                { id: '1535', name: 'Auto starten',           icon: '🔑' },
                { id: '1538', name: 'Auto rijdt voorbij',     icon: '🏎️' },
                { id: '1564', name: 'Autodeur dicht',         icon: '🚪' },
                { id: '3129', name: 'Autodeur sluiten',       icon: '🚪' },
                { id: '1484', name: 'Swoosh',                 icon: '💨' },
                { id: '1557', name: 'Sci-Fi voertuig',        icon: '🛸' },
                { id: '1183', name: 'Motorboot',              icon: '🚤' },
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
