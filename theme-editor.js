/**
 * LeerZone - Thema Editor
 * Volledige UI voor het maken en bewerken van eigen thema's
 */

import { CustomThemeStore } from './theme-store.js';
import { MixkitSounds } from './mixkit-sounds.js';

const MAX_AUDIO_SECONDS = 5;
const MAX_PREVIEW_MS = 2000; // preview-knop stopt altijd na 2 seconden

// --- EMOJI DATA (Dutch names for search) ---
const EMOJI_DATA = [
    // Dieren
    { e:'🐶',n:'hond' },{ e:'🐱',n:'kat' },{ e:'🐭',n:'muis' },{ e:'🐹',n:'hamster' },
    { e:'🐰',n:'konijn' },{ e:'🦊',n:'vos' },{ e:'🐻',n:'beer' },{ e:'🐼',n:'panda' },
    { e:'🐨',n:'koala' },{ e:'🐯',n:'tijger' },{ e:'🦁',n:'leeuw' },{ e:'🐮',n:'koe' },
    { e:'🐷',n:'varken' },{ e:'🐸',n:'kikker' },{ e:'🐵',n:'aap' },{ e:'🐔',n:'kip' },
    { e:'🐧',n:'pinguïn' },{ e:'🐦',n:'vogel' },{ e:'🐤',n:'kuiken' },{ e:'🦆',n:'eend' },
    { e:'🦅',n:'adelaar' },{ e:'🦉',n:'uil' },{ e:'🦇',n:'vleermuis' },{ e:'🐺',n:'wolf' },
    { e:'🐴',n:'paard' },{ e:'🦄',n:'eenhoorn' },{ e:'🐝',n:'bij' },{ e:'🦋',n:'vlinder' },
    { e:'🐌',n:'slak' },{ e:'🐞',n:'lieveheersbeestje' },{ e:'🐢',n:'schildpad' },
    { e:'🐍',n:'slang' },{ e:'🦎',n:'hagedis' },{ e:'🦕',n:'dinosaurus' },
    { e:'🐊',n:'krokodil' },{ e:'🐳',n:'walvis' },{ e:'🐬',n:'dolfijn' },
    { e:'🐟',n:'vis' },{ e:'🐠',n:'tropische vis' },{ e:'🦈',n:'haai' },
    { e:'🐙',n:'octopus' },{ e:'🦀',n:'krab' },{ e:'🐚',n:'schelp' },
    { e:'🦜',n:'papegaai' },{ e:'🦩',n:'flamingo' },{ e:'🦢',n:'zwaan' },
    { e:'🦚',n:'pauw' },{ e:'🐓',n:'haan' },{ e:'🦃',n:'kalkoen' },
    { e:'🐑',n:'schaap' },{ e:'🐐',n:'geit' },{ e:'🦙',n:'lama' },
    { e:'🦘',n:'kangoeroe' },{ e:'🦔',n:'egel' },{ e:'🐿️',n:'eekhoorn' },
    { e:'🐘',n:'olifant' },{ e:'🦏',n:'neushoorn' },{ e:'🦛',n:'nijlpaard' },
    { e:'🐪',n:'kameel' },{ e:'🦒',n:'giraf' },{ e:'🦓',n:'zebra' },
    // Natuur
    { e:'🌸',n:'bloesem' },{ e:'🌹',n:'roos' },{ e:'🌺',n:'bloem' },
    { e:'🌻',n:'zonnebloem' },{ e:'🌼',n:'madeliefje' },{ e:'🌷',n:'tulp' },
    { e:'🌱',n:'plantje' },{ e:'🌲',n:'boom' },{ e:'🌳',n:'eik' },
    { e:'🌴',n:'palmboom' },{ e:'🌵',n:'cactus' },{ e:'🍀',n:'klavertje' },
    { e:'🍁',n:'esdoornblad' },{ e:'🍂',n:'herfstblad' },{ e:'🍃',n:'blad' },
    { e:'🍄',n:'paddenstoel' },{ e:'🌾',n:'graan' },{ e:'☀️',n:'zon' },
    { e:'⛅',n:'bewolkt' },{ e:'🌧️',n:'regen' },{ e:'⛈️',n:'onweer' },
    { e:'❄️',n:'sneeuwvlok' },{ e:'🌊',n:'golf zee' },{ e:'🌈',n:'regenboog' },
    { e:'🌙',n:'maan' },{ e:'⭐',n:'ster' },{ e:'🌟',n:'glinsterende ster' },
    { e:'⚡',n:'bliksem' },{ e:'🔥',n:'vuur' },{ e:'💧',n:'waterdruppel' },
    { e:'🌍',n:'aarde wereld' },{ e:'🏔️',n:'berg' },{ e:'🌋',n:'vulkaan' },
    { e:'🏖️',n:'strand' },{ e:'🏝️',n:'eiland' },{ e:'🌅',n:'zonsopgang' },
    // Eten
    { e:'🍎',n:'appel' },{ e:'🍊',n:'sinaasappel' },{ e:'🍋',n:'citroen' },
    { e:'🍇',n:'druiven' },{ e:'🍓',n:'aardbei' },{ e:'🍒',n:'kers' },
    { e:'🍑',n:'perzik' },{ e:'🍉',n:'watermeloen' },{ e:'🍌',n:'banaan' },
    { e:'🍍',n:'ananas' },{ e:'🥝',n:'kiwi' },{ e:'🥦',n:'broccoli' },
    { e:'🥕',n:'wortel' },{ e:'🌽',n:'mais' },{ e:'🍅',n:'tomaat' },
    { e:'🥔',n:'aardappel' },{ e:'🍄',n:'paddenstoel' },{ e:'🥑',n:'avocado' },
    { e:'🍕',n:'pizza' },{ e:'🍔',n:'hamburger' },{ e:'🍟',n:'friet' },
    { e:'🌮',n:'taco' },{ e:'🍦',n:'ijsje' },{ e:'🎂',n:'taart verjaardag' },
    { e:'🍰',n:'taartpunt' },{ e:'🍩',n:'donut' },{ e:'🍪',n:'koekje' },
    { e:'🍫',n:'chocolade' },{ e:'🍬',n:'snoep' },{ e:'🍭',n:'lolly' },
    { e:'🥤',n:'drankje' },{ e:'🍼',n:'fles baby' },{ e:'☕',n:'koffie thee' },
    { e:'🍵',n:'kopje thee' },{ e:'🧃',n:'sap pakje' },{ e:'🍞',n:'brood' },
    // Voertuigen
    { e:'🚗',n:'auto' },{ e:'🚕',n:'taxi' },{ e:'🚌',n:'bus' },
    { e:'🚑',n:'ambulance' },{ e:'🚒',n:'brandweerauto' },{ e:'🚓',n:'politieauto' },
    { e:'🚚',n:'vrachtwagen' },{ e:'🚜',n:'tractor' },{ e:'🚲',n:'fiets' },
    { e:'🛵',n:'scooter' },{ e:'✈️',n:'vliegtuig' },{ e:'🚀',n:'raket' },
    { e:'🛸',n:'ufo' },{ e:'🚁',n:'helikopter' },{ e:'⛵',n:'zeilboot' },
    { e:'🚢',n:'schip' },{ e:'🚂',n:'trein' },{ e:'🚃',n:'wagon' },
    // Objecten & Sport
    { e:'⚽',n:'voetbal' },{ e:'🏀',n:'basketbal' },{ e:'🏈',n:'rugby' },
    { e:'⚾',n:'honkbal' },{ e:'🎾',n:'tennis' },{ e:'🏐',n:'volleybal' },
    { e:'🎯',n:'doel pijl' },{ e:'🎮',n:'gamecontroller' },{ e:'🎲',n:'dobbelstenen' },
    { e:'🎵',n:'muzieknoot' },{ e:'🎶',n:'muzieknoten' },{ e:'🎸',n:'gitaar' },
    { e:'🎹',n:'piano' },{ e:'🥁',n:'drum' },{ e:'🎺',n:'trompet' },
    { e:'🎻',n:'viool' },{ e:'📚',n:'boeken' },{ e:'📖',n:'boek' },
    { e:'✏️',n:'potlood' },{ e:'🖍️',n:'kleurpotlood' },{ e:'🎨',n:'verfpalet' },
    { e:'🏠',n:'huis' },{ e:'🏫',n:'school' },{ e:'🏥',n:'ziekenhuis' },
    { e:'🎃',n:'pompoen halloween' },{ e:'🎄',n:'kerstboom' },{ e:'🎅',n:'kerstman' },
    { e:'🎁',n:'cadeau cadeautje' },{ e:'🎉',n:'feest confetti' },{ e:'🎊',n:'ballonnen' },
    { e:'🧸',n:'teddybeer knuffel' },{ e:'🪆',n:'matrjosjka' },{ e:'🎠',n:'carrousel' },
    { e:'🛝',n:'glijbaan' },{ e:'🪁',n:'katapult' },{ e:'🧩',n:'puzzel' },
    // Vormen & Kleuren
    { e:'🔴',n:'rood cirkel' },{ e:'🟠',n:'oranje cirkel' },{ e:'🟡',n:'geel cirkel' },
    { e:'🟢',n:'groen cirkel' },{ e:'🔵',n:'blauw cirkel' },{ e:'🟣',n:'paars cirkel' },
    { e:'🟥',n:'rood vierkant' },{ e:'🟧',n:'oranje vierkant' },{ e:'🟨',n:'geel vierkant' },
    { e:'🟩',n:'groen vierkant' },{ e:'🟦',n:'blauw vierkant' },{ e:'🟪',n:'paars vierkant' },
    { e:'🔺',n:'rode driehoek' },{ e:'💎',n:'diamant ruit' },{ e:'⭐',n:'ster' },
    { e:'❤️',n:'rood hart' },{ e:'🧡',n:'oranje hart' },{ e:'💛',n:'geel hart' },
    { e:'💚',n:'groen hart' },{ e:'💙',n:'blauw hart' },{ e:'💜',n:'paars hart' },
    { e:'🌈',n:'regenboog kleuren' },
    // Mensen & Emoties
    { e:'😀',n:'blij lachen' },{ e:'😂',n:'huilen lachen' },{ e:'😍',n:'verliefd' },
    { e:'😎',n:'cool zonnebril' },{ e:'🤔',n:'denken nadenken' },{ e:'😴',n:'slapen moe' },
    { e:'😱',n:'schrik bang' },{ e:'🤗',n:'knuffel blij' },{ e:'👍',n:'duim omhoog goed' },
    { e:'👎',n:'duim omlaag nee' },{ e:'👋',n:'zwaaien hallo' },{ e:'🙌',n:'applaus' },
    { e:'💪',n:'sterk spieren' },{ e:'🤝',n:'handdruk' },{ e:'✌️',n:'vrede vingers' },
    { e:'👑',n:'kroon koning' },{ e:'🧢',n:'pet cap' },{ e:'👒',n:'hoed' },
    { e:'🎓',n:'diploma afstuderen school' },{ e:'🧑',n:'persoon kind' },
    { e:'👶',n:'baby' },{ e:'👩',n:'vrouw meisje' },{ e:'👨',n:'man jongen' },
];

// Alle ingebouwde geluidsnamen voor de dropdown
const BUILTIN_SOUNDS = [
    { value: 'plons', label: 'Plons' },
    { value: 'schaar', label: 'Klik/Schaar' },
    { value: 'bubbel', label: 'Bubbel' },
    { value: 'glinstering', label: 'Glinstering / Ster' },
    { value: 'hap', label: 'Hap' },
    { value: 'pop', label: 'Pop / Klik' },
    { value: 'tik', label: 'Tik' },
    { value: 'plof', label: 'Plof' },
    { value: 'swoosh', label: 'Swoosh' },
    { value: 'beep', label: 'Beep' },
    { value: 'rits', label: 'Rits' },
    { value: 'klik', label: 'Klik (UI)' },
    { value: 'aap_geluid', label: 'Aap' },
    { value: 'leeuw_brul', label: 'Leeuw brul' },
    { value: 'olifant_trompet', label: 'Olifant trompet' },
    { value: 'slang_sis', label: 'Slang sis' },
    { value: 'papegaai_praat', label: 'Papegaai' },
    { value: 'koe_boe', label: 'Koe boe' },
    { value: 'varken_knor', label: 'Varken knor' },
    { value: 'kip_tok', label: 'Kip tok' },
    { value: 'schaap_blaat', label: 'Schaap blaat' },
    { value: 'paard_hinnik', label: 'Paard hinnik' },
    { value: 'tractor_motor', label: 'Tractor motor' },
    { value: 'walvis_geluid', label: 'Walvis' },
    { value: 'dolfijn_geluid', label: 'Dolfijn' },
    { value: 'lancering', label: 'Raket lancering' },
    { value: 'alien_geluid', label: 'Alien' },
    { value: 'space_swoosh', label: 'Space swoosh' },
    { value: 'kerst_jingle', label: 'Kerst jingle' },
    { value: 'kerstman_hohoho', label: 'Kerstman ho ho' },
    { value: 'rendier_bel', label: 'Rendier bel' },
    { value: 'kerstbel_ring', label: 'Kerstbel' },
    { value: 'magisch', label: 'Magisch' },
    { value: 'blad_ritsel', label: 'Blad ritsel' },
    { value: 'eekhoorn_piep', label: 'Eekhoorn piep' },
    { value: 'lente_bries', label: 'Lente bries' },
    { value: 'vlinder_fladder', label: 'Vlinder' },
    { value: 'groei_geluid', label: 'Groei' },
    { value: 'kuiken_piep', label: 'Kuiken piep' },
    { value: 'golfslag', label: 'Golfslag strand' },
    { value: 'winter_wind', label: 'Winter wind' },
    { value: 'schaats_ijs', label: 'Schaatsen' },
    { value: 'bibber', label: 'Bibber koud' },
    { value: 'schot', label: 'Voetbal schot' },
    { value: 'basketbal_stuit', label: 'Basketbal stuit' },
    { value: 'honkbal_slag', label: 'Honkbal slag' },
    { value: 'tennis_slag', label: 'Tennis slag' },
    { value: 'applaus', label: 'Applaus' },
    { value: 'toon_1', label: 'Toon rood (C)' },
    { value: 'toon_2', label: 'Toon oranje (D)' },
    { value: 'toon_3', label: 'Toon geel (E)' },
    { value: 'toon_4', label: 'Toon groen (G)' },
    { value: 'toon_5', label: 'Toon blauw (A)' },
    { value: 'toon_6', label: 'Toon paars (C+)' },
    { value: 'munt_geluid', label: 'Munt geluid' },
    { value: 'deur_schuif', label: 'Schuifdeur' },
    { value: 'stap_geluid', label: 'Voetstappe' },
    { value: 'knuffel_geluid', label: 'Knuffel' },
];

export const ThemeEditor = {
    _navigate: null,
    editingId: null,
    itemAudio: Array.from({ length: 6 }, () => ({})),
    mediaRecorder: null,
    recordingTimers: [],
    activeRecordingIndex: -1,
    _emojiPickerEl: null,
    _emojiCallback: null,
    _mixkitPickerEl: null,
    _mixkitPickerCallback: null,
    _mixkitPickerAudio: null,
    _mixkitPickerActiveBtn: null,

    init(navigateFn) {
        this._navigate = navigateFn;

        document.getElementById('close-theme-editor-button')
            ?.addEventListener('click', () => this.close());

        // Bouw emoji picker eenmalig
        this._emojiPickerEl = this._createEmojiPickerEl();
        document.body.appendChild(this._emojiPickerEl);

        // Bouw Mixkit geluid picker eenmalig
        this._mixkitPickerEl = this._createMixkitPickerEl();
        document.body.appendChild(this._mixkitPickerEl);

        // Thema icoon – emoji picker
        document.getElementById('te-theme-emoji-btn')
            ?.addEventListener('click', () => {
                this._openEmojiPicker(document.getElementById('te-theme-emoji-btn'), (emoji) => {
                    const preview = document.getElementById('te-icon-preview');
                    if (preview) {
                        preview.textContent = emoji;
                        preview.style.backgroundImage = '';
                        preview.dataset.value = emoji;
                    }
                });
            });

        // Thema icoon – upload
        document.getElementById('te-icon-upload')
            ?.addEventListener('click', () => document.getElementById('te-icon-file').click());
        document.getElementById('te-icon-file')
            ?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this._handleIconUpload(file, 'te-icon-preview', null);
                e.target.value = '';
            });

        // Achtergrond type toggle
        document.querySelectorAll('[data-bg-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-bg-type]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const type = btn.dataset.bgType;
                document.getElementById('te-bg-gradient').style.display = type === 'gradient' ? '' : 'none';
                document.getElementById('te-bg-solid').style.display = type === 'solid' ? '' : 'none';
                this._updateBgPreview();
            });
        });

        // Achtergrond kleur pickers
        ['te-bg-color1', 'te-bg-color2', 'te-bg-direction', 'te-bg-solid-color'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this._updateBgPreview());
        });

        // Actie knoppen
        document.getElementById('te-save-btn')
            ?.addEventListener('click', () => this.save());
        document.getElementById('te-export-btn')
            ?.addEventListener('click', () => this.exportTheme());
        document.getElementById('te-send-btn')
            ?.addEventListener('click', () => this.sendToMaker());

        // Import JSON knop
        document.getElementById('te-import-btn')
            ?.addEventListener('click', () => document.getElementById('te-import-file').click());
        document.getElementById('te-import-file')
            ?.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    await CustomThemeStore.importJSON(file);
                    document.dispatchEvent(new CustomEvent('leerzone:themes-changed'));
                    this._showToast('Thema geïmporteerd!');
                    this.close();
                } catch (err) {
                    this._showToast('Fout: ' + err.message, true);
                }
                e.target.value = '';
            });

        this._initItemEditors();
    },

    open(themeId = null) {
        this.editingId = themeId;
        if (themeId) {
            // Laad via Utils.themes zodat ook ingebouwde én overridden thema's werken
            // Utils wordt geïmporteerd als circulaire dep — gebruik window.Utils of pass via callback
            // Oplossing: CustomThemeStore.getAllThemes() geeft alles (ingebouwd + custom)
            const theme = CustomThemeStore.getAllThemes()[themeId];
            if (theme) this._loadTheme(theme);
            const isBuiltin = !theme?.isCustom;
            document.getElementById('theme-editor-title').textContent =
                isBuiltin ? 'Ingebouwd thema aanpassen' : 'Thema Bewerken';
        } else {
            this._resetEditor();
            document.getElementById('theme-editor-title').textContent = 'Nieuw Thema';
        }
        this._navigate('theme-editor-view');
    },

    close() {
        this._stopAllRecording();
        this._navigate('theme-selector-view');
    },

    save() {
        const name = document.getElementById('te-name').value.trim();
        if (!name) {
            this._showToast('Vul een naam in voor het thema', true);
            return;
        }

        const icon = this._getIconValue();
        const background = this._buildBackground();

        const items = [];
        for (let i = 0; i < 6; i++) {
            const container = document.querySelector(`.item-editor[data-index="${i}"]`);
            if (!container) continue;

            const iconEl = container.querySelector('.te-item-icon-preview');
            const nameEl = container.querySelector('.te-item-name');
            const itemIcon = iconEl?.dataset.value || iconEl?.textContent || '❓';
            const itemName = nameEl?.value.trim() || `item ${i + 1}`;

            const audio = this.itemAudio[i];
            let soundKey = 'klik';
            if (audio.type === 'builtin') {
                soundKey = audio.value;
            } else {
                soundKey = `lz_custom_item_${i}`;
            }

            items.push({
                i: itemIcon,
                n: itemName,
                s: soundKey,
                _audio: Object.keys(audio).length ? audio : undefined
            });
        }

        const theme = {
            id: this.editingId || undefined,
            name: name.toLowerCase().replace(/\s+/g, '_'),
            displayName: name,
            icon,
            background,
            isCustom: true,
            items
        };

        const id = CustomThemeStore.save(theme);
        this.editingId = id;
        document.dispatchEvent(new CustomEvent('leerzone:themes-changed'));
        this._showToast('Thema opgeslagen!');
    },

    exportTheme() {
        if (!this.editingId) {
            this.save();
            setTimeout(() => {
                if (this.editingId) CustomThemeStore.exportJSON(this.editingId);
            }, 100);
        } else {
            CustomThemeStore.exportJSON(this.editingId);
        }
    },

    sendToMaker() {
        this.exportTheme();
        setTimeout(() => {
            this._showToast('JSON bestand gedownload. Stuur dit bestand op via e-mail of WhatsApp naar de maker.');
        }, 300);
    },

    // --- PRIVATE ---

    _initItemEditors() {
        const container = document.getElementById('te-items-container');
        if (!container) return;

        container.innerHTML = Array.from({ length: 6 }, (_, i) =>
            this._buildItemEditorHTML(i)
        ).join('');

        for (let i = 0; i < 6; i++) {
            this._bindItemEditor(i);
        }
    },

    _buildItemEditorHTML(i) {
        const builtinOptions = BUILTIN_SOUNDS
            .map(s => `<option value="${s.value}">${s.label}</option>`)
            .join('');

        const mixkitCategories = Object.entries(MixkitSounds.categories)
            .map(([id, cat]) => `<option value="${id}">${cat.icon} ${cat.label}</option>`)
            .join('');

        return `
        <div class="item-editor" data-index="${i}">
            <div class="item-editor-header">
                <span class="item-number">Item ${i + 1}</span>
            </div>

            <div class="editor-row">
                <!-- Icoon -->
                <div class="editor-field">
                    <label>Icoon</label>
                    <div class="icon-picker-row">
                        <span class="te-item-icon-preview icon-preview" data-value="❓">❓</span>
                        <button class="te-emoji-pick-btn setting-button small-btn">🙂 Kies emoji</button>
                        <button class="te-item-icon-upload setting-button small-btn" title="Afbeelding uploaden">📁</button>
                        <input type="file" class="te-item-icon-file" accept="image/*" hidden>
                    </div>
                </div>

                <!-- Naam -->
                <div class="editor-field">
                    <label>Naam</label>
                    <input type="text" class="te-item-name text-input" placeholder="bijv. hond" maxlength="30">
                </div>
            </div>

            <!-- Geluid -->
            <div class="editor-field">
                <label>Geluid <span class="audio-limit-note">(max ${MAX_AUDIO_SECONDS}s)</span></label>
                <div class="sound-tabs">
                    <button class="sound-tab active" data-tab="builtin">Synthetisch</button>
                    <button class="sound-tab" data-tab="mixkit">Mixkit</button>
                    <button class="sound-tab" data-tab="record">Opname</button>
                    <button class="sound-tab" data-tab="upload">Upload</button>
                </div>

                <div class="sound-tab-panel" data-tab="builtin">
                    <select class="te-item-sound-builtin full-width">
                        ${builtinOptions}
                    </select>
                    <button class="te-builtin-test setting-button small-btn">▶ Test</button>
                </div>

                <div class="sound-tab-panel hidden" data-tab="mixkit">
                    <div class="mixkit-selected-info">Geen geluid geselecteerd</div>
                    <button class="te-mixkit-pick-btn setting-button">🔊 Kies geluid</button>
                    <details class="mixkit-custom-id" style="margin-top:1vmin">
                        <summary>Eigen Mixkit ID invoeren (via F12)</summary>
                        <p class="audio-info" style="margin:0.5vmin 0">Ga naar mixkit.co → F12 → inspecteer afspeelknop → zoek data-audio-player-item-id-value</p>
                        <div class="mixkit-url-row">
                            <input type="number" class="te-mixkit-custom-id text-input" placeholder="bijv. 54" min="1" style="width:120px">
                            <button class="te-mixkit-custom-preview setting-button small-btn">▶ Test</button>
                            <button class="te-mixkit-custom-use setting-button small-btn">Gebruik</button>
                        </div>
                    </details>
                </div>

                <div class="sound-tab-panel hidden" data-tab="record">
                    <div class="record-controls">
                        <button class="te-record-start setting-button">🔴 Start opname</button>
                        <button class="te-record-stop setting-button hidden">⏹ Stop</button>
                        <span class="record-timer">0s / ${MAX_AUDIO_SECONDS}s</span>
                    </div>
                    <div class="record-playback hidden">
                        <button class="te-record-play setting-button">▶ Afspelen</button>
                        <span class="record-status"></span>
                    </div>
                    <p class="audio-info">Opname stopt automatisch na ${MAX_AUDIO_SECONDS} seconden</p>
                </div>

                <div class="sound-tab-panel hidden" data-tab="upload">
                    <button class="te-audio-upload setting-button">📁 Audiobestand kiezen</button>
                    <input type="file" class="te-audio-file" accept="audio/*" hidden>
                    <div class="upload-info-row hidden">
                        <span class="upload-filename"></span>
                        <button class="te-audio-play setting-button small-btn">▶ Afspelen</button>
                    </div>
                    <p class="audio-info">Max ${MAX_AUDIO_SECONDS} seconden – MP3, WAV, OGG</p>
                </div>
            </div>
        </div>`;
    },

    _bindItemEditor(i) {
        const container = document.querySelector(`.item-editor[data-index="${i}"]`);
        if (!container) return;

        // Icoon – emoji picker
        const iconPreview = container.querySelector('.te-item-icon-preview');
        const emojiPickBtn = container.querySelector('.te-emoji-pick-btn');
        emojiPickBtn?.addEventListener('click', () => {
            this._openEmojiPicker(emojiPickBtn, (emoji) => {
                if (iconPreview) {
                    iconPreview.textContent = emoji;
                    iconPreview.dataset.value = emoji;
                    iconPreview.style.backgroundImage = '';
                }
            });
        });

        // Icoon – upload
        const iconUploadBtn = container.querySelector('.te-item-icon-upload');
        const iconFileInput = container.querySelector('.te-item-icon-file');
        iconUploadBtn?.addEventListener('click', () => iconFileInput.click());
        iconFileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this._handleIconUpload(file, iconPreview, null);
            e.target.value = '';
        });

        // Sound tabs
        container.querySelectorAll('.sound-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.sound-tab').forEach(t => t.classList.remove('active'));
                container.querySelectorAll('.sound-tab-panel').forEach(p => p.classList.add('hidden'));
                tab.classList.add('active');
                container.querySelector(`.sound-tab-panel[data-tab="${tab.dataset.tab}"]`)?.classList.remove('hidden');

                // Sla audio type op
                if (!this.itemAudio[i].type || this.itemAudio[i].type !== tab.dataset.tab) {
                    if (tab.dataset.tab === 'builtin') {
                        const sel = container.querySelector('.te-item-sound-builtin');
                        this.itemAudio[i] = { type: 'builtin', value: sel?.value || 'klik' };
                    }
                }

            });
        });

        // Builtin sound select
        const builtinSel = container.querySelector('.te-item-sound-builtin');
        builtinSel?.addEventListener('change', (e) => {
            this.itemAudio[i] = { type: 'builtin', value: e.target.value };
        });
        if (builtinSel) {
            this.itemAudio[i] = { type: 'builtin', value: builtinSel.value };
        }

        // Builtin test
        container.querySelector('.te-builtin-test')?.addEventListener('click', () => {
            const val = builtinSel?.value;
            if (val) document.dispatchEvent(new CustomEvent('leerzone:play-sound', { detail: val }));
        });

        // Mixkit picker knop
        const mixkitPickBtn = container.querySelector('.te-mixkit-pick-btn');
        const mixkitInfoEl = container.querySelector('.mixkit-selected-info');
        mixkitPickBtn?.addEventListener('click', () => {
            this._openMixkitPicker(mixkitPickBtn, (sound) => {
                this.itemAudio[i] = { type: 'mixkit', id: sound.id };
                if (mixkitInfoEl) {
                    mixkitInfoEl.innerHTML = `${sound.icon || '🔊'} <strong>${sound.name}</strong>`;
                }
            });
        });

        // Mixkit eigen ID
        const customIdInput = container.querySelector('.te-mixkit-custom-id');
        const customPreviewBtn = container.querySelector('.te-mixkit-custom-preview');
        let _customAudio = null;
        customPreviewBtn?.addEventListener('click', () => {
            // Stop indien al spelend
            if (_customAudio && !_customAudio.paused) {
                _customAudio.pause();
                _customAudio.currentTime = 0;
                customPreviewBtn.textContent = '▶ Test';
                _customAudio = null;
                return;
            }
            const id = customIdInput?.value.trim();
            if (!id) return;
            const url = MixkitSounds.getUrl(id);
            _customAudio = new Audio(url);
            _customAudio.volume = 0.5;
            customPreviewBtn.textContent = '⏹ Stop';
            const stopCustom = () => {
                if (_customAudio && !_customAudio.paused) _customAudio.pause();
                customPreviewBtn.textContent = '▶ Test';
                _customAudio = null;
            };
            _customAudio.play().catch(() => {
                this._showToast('ID niet gevonden of geen verbinding.', true);
                stopCustom();
            });
            _customAudio.addEventListener('ended', stopCustom);
            setTimeout(stopCustom, MAX_PREVIEW_MS);
        });
        container.querySelector('.te-mixkit-custom-use')?.addEventListener('click', () => {
            const id = customIdInput?.value.trim();
            if (!id) return;
            this.itemAudio[i] = { type: 'mixkit', id };
            const infoEl = container.querySelector('.mixkit-selected-info');
            if (infoEl) infoEl.textContent = `Geselecteerd: eigen ID ${id}`;
            this._showToast(`Mixkit ID ${id} geselecteerd`);
        });

        // Opname
        this._bindRecording(container, i);

        // Upload
        this._bindUpload(container, i);
    },

    _createMixkitPickerEl() {
        const picker = document.createElement('div');
        picker.className = 'mixkit-picker hidden';

        const catOptions = Object.entries(MixkitSounds.categories)
            .map(([id, cat]) => `<button class="mxp-cat-btn" data-cat="${id}">${cat.icon} ${cat.label}</button>`)
            .join('');

        picker.innerHTML = `
            <div class="mxp-header">
                <input type="text" class="mxp-search text-input" placeholder="🔍 Zoek geluid..." autocomplete="off">
                <button class="mxp-close setting-button small-btn">✕</button>
            </div>
            <div class="mxp-cats">
                <button class="mxp-cat-btn active" data-cat="">Alle</button>
                ${catOptions}
            </div>
            <div class="mxp-list"></div>`;

        picker.querySelector('.mxp-close').addEventListener('click', () => this._hideMixkitPicker());

        // Sluit bij klik buiten
        document.addEventListener('click', (e) => {
            if (!picker.classList.contains('hidden') &&
                !picker.contains(e.target) &&
                !e.target.closest('.te-mixkit-pick-btn')) {
                this._hideMixkitPicker();
            }
        }, true);

        // Zoekbalk
        picker.querySelector('.mxp-search').addEventListener('input', (e) => {
            this._renderMixkitPickerList(e.target.value, '');
            picker.querySelectorAll('.mxp-cat-btn').forEach(b => b.classList.remove('active'));
        });

        // Categorie knoppen
        picker.querySelectorAll('.mxp-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                picker.querySelectorAll('.mxp-cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                picker.querySelector('.mxp-search').value = '';
                this._renderMixkitPickerList('', btn.dataset.cat);
            });
        });

        return picker;
    },

    _renderMixkitPickerList(query, catId) {
        const picker = this._mixkitPickerEl;
        if (!picker) return;

        // Stop eventueel spelend geluid
        this._stopMixkitPickerAudio();

        const sounds = query?.trim()
            ? MixkitSounds.search(query)
            : catId
                ? MixkitSounds.getSoundsByCategory(catId)
                : MixkitSounds.getAllSounds();

        const listEl = picker.querySelector('.mxp-list');
        listEl.innerHTML = sounds.length
            ? sounds.map(s => `
                <div class="mxp-item" data-id="${s.id}" data-name="${s.name}" data-icon="${s.icon || '🔊'}">
                    <span class="mxp-icon">${s.icon || '🔊'}</span>
                    <span class="mxp-name">${s.name}</span>
                    <span class="mxp-cat-label">${s.categoryLabel || ''}</span>
                    <button class="mxp-play setting-button small-btn" data-id="${s.id}">▶</button>
                    <button class="mxp-use setting-button small-btn" data-id="${s.id}">✓</button>
                </div>`).join('')
            : '<p class="audio-info" style="padding:1vmin">Geen resultaten</p>';

        listEl.querySelectorAll('.mxp-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this._mixkitPickerAudio && !this._mixkitPickerAudio.paused) {
                    this._stopMixkitPickerAudio();
                    if (this._mixkitPickerActiveBtn === btn) return;
                }
                const url = MixkitSounds.getUrl(btn.dataset.id);
                this._mixkitPickerAudio = new Audio(url);
                this._mixkitPickerAudio.volume = 0.5;
                this._mixkitPickerActiveBtn = btn;
                btn.textContent = '⏹';
                btn.classList.add('playing');
                const stop = () => {
                    if (this._mixkitPickerAudio && !this._mixkitPickerAudio.paused)
                        this._mixkitPickerAudio.pause();
                    btn.textContent = '▶';
                    btn.classList.remove('playing');
                    this._mixkitPickerAudio = null;
                    this._mixkitPickerActiveBtn = null;
                };
                this._mixkitPickerAudio.play().catch(() => {
                    this._showToast('Kan geluid niet laden.', true);
                    stop();
                });
                this._mixkitPickerAudio.addEventListener('ended', stop);
                setTimeout(stop, MAX_PREVIEW_MS);
            });
        });

        listEl.querySelectorAll('.mxp-use').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.closest('.mxp-item');
                if (this._mixkitPickerCallback) {
                    this._mixkitPickerCallback({
                        id: item.dataset.id,
                        name: item.dataset.name,
                        icon: item.dataset.icon,
                    });
                }
                this._hideMixkitPicker();
            });
        });
    },

    _stopMixkitPickerAudio() {
        if (this._mixkitPickerAudio && !this._mixkitPickerAudio.paused) {
            this._mixkitPickerAudio.pause();
        }
        if (this._mixkitPickerActiveBtn) {
            this._mixkitPickerActiveBtn.textContent = '▶';
            this._mixkitPickerActiveBtn.classList.remove('playing');
        }
        this._mixkitPickerAudio = null;
        this._mixkitPickerActiveBtn = null;
    },

    _openMixkitPicker(anchorEl, callback) {
        const picker = this._mixkitPickerEl;
        if (!picker) return;

        this._mixkitPickerCallback = callback;

        // Reset naar "Alle" categorie
        picker.querySelectorAll('.mxp-cat-btn').forEach(b => b.classList.remove('active'));
        picker.querySelector('.mxp-cat-btn[data-cat=""]')?.classList.add('active');
        picker.querySelector('.mxp-search').value = '';
        this._renderMixkitPickerList('', '');

        // Toon picker, positioneer
        picker.classList.remove('hidden');

        const rect = anchorEl.getBoundingClientRect();
        const pw = picker.offsetWidth || 360;
        const ph = picker.offsetHeight || 400;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top = rect.bottom + 6;
        let left = rect.left;
        if (top + ph > vh) top = Math.max(0, rect.top - ph - 6);
        if (left + pw > vw) left = Math.max(0, vw - pw - 8);

        picker.style.top = `${top}px`;
        picker.style.left = `${left}px`;
        picker.querySelector('.mxp-search').focus();
    },

    _hideMixkitPicker() {
        this._stopMixkitPickerAudio();
        this._mixkitPickerEl?.classList.add('hidden');
        this._mixkitPickerCallback = null;
    },

    _bindRecording(container, i) {
        const startBtn = container.querySelector('.te-record-start');
        const stopBtn = container.querySelector('.te-record-stop');
        const timerEl = container.querySelector('.record-timer');
        const playbackEl = container.querySelector('.record-playback');
        const playBtn = container.querySelector('.te-record-play');
        const statusEl = container.querySelector('.record-status');

        let recordedBlob = null;
        let startTime = null;
        let timerInterval = null;

        startBtn?.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const chunks = [];
                this.mediaRecorder = new MediaRecorder(stream);

                this.mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
                this.mediaRecorder.onstop = async () => {
                    stream.getTracks().forEach(t => t.stop());
                    recordedBlob = new Blob(chunks, { type: 'audio/webm' });
                    const data = await this._blobToBase64(recordedBlob);
                    this.itemAudio[i] = { type: 'custom', data };
                    playbackEl?.classList.remove('hidden');
                    if (statusEl) statusEl.textContent = 'Opname klaar';
                    startBtn?.classList.remove('hidden');
                    stopBtn?.classList.add('hidden');
                    clearInterval(timerInterval);
                };

                this.mediaRecorder.start();
                startTime = Date.now();
                startBtn?.classList.add('hidden');
                stopBtn?.classList.remove('hidden');
                if (timerEl) timerEl.textContent = `0s / ${MAX_AUDIO_SECONDS}s`;

                // Timer
                timerInterval = setInterval(() => {
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                    if (timerEl) timerEl.textContent = `${elapsed}s / ${MAX_AUDIO_SECONDS}s`;
                }, 100);

                // Auto-stop na MAX_AUDIO_SECONDS
                const autoStop = setTimeout(() => {
                    if (this.mediaRecorder?.state === 'recording') {
                        this.mediaRecorder.stop();
                    }
                }, MAX_AUDIO_SECONDS * 1000);
                this.recordingTimers.push(autoStop);

            } catch (err) {
                this._showToast('Geen toegang tot microfoon: ' + err.message, true);
            }
        });

        stopBtn?.addEventListener('click', () => {
            if (this.mediaRecorder?.state === 'recording') {
                this.mediaRecorder.stop();
                clearInterval(timerInterval);
            }
        });

        playBtn?.addEventListener('click', () => {
            if (this.itemAudio[i]?.data) {
                const audio = new Audio(this.itemAudio[i].data);
                audio.play().catch(e => console.warn('Afspelen mislukt:', e));
            }
        });
    },

    _bindUpload(container, i) {
        const uploadBtn = container.querySelector('.te-audio-upload');
        const fileInput = container.querySelector('.te-audio-file');
        const infoRow = container.querySelector('.upload-info-row');
        const filenameEl = container.querySelector('.upload-filename');
        const playBtn = container.querySelector('.te-audio-play');

        uploadBtn?.addEventListener('click', () => fileInput.click());

        fileInput?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const duration = await this._getAudioDuration(file);
                if (duration > MAX_AUDIO_SECONDS) {
                    this._showToast(`Dit audiobestand is ${duration.toFixed(1)}s — max ${MAX_AUDIO_SECONDS}s toegestaan.`, true);
                    e.target.value = '';
                    return;
                }

                const data = await this._blobToBase64(file);
                this.itemAudio[i] = { type: 'custom', data };
                if (filenameEl) filenameEl.textContent = file.name;
                infoRow?.classList.remove('hidden');

            } catch (err) {
                this._showToast('Fout bij laden audio: ' + err.message, true);
            }
            e.target.value = '';
        });

        playBtn?.addEventListener('click', () => {
            if (this.itemAudio[i]?.data) {
                const audio = new Audio(this.itemAudio[i].data);
                audio.play().catch(e => console.warn('Afspelen mislukt:', e));
            }
        });
    },

    _resetEditor() {
        document.getElementById('te-name').value = '';
        const preview = document.getElementById('te-icon-preview');
        if (preview) {
            preview.textContent = '🎨';
            preview.style.backgroundImage = '';
            preview.dataset.value = '🎨';
        }
        document.getElementById('te-bg-color1').value = '#89cff0';
        document.getElementById('te-bg-color2').value = '#005c99';
        document.getElementById('te-bg-solid-color').value = '#89cff0';

        // Gradient is standaard
        document.querySelectorAll('[data-bg-type]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-bg-type="gradient"]')?.classList.add('active');
        const gradEl = document.getElementById('te-bg-gradient');
        const solidEl = document.getElementById('te-bg-solid');
        if (gradEl) gradEl.style.display = '';
        if (solidEl) solidEl.style.display = 'none';

        this.itemAudio = Array.from({ length: 6 }, () => ({}));
        this._initItemEditors();
        this._updateBgPreview();
    },

    _loadTheme(theme) {
        document.getElementById('te-name').value = theme.displayName || '';

        const icon = theme.icon || '🎨';
        const iconPreview = document.getElementById('te-icon-preview');
        if (icon.startsWith('data:')) {
            iconPreview.textContent = '';
            iconPreview.style.backgroundImage = `url('${icon}')`;
            iconPreview.style.backgroundSize = 'contain';
            iconPreview.style.backgroundRepeat = 'no-repeat';
            iconPreview.style.backgroundPosition = 'center';
            iconPreview.dataset.value = icon;
        } else {
            iconPreview.textContent = icon;
            iconPreview.style.backgroundImage = '';
            iconPreview.dataset.value = icon;
        }

        this._parseBackground(theme.background);

        this.itemAudio = Array.from({ length: 6 }, () => ({}));
        this._initItemEditors();

        theme.items?.forEach((item, i) => {
            if (i >= 6) return;
            const container = document.querySelector(`.item-editor[data-index="${i}"]`);
            if (!container) return;

            // Icoon
            const iconPreview = container.querySelector('.te-item-icon-preview');
            const itemIcon = item.i || '❓';
            if (itemIcon.startsWith('data:')) {
                if (iconPreview) {
                    iconPreview.textContent = '';
                    iconPreview.style.backgroundImage = `url('${itemIcon}')`;
                    iconPreview.style.backgroundSize = 'contain';
                    iconPreview.style.backgroundRepeat = 'no-repeat';
                    iconPreview.style.backgroundPosition = 'center';
                    iconPreview.dataset.value = itemIcon;
                }
            } else {
                if (iconPreview) {
                    iconPreview.textContent = itemIcon;
                    iconPreview.dataset.value = itemIcon;
                    iconPreview.style.backgroundImage = '';
                }
            }

            // Naam
            const nameInput = container.querySelector('.te-item-name');
            if (nameInput) nameInput.value = item.n || '';

            // Audio
            if (item._audio) {
                this.itemAudio[i] = item._audio;
                if (item._audio.type === 'builtin') {
                    const sel = container.querySelector('.te-item-sound-builtin');
                    if (sel) sel.value = item._audio.value;
                } else if (item._audio.type === 'mixkit') {
                    // Activeer Mixkit tab
                    container.querySelector('[data-tab="mixkit"]')?.click();
                    setTimeout(() => {
                        const infoEl = container.querySelector('.mixkit-selected-info');
                        if (infoEl) infoEl.textContent = `Geselecteerd: Mixkit ID ${item._audio.id}`;
                    }, 100);
                } else if (item._audio.type === 'custom') {
                    // Activeer upload/record tab - toon als geladen
                    container.querySelector('[data-tab="upload"]')?.click();
                    const infoRow = container.querySelector('.upload-info-row');
                    const filenameEl = container.querySelector('.upload-filename');
                    infoRow?.classList.remove('hidden');
                    if (filenameEl) filenameEl.textContent = 'Eerder opgeslagen geluid';
                }
            } else if (item.s) {
                this.itemAudio[i] = { type: 'builtin', value: item.s };
                const sel = container.querySelector('.te-item-sound-builtin');
                if (sel && BUILTIN_SOUNDS.find(s => s.value === item.s)) {
                    sel.value = item.s;
                }
            }
        });

        this._updateBgPreview();
    },

    _parseBackground(bg) {
        if (!bg) return;
        const isGradient = bg.includes('gradient');

        document.querySelectorAll('[data-bg-type]').forEach(b => b.classList.remove('active'));
        const gradEl = document.getElementById('te-bg-gradient');
        const solidEl = document.getElementById('te-bg-solid');

        if (isGradient) {
            document.querySelector('[data-bg-type="gradient"]')?.classList.add('active');
            if (gradEl) gradEl.style.display = '';
            if (solidEl) solidEl.style.display = 'none';

            // Probeer kleuren te extraheren (simpele regex)
            const hexColors = bg.match(/#[0-9a-fA-F]{6}/g) || [];
            if (hexColors[0]) {
                const c1 = document.getElementById('te-bg-color1');
                if (c1) c1.value = hexColors[0];
            }
            if (hexColors[1]) {
                const c2 = document.getElementById('te-bg-color2');
                if (c2) c2.value = hexColors[1];
            }

            // Richting detecteren
            const dirSel = document.getElementById('te-bg-direction');
            if (dirSel) {
                if (bg.includes('to bottom')) dirSel.value = 'to bottom';
                else if (bg.includes('to right')) dirSel.value = 'to right';
                else if (bg.includes('135deg')) dirSel.value = '135deg';
                else if (bg.includes('radial')) dirSel.value = 'radial';
            }
        } else {
            document.querySelector('[data-bg-type="solid"]')?.classList.add('active');
            if (gradEl) gradEl.style.display = 'none';
            if (solidEl) solidEl.style.display = '';
            const solidColor = document.getElementById('te-bg-solid-color');
            const hexMatch = bg.match(/#[0-9a-fA-F]{6}/);
            if (hexMatch && solidColor) solidColor.value = hexMatch[0];
        }
    },

    _buildBackground() {
        const isGradient = document.querySelector('[data-bg-type="gradient"]')?.classList.contains('active');
        if (isGradient) {
            const c1 = document.getElementById('te-bg-color1')?.value || '#89cff0';
            const c2 = document.getElementById('te-bg-color2')?.value || '#005c99';
            const dir = document.getElementById('te-bg-direction')?.value || 'to bottom';
            if (dir === 'radial') {
                return `radial-gradient(circle, ${c1}, ${c2})`;
            }
            return `linear-gradient(${dir}, ${c1}, ${c2})`;
        } else {
            return document.getElementById('te-bg-solid-color')?.value || '#89cff0';
        }
    },

    _updateBgPreview() {
        const preview = document.getElementById('te-bg-preview');
        if (!preview) return;
        preview.style.background = this._buildBackground();
    },

    _getIconValue() {
        const preview = document.getElementById('te-icon-preview');
        if (!preview) return '🎨';
        if (preview.dataset.value?.startsWith('data:')) return preview.dataset.value;
        if (preview.style.backgroundImage && preview.style.backgroundImage !== 'none') {
            const match = preview.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            return match ? match[1] : '🎨';
        }
        return preview.dataset.value || preview.textContent || '🎨';
    },

    _handleIconUpload(file, previewElOrId) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const preview = typeof previewElOrId === 'string'
                ? document.getElementById(previewElOrId)
                : previewElOrId;
            if (preview) {
                preview.textContent = '';
                preview.style.backgroundImage = `url('${dataUrl}')`;
                preview.style.backgroundSize = 'contain';
                preview.style.backgroundRepeat = 'no-repeat';
                preview.style.backgroundPosition = 'center';
                preview.dataset.value = dataUrl;
            }
        };
        reader.readAsDataURL(file);
    },

    _getAudioDuration(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve(audio.duration);
            };
            audio.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Kan audio niet laden'));
            };
        });
    },

    _blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(blob);
        });
    },

    _stopAllRecording() {
        if (this.mediaRecorder?.state === 'recording') {
            this.mediaRecorder.stop();
        }
        this.recordingTimers.forEach(t => clearTimeout(t));
        this.recordingTimers = [];
    },

    _createEmojiPickerEl() {
        const picker = document.createElement('div');
        picker.className = 'emoji-picker hidden';
        picker.innerHTML = `
            <div class="emoji-picker-inner">
                <input type="text" class="emoji-search text-input" placeholder="Zoek emoji..." autocomplete="off">
                <div class="emoji-grid"></div>
            </div>`;

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!picker.classList.contains('hidden') && !picker.contains(e.target)) {
                const anchorId = picker.dataset.anchorId;
                if (!anchorId || e.target.id !== anchorId && !e.target.closest(`#${anchorId}`)) {
                    this._hideEmojiPicker();
                }
            }
        }, true);

        const searchInput = picker.querySelector('.emoji-search');
        searchInput.addEventListener('input', () => {
            this._renderEmojiGrid(picker.querySelector('.emoji-grid'), searchInput.value);
        });

        return picker;
    },

    _renderEmojiGrid(gridEl, query = '') {
        const q = query.toLowerCase().trim();
        const filtered = q
            ? EMOJI_DATA.filter(d => d.n.includes(q) || d.e === q)
            : EMOJI_DATA;

        gridEl.innerHTML = filtered
            .map(d => `<button class="emoji-btn" title="${d.n}" data-emoji="${d.e}">${d.e}</button>`)
            .join('');

        gridEl.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this._emojiCallback) this._emojiCallback(btn.dataset.emoji);
                this._hideEmojiPicker();
            });
        });
    },

    _openEmojiPicker(anchorEl, callback) {
        const picker = this._emojiPickerEl;
        if (!picker) return;

        this._emojiCallback = callback;

        // Reset search
        const searchInput = picker.querySelector('.emoji-search');
        if (searchInput) searchInput.value = '';
        this._renderEmojiGrid(picker.querySelector('.emoji-grid'), '');

        // Position near anchor
        const rect = anchorEl.getBoundingClientRect();
        picker.style.position = 'fixed';
        picker.style.zIndex = '9999';

        // Show first to measure size
        picker.classList.remove('hidden');

        const pickerH = picker.offsetHeight || 300;
        const pickerW = picker.offsetWidth || 280;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top = rect.bottom + 6;
        let left = rect.left;

        if (top + pickerH > vh) top = Math.max(0, rect.top - pickerH - 6);
        if (left + pickerW > vw) left = Math.max(0, vw - pickerW - 8);

        picker.style.top = `${top}px`;
        picker.style.left = `${left}px`;

        if (searchInput) searchInput.focus();
    },

    _hideEmojiPicker() {
        this._emojiPickerEl?.classList.add('hidden');
        this._emojiCallback = null;
    },

    _showToast(message, isError = false) {
        let toast = document.getElementById('lz-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'lz-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = 'lz-toast' + (isError ? ' lz-toast-error' : '');
        toast.classList.add('visible');
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
    }
};
