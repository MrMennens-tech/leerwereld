/**
 * LeerZone - Thema Configuratie
 * Bevat alle thema's met hun visuele eigenschappen, items en geluiden
 */

export const Themes = {
    sea: {
        name: 'vis',
        icon: '🐠',
        displayName: 'Zee',
        background: 'linear-gradient(to bottom, #89cff0, #005c99)',
        items: [
            {i:'🐠', n:'vis', s:'plons'},
            {i:'🦀', n:'krab', s:'schaar'},
            {i:'🐙', n:'octopus', s:'bubbel'},
            {i:'🐳', n:'walvis', s:'walvis_geluid'},
            {i:'🐬', n:'dolfijn', s:'dolfijn_geluid'},
            {i:'⭐', n:'zeesster', s:'glinstering'}
        ]
    },
    jungle: {
        name: 'aap',
        icon: '🦁',
        displayName: 'Jungle',
        background: 'linear-gradient(to bottom, #298c1f, #0f3d0a)',
        items: [
            {i:'🐵', n:'aap', s:'aap_geluid'},
            {i:'🦁', n:'leeuw', s:'leeuw_brul'},
            {i:'🐘', n:'olifant', s:'olifant_trompet'},
            {i:'🐍', n:'slang', s:'slang_sis'},
            {i:'🦜', n:'papegaai', s:'papegaai_praat'},
            {i:'🍌', n:'banaan', s:'hap'}
        ]
    },
    farm: {
        name: 'koe',
        icon: '🐮',
        displayName: 'Boerderij',
        background: 'linear-gradient(to bottom, #a1d48c, #5c9145)',
        items: [
            {i:'🐮', n:'koe', s:'koe_boe'},
            {i:'🐷', n:'varken', s:'varken_knor'},
            {i:'🐔', n:'kip', s:'kip_tok'},
            {i:'🐑', n:'schaap', s:'schaap_blaat'},
            {i:'🐴', n:'paard', s:'paard_hinnik'},
            {i:'🚜', n:'tractor', s:'tractor_motor'}
        ]
    },
    space: {
        name: 'raket',
        icon: '🚀',
        displayName: 'Ruimte',
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
        items: [
            {i:'🚀', n:'raket', s:'lancering'},
            {i:'👽', n:'alien', s:'alien_geluid'},
            {i:'🪐', n:'planeet', s:'space_swoosh'},
            {i:'⭐', n:'ster', s:'glinstering'},
            {i:'☄️', n:'komeet', s:'swoosh'},
            {i:'🛰️', n:'satelliet', s:'beep'}
        ]
    },
    christmas: {
        name: 'kerstboom',
        icon: '🎄',
        displayName: 'Kerst',
        background: 'radial-gradient(circle, #fff, #d4e4f3)',
        items: [
            {i:'🎄', n:'kerstboom', s:'kerst_jingle'},
            {i:'🎅', n:'kerstman', s:'kerstman_hohoho'},
            {i:'🦌', n:'rendier', s:'rendier_bel'},
            {i:'🎁', n:'cadeau', s:'cadeau_uitpak'},
            {i:'🔔', n:'kerstbel', s:'kerstbel_ring'},
            {i:'⛄', n:'sneeuwpop', s:'magisch'}
        ]
    },
    autumn: {
        name: 'blad',
        icon: '🍂',
        displayName: 'Herfst',
        background: 'linear-gradient(to bottom, #d2a679, #8c5a2b)',
        items: [
            {i:'🍁', n:'esdoornblad', s:'blad_ritsel'},
            {i:'🍂', n:'blad', s:'blad_ritsel'},
            {i:'🍄', n:'paddenstoel', s:'pop'},
            {i:'🎃', n:'pompoen', s:'plof'},
            {i:'🐿️', n:'eekhoorn', s:'eekhoorn_piep'},
            {i:'🌰', n:'kastanje', s:'tik'}
        ]
    },
    spring: {
        name: 'bloem',
        icon: '🌸',
        displayName: 'Lente',
        background: 'linear-gradient(to bottom, #c1f1ac, #78c48a)',
        items: [
            {i:'🌸', n:'bloesem', s:'lente_bries'},
            {i:'🌷', n:'tulp', s:'lente_bries'},
            {i:'🦋', n:'vlinder', s:'vlinder_fladder'},
            {i:'🐞', n:'lieveheersbeestje', s:'pop'},
            {i:'🌱', n:'plantje', s:'groei_geluid'},
            {i:'🐣', n:'kuiken', s:'kuiken_piep'}
        ]
    },
    summer: {
        name: 'zon',
        icon: '☀️',
        displayName: 'Zomer',
        background: 'linear-gradient(to bottom, #ffeca7, #ffb13d)',
        items: [
            {i:'☀️', n:'zon', s:'glinstering'},
            {i:'🍦', n:'ijsje', s:'hap'},
            {i:'🏖️', n:'strand', s:'golfslag'},
            {i:'🍉', n:'watermeloen', s:'hap'},
            {i:'🕶️', n:'zonnebril', s:'klik'},
            {i:'⛵', n:'zeilboot', s:'plons'}
        ]
    },
    winter: {
        name: 'sneeuwvlok',
        icon: '❄️',
        displayName: 'Winter',
        background: '#ffffff',
        items: [
            {i:'❄️', n:'sneeuwvlok', s:'winter_wind'},
            {i:'🧤', n:'handschoenen', s:'stof_geluid'},
            {i:'🧣', n:'sjaal', s:'stof_geluid'},
            {i:'⛸️', n:'schaats', s:'schaats_ijs'},
            {i:'🥶', n:'koud', s:'bibber'},
            {i:'🧥', n:'jas', s:'rits'}
        ]
    },
    sport: {
        name: 'bal',
        icon: '⚽',
        displayName: 'Sport',
        background: 'linear-gradient(to bottom, #63d471, #238b32)',
        items: [
            {i:'⚽', n:'voetbal', s:'schot'},
            {i:'🏀', n:'basketbal', s:'basketbal_stuit'},
            {i:'🏈', n:'rugbybal', s:'swoosh'},
            {i:'⚾', n:'honkbal', s:'honkbal_slag'},
            {i:'🎾', n:'tennisbal', s:'tennis_slag'},
            {i:'🏆', n:'beker', s:'applaus'}
        ]
    },
    colors: {
        name: 'kleur',
        icon: '🌈',
        displayName: 'Kleuren',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', // Rustige pastel achtergrond
        items: [
            {i:'🔴', n:'rood', s:'toon_1'},
            {i:'🟠', n:'oranje', s:'toon_2'},
            {i:'🟡', n:'geel', s:'toon_3'},
            {i:'🟢', n:'groen', s:'toon_4'},
            {i:'🔵', n:'blauw', s:'toon_5'},
            {i:'🟣', n:'paars', s:'toon_6'}
        ]
    },
    shapes: {
        name: 'vorm',
        icon: '⭐',
        displayName: 'Vormen',
        background: 'linear-gradient(to right, #e0e0e0, #f5f5f5, #e0e0e0)',
        items: [
            {i:'🟥', n:'vierkant', s:'vorm_1'},
            {i:'🔺', n:'driehoek', s:'vorm_2'},
            {i:'🔵', n:'cirkel', s:'vorm_3'},
            {i:'⭐', n:'ster', s:'glinstering'},
            {i:'🔶', n:'ruit', s:'vorm_4'},
            {i:'❤️', n:'hart', s:'vorm_5'}
        ]
    },
    supermarket: {
        name: 'winkelwagen',
        icon: '🛒',
        displayName: 'Supermarkt',
        background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c9)',
        items: [
            {i:'🛒', n:'winkelwagen', s:'wiel_geluid'},
            {i:'🛍️', n:'winkelmandje', s:'mandje_klik'},
            {i:'💰', n:'geld', s:'munt_geluid'},
            {i:'🚪', n:'schuifdeuren', s:'deur_schuif'},
            {i:'🥛', n:'melk', s:'plons'},
            {i:'🍞', n:'brood', s:'brood_knapper'}
        ]
    },
    shop: {
        name: 'kleding',
        icon: '🏪',
        displayName: 'Winkel',
        background: 'linear-gradient(to bottom, #a8e6cf, #7fcdcd)',
        items: [
            {i:'👕', n:'kleding', s:'stof_geluid'},
            {i:'👟', n:'schoenen', s:'stap_geluid'},
            {i:'🎒', n:'rugzak', s:'rits'},
            {i:'🧸', n:'speelgoed', s:'knuffel_geluid'},
            {i:'📱', n:'telefoon', s:'beep'},
            {i:'🛍️', n:'boodschappentas', s:'tas_klik'}
        ]
    }
};

