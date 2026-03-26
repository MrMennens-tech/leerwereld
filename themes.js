/**
 * LeerZone - Thema Configuratie
 * Bevat alle thema's met hun visuele eigenschappen, items en geluiden
 *
 * _audio koppeling: { type: 'mixkit', id: '...' } overschrijft de synthesizer.
 * Ontbrekende IDs: voeg handmatig toe via de thema-editor of hieronder.
 * Alle IDs zijn geverifieerd via mixkit.co (data-audio-player-item-id-value).
 */

export const Themes = {
    sea: {
        name: 'vis',
        icon: '🐠',
        displayName: 'Zee',
        background: 'linear-gradient(to bottom, #89cff0, #005c99)',
        items: [
            {i:'🐠', n:'vis',      s:'plons',          _audio:{type:'mixkit',id:'3000'}},  // Liquid bubble
            {i:'🦀', n:'krab',     s:'schaar'},                                             // TODO: gebruiker voegt ID toe
            {i:'🐙', n:'octopus',  s:'bubbel',         _audio:{type:'mixkit',id:'2921'}},  // Fish moving in water
            {i:'🐳', n:'walvis',   s:'walvis_geluid'},                                      // TODO
            {i:'🐬', n:'dolfijn',  s:'dolfijn_geluid'},                                     // TODO
            {i:'⭐', n:'zeesster', s:'glinstering',    _audio:{type:'mixkit',id:'937'}}    // Vrolijke bel
        ]
    },
    jungle: {
        name: 'aap',
        icon: '🦁',
        displayName: 'Jungle',
        background: 'linear-gradient(to bottom, #298c1f, #0f3d0a)',
        items: [
            {i:'🐵', n:'aap',      s:'aap_geluid',     _audio:{type:'mixkit',id:'108'}},   // Cartoon monkey
            {i:'🦁', n:'leeuw',    s:'leeuw_brul',     _audio:{type:'mixkit',id:'6'}},     // Wild lion roar
            {i:'🐘', n:'olifant',  s:'olifant_trompet'},                                   // TODO
            {i:'🐍', n:'slang',    s:'slang_sis'},                                          // TODO
            {i:'🦜', n:'papegaai', s:'papegaai_praat', _audio:{type:'mixkit',id:'2437'}},  // Cockatoo squawk
            {i:'🍌', n:'banaan',   s:'hap'}                                                // TODO
        ]
    },
    farm: {
        name: 'koe',
        icon: '🐮',
        displayName: 'Boerderij',
        background: 'linear-gradient(to bottom, #a1d48c, #5c9145)',
        items: [
            {i:'🐮', n:'koe',      s:'koe_boe',        _audio:{type:'mixkit',id:'1751'}},  // Cow moo
            {i:'🐷', n:'varken',   s:'varken_knor'},                                        // TODO
            {i:'🐔', n:'kip',      s:'kip_tok',        _audio:{type:'mixkit',id:'2462'}},  // Rooster crowing
            {i:'🐑', n:'schaap',   s:'schaap_blaat'},                                       // TODO
            {i:'🐴', n:'paard',    s:'paard_hinnik',   _audio:{type:'mixkit',id:'85'}},    // Horse neigh
            {i:'🚜', n:'tractor',  s:'tractor_motor'}                                      // TODO
        ]
    },
    space: {
        name: 'raket',
        icon: '🚀',
        displayName: 'Ruimte',
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
        items: [
            {i:'🚀', n:'raket',    s:'lancering',      _audio:{type:'mixkit',id:'1484'}},  // Speeding swoosh
            {i:'👽', n:'alien',    s:'alien_geluid'},                                       // TODO
            {i:'🪐', n:'planeet',  s:'space_swoosh',   _audio:{type:'mixkit',id:'1557'}},  // Sci-Fi vehicle
            {i:'⭐', n:'ster',     s:'glinstering',    _audio:{type:'mixkit',id:'2069'}},  // Winning a coin
            {i:'☄️', n:'komeet',   s:'swoosh',         _audio:{type:'mixkit',id:'1484'}},  // Speeding swoosh
            {i:'🛰️', n:'satelliet',s:'beep',           _audio:{type:'mixkit',id:'2574'}}   // Interface start
        ]
    },
    christmas: {
        name: 'kerstboom',
        icon: '🎄',
        displayName: 'Kerst',
        background: 'radial-gradient(circle, #fff, #d4e4f3)',
        items: [
            {i:'🎄', n:'kerstboom',s:'kerst_jingle',   _audio:{type:'mixkit',id:'937'}},   // Happy bells
            {i:'🎅', n:'kerstman', s:'kerstman_hohoho'},                                    // TODO
            {i:'🦌', n:'rendier',  s:'rendier_bel',    _audio:{type:'mixkit',id:'933'}},   // Bell notification
            {i:'🎁', n:'cadeau',   s:'cadeau_uitpak',  _audio:{type:'mixkit',id:'2059'}},  // Game level completed
            {i:'🔔', n:'kerstbel', s:'kerstbel_ring',  _audio:{type:'mixkit',id:'2344'}},  // Magic notification ring
            {i:'⛄', n:'sneeuwpop',s:'magisch',        _audio:{type:'mixkit',id:'2344'}}   // Magic notification ring
        ]
    },
    autumn: {
        name: 'blad',
        icon: '🍂',
        displayName: 'Herfst',
        background: 'linear-gradient(to bottom, #d2a679, #8c5a2b)',
        items: [
            {i:'🍁', n:'esdoornblad',s:'blad_ritsel',  _audio:{type:'mixkit',id:'2428'}},  // Dry leaves
            {i:'🍂', n:'blad',     s:'blad_ritsel',    _audio:{type:'mixkit',id:'2428'}},  // Dry leaves
            {i:'🍄', n:'paddenstoel',s:'pop',          _audio:{type:'mixkit',id:'2357'}},  // Bubble pop
            {i:'🎃', n:'pompoen',  s:'plof'},                                               // TODO
            {i:'🐿️', n:'eekhoorn', s:'eekhoorn_piep',  _audio:{type:'mixkit',id:'23'}},   // Little bird chirp
            {i:'🌰', n:'kastanje', s:'tik',            _audio:{type:'mixkit',id:'2580'}}   // Light button
        ]
    },
    spring: {
        name: 'bloem',
        icon: '🌸',
        displayName: 'Lente',
        background: 'linear-gradient(to bottom, #c1f1ac, #78c48a)',
        items: [
            {i:'🌸', n:'bloesem',  s:'lente_bries',    _audio:{type:'mixkit',id:'2427'}},  // Breeze through trees
            {i:'🌷', n:'tulp',     s:'lente_bries',    _audio:{type:'mixkit',id:'2427'}},  // Breeze through trees
            {i:'🦋', n:'vlinder',  s:'vlinder_fladder'},                                   // TODO
            {i:'🐞', n:'lieveheersbeestje',s:'pop',   _audio:{type:'mixkit',id:'2357'}},  // Bubble pop
            {i:'🌱', n:'plantje',  s:'groei_geluid',   _audio:{type:'mixkit',id:'3126'}},  // Water flowing
            {i:'🐣', n:'kuiken',   s:'kuiken_piep',    _audio:{type:'mixkit',id:'23'}}    // Little bird chirp
        ]
    },
    summer: {
        name: 'zon',
        icon: '☀️',
        displayName: 'Zomer',
        background: 'linear-gradient(to bottom, #ffeca7, #ffb13d)',
        items: [
            {i:'☀️', n:'zon',      s:'glinstering',    _audio:{type:'mixkit',id:'937'}},   // Happy bells
            {i:'🍦', n:'ijsje',    s:'hap'},                                                // TODO
            {i:'🏖️', n:'strand',   s:'golfslag',       _audio:{type:'mixkit',id:'3126'}},  // Water flowing
            {i:'🍉', n:'watermeloen',s:'hap'},                                              // TODO
            {i:'🕶️', n:'zonnebril',s:'klik',           _audio:{type:'mixkit',id:'2580'}},  // Light button
            {i:'⛵', n:'zeilboot', s:'plons',           _audio:{type:'mixkit',id:'3000'}}   // Liquid bubble
        ]
    },
    winter: {
        name: 'sneeuwvlok',
        icon: '❄️',
        displayName: 'Winter',
        background: '#ffffff',
        items: [
            {i:'❄️', n:'sneeuwvlok',s:'winter_wind',   _audio:{type:'mixkit',id:'2658'}},  // Wind blowing
            {i:'🧤', n:'handschoenen',s:'stof_geluid'},                                     // TODO
            {i:'🧣', n:'sjaal',    s:'stof_geluid'},                                        // TODO
            {i:'⛸️', n:'schaats',   s:'schaats_ijs'},                                       // TODO
            {i:'🥶', n:'koud',     s:'bibber',         _audio:{type:'mixkit',id:'2658'}},  // Wind blowing
            {i:'🧥', n:'jas',      s:'rits'}                                               // TODO
        ]
    },
    sport: {
        name: 'bal',
        icon: '⚽',
        displayName: 'Sport',
        background: 'linear-gradient(to bottom, #63d471, #238b32)',
        items: [
            {i:'⚽', n:'voetbal',  s:'schot'},                                              // TODO
            {i:'🏀', n:'basketbal',s:'basketbal_stuit'},                                    // TODO
            {i:'🏈', n:'rugbybal', s:'swoosh',         _audio:{type:'mixkit',id:'1484'}},  // Speeding swoosh
            {i:'⚾', n:'honkbal',  s:'honkbal_slag'},                                       // TODO
            {i:'🎾', n:'tennisbal',s:'tennis_slag'},                                        // TODO
            {i:'🏆', n:'beker',    s:'applaus',        _audio:{type:'mixkit',id:'226'}}    // Medieval fanfare
        ]
    },
    colors: {
        name: 'kleur',
        icon: '🌈',
        displayName: 'Kleuren',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        items: [
            {i:'🔴', n:'rood',     s:'toon_1'},
            {i:'🟠', n:'oranje',   s:'toon_2'},
            {i:'🟡', n:'geel',     s:'toon_3'},
            {i:'🟢', n:'groen',    s:'toon_4'},
            {i:'🔵', n:'blauw',    s:'toon_5'},
            {i:'🟣', n:'paars',    s:'toon_6'}
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
            {i:'🔵', n:'cirkel',   s:'vorm_3'},
            {i:'⭐', n:'ster',     s:'glinstering',    _audio:{type:'mixkit',id:'2069'}},  // Winning a coin
            {i:'🔶', n:'ruit',     s:'vorm_4'},
            {i:'❤️', n:'hart',     s:'vorm_5',         _audio:{type:'mixkit',id:'937'}}   // Happy bells
        ]
    },
    supermarket: {
        name: 'winkelwagen',
        icon: '🛒',
        displayName: 'Supermarkt',
        background: 'linear-gradient(to bottom, #e8f5e8, #c8e6c9)',
        items: [
            {i:'🛒', n:'winkelwagen',s:'wiel_geluid'},                                     // TODO
            {i:'🛍️', n:'winkelmandje',s:'mandje_klik', _audio:{type:'mixkit',id:'2580'}},  // Light button
            {i:'💰', n:'geld',     s:'munt_geluid',    _audio:{type:'mixkit',id:'2069'}},  // Winning a coin
            {i:'🚪', n:'schuifdeuren',s:'deur_schuif'},                                    // TODO
            {i:'🥛', n:'melk',     s:'plons',          _audio:{type:'mixkit',id:'3000'}},  // Liquid bubble
            {i:'🍞', n:'brood',    s:'brood_knapper'}                                     // TODO
        ]
    },
    shop: {
        name: 'kleding',
        icon: '🏪',
        displayName: 'Winkel',
        background: 'linear-gradient(to bottom, #a8e6cf, #7fcdcd)',
        items: [
            {i:'👕', n:'kleding',  s:'stof_geluid'},                                        // TODO
            {i:'👟', n:'schoenen', s:'stap_geluid'},                                        // TODO
            {i:'🎒', n:'rugzak',   s:'rits'},                                               // TODO
            {i:'🧸', n:'speelgoed',s:'knuffel_geluid', _audio:{type:'mixkit',id:'937'}},   // Happy bells
            {i:'📱', n:'telefoon', s:'beep',           _audio:{type:'mixkit',id:'2864'}},  // Doorbell tone
            {i:'🛍️', n:'boodschappentas',s:'tas_klik', _audio:{type:'mixkit',id:'2580'}}  // Light button
        ]
    }
};
