/**
 * LeerZone - Mixkit Sound Browser
 * Gecureerde lijst van Mixkit geluidseffecten (max ~5 seconden)
 * Bron: mixkit.co (gratis licentie voor persoonlijk en commercieel gebruik)
 *
 * URL formaat: https://assets.mixkit.co/sfx/preview/[slug].mp3
 *
 * BEHEER: Voeg nieuwe geluiden toe door slug + naam toe te voegen aan de
 * juiste categorie. Test de URL in de browser om te verifiëren dat het geluid werkt.
 */

export const MIXKIT_BASE = 'https://assets.mixkit.co/sfx/preview/';

export const MixkitSounds = {

    categories: {
        dieren: {
            label: 'Dieren',
            icon: '🐾',
            sounds: [
                { slug: 'mixkit-angry-hen-clucks-1052', name: 'Kip' },
                { slug: 'mixkit-rooster-crowing-in-the-morning-2462', name: 'Haan kraaien' },
                { slug: 'mixkit-cat-meow-1108', name: 'Kat miauw' },
                { slug: 'mixkit-small-dog-barking-2042', name: 'Hond blaffen' },
                { slug: 'mixkit-frog-single-croaking-3057', name: 'Kikker' },
                { slug: 'mixkit-single-cow-moo-1745', name: 'Koe' },
                { slug: 'mixkit-sheep-single-baa-1740', name: 'Schaap' },
                { slug: 'mixkit-wild-horse-neigh-346', name: 'Paard' },
                { slug: 'mixkit-funny-pig-groan-2103', name: 'Varken' },
                { slug: 'mixkit-duck-quack-1738', name: 'Eend' },
                { slug: 'mixkit-crow-crow-1746', name: 'Kraai' },
                { slug: 'mixkit-bee-flying-single-1558', name: 'Bij zoemen' },
            ]
        },

        natuur: {
            label: 'Natuur',
            icon: '🌿',
            sounds: [
                { slug: 'mixkit-light-rain-loop-2393', name: 'Zachte regen' },
                { slug: 'mixkit-rain-and-thunder-storm-2403', name: 'Onweer' },
                { slug: 'mixkit-sea-waves-loop-1196', name: 'Zeegolven' },
                { slug: 'mixkit-water-drop-in-a-puddle-1291', name: 'Waterdruppel' },
                { slug: 'mixkit-fire-crackle-1061', name: 'Kampvuur' },
                { slug: 'mixkit-forest-birds-ambience-1210', name: 'Vogels in bos' },
                { slug: 'mixkit-light-wind-1195', name: 'Zachte wind' },
                { slug: 'mixkit-strong-winds-blowing-loop-2434', name: 'Sterke wind' },
                { slug: 'mixkit-birds-chirping-and-wind-ambience-1191', name: 'Vogels & wind' },
                { slug: 'mixkit-water-bubbles-underwater-2405', name: 'Bubbels' },
            ]
        },

        spel: {
            label: 'Spel & UI',
            icon: '🎮',
            sounds: [
                { slug: 'mixkit-arcade-game-jump-coin-216', name: 'Munt pakken' },
                { slug: 'mixkit-winning-chime-600', name: 'Winnen klokje' },
                { slug: 'mixkit-correct-answer-tone-2870', name: 'Goed antwoord' },
                { slug: 'mixkit-wrong-answer-buzz-950', name: 'Fout antwoord' },
                { slug: 'mixkit-retro-game-notification-212', name: 'Game notificatie' },
                { slug: 'mixkit-video-game-win-2016', name: 'Spel gewonnen' },
                { slug: 'mixkit-magical-coin-win-1936', name: 'Magische munt' },
                { slug: 'mixkit-unlock-game-notification-253', name: 'Ontgrendeld' },
                { slug: 'mixkit-bonus-extra-in-game-2064', name: 'Bonus!' },
                { slug: 'mixkit-game-level-completed-2059', name: 'Level compleet' },
                { slug: 'mixkit-8-bit-game-coin-1022', name: '8-bit munt' },
                { slug: 'mixkit-player-jumping-in-a-video-game-2043', name: 'Sprong spel' },
            ]
        },

        muziek: {
            label: 'Muziek & Bellen',
            icon: '🎵',
            sounds: [
                { slug: 'mixkit-happy-bells-notification-937', name: 'Blije bellen' },
                { slug: 'mixkit-achievement-bell-600', name: 'Prestatie bel' },
                { slug: 'mixkit-cute-giggle-172', name: 'Lachje' },
                { slug: 'mixkit-positive-interface-beep-221', name: 'Positieve beep' },
                { slug: 'mixkit-animation-flute-notification-2876', name: 'Fluit notificatie' },
                { slug: 'mixkit-fairy-magic-swoosh-1461', name: 'Magie swoosh' },
                { slug: 'mixkit-magic-sparkle-2096', name: 'Magie sprankel' },
                { slug: 'mixkit-funny-giggle-2015', name: 'Grappig lachje' },
                { slug: 'mixkit-cheerful-notification-862', name: 'Vrolijke notificatie' },
                { slug: 'mixkit-xylophone-notification-2867', name: 'Xylofoon' },
            ]
        },

        beweging: {
            label: 'Beweging & Effecten',
            icon: '💨',
            sounds: [
                { slug: 'mixkit-fast-rocket-whoosh-1714', name: 'Raket whoosh' },
                { slug: 'mixkit-air-swoosh-1470', name: 'Lucht swoosh' },
                { slug: 'mixkit-quick-jump-2974', name: 'Sprong' },
                { slug: 'mixkit-bubble-pop-2121', name: 'Bubbel pop' },
                { slug: 'mixkit-small-explosion-hit-1914', name: 'Kleine explosie' },
                { slug: 'mixkit-water-splash-1195', name: 'Waterplons' },
                { slug: 'mixkit-ball-bounce-at-the-playground-2071', name: 'Bal stuitert' },
                { slug: 'mixkit-falling-hit-757', name: 'Bons' },
                { slug: 'mixkit-simple-click-2067', name: 'Klikje' },
                { slug: 'mixkit-click-error-on-software-2073', name: 'Error klik' },
            ]
        },

        transport: {
            label: 'Transport',
            icon: '🚗',
            sounds: [
                { slug: 'mixkit-small-engine-passing-1590', name: 'Auto rijdt' },
                { slug: 'mixkit-bicycle-bell-ringing-1585', name: 'Fietsbel' },
                { slug: 'mixkit-car-door-slam-1576', name: 'Autodeur' },
                { slug: 'mixkit-car-horn-1591', name: 'Autohoorn' },
                { slug: 'mixkit-train-ride-loop-2506', name: 'Trein' },
                { slug: 'mixkit-airplane-flying-by-1578', name: 'Vliegtuig' },
                { slug: 'mixkit-helicopter-flying-loop-1580', name: 'Helikopter' },
                { slug: 'mixkit-ship-horn-1583', name: 'Scheepshoorn' },
            ]
        }
    },

    getUrl(slug) {
        return `${MIXKIT_BASE}${slug}.mp3`;
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
    }
};
