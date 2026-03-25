/**
 * LeerZone - Thema Editor
 * Volledige UI voor het maken en bewerken van eigen thema's
 */

import { CustomThemeStore } from './theme-store.js';
import { MixkitSounds } from './mixkit-sounds.js';

const MAX_AUDIO_SECONDS = 5;

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

    init(navigateFn) {
        this._navigate = navigateFn;

        document.getElementById('close-theme-editor-button')
            ?.addEventListener('click', () => this.close());

        // Thema icoon
        document.getElementById('te-icon-upload')
            ?.addEventListener('click', () => document.getElementById('te-icon-file').click());
        document.getElementById('te-icon-file')
            ?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this._handleIconUpload(file, 'te-icon-preview', 'te-icon-input');
                e.target.value = '';
            });
        document.getElementById('te-icon-input')
            ?.addEventListener('input', (e) => {
                document.getElementById('te-icon-preview').textContent = e.target.value || '🎨';
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
            const theme = CustomThemeStore.get(themeId);
            if (theme) this._loadTheme(theme);
            document.getElementById('theme-editor-title').textContent = 'Thema Bewerken';
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
                        <input type="text" class="te-item-icon-input icon-text-input" placeholder="Emoji" maxlength="4">
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
                    <select class="te-mixkit-cat full-width">
                        ${mixkitCategories}
                    </select>
                    <div class="mixkit-sound-list"></div>
                    <div class="mixkit-selected-info"></div>
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

        // Icoon emoji input
        const iconInput = container.querySelector('.te-item-icon-input');
        const iconPreview = container.querySelector('.te-item-icon-preview');
        iconInput?.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val) {
                iconPreview.textContent = val;
                iconPreview.dataset.value = val;
                iconPreview.style.backgroundImage = '';
            }
        });

        // Icoon upload
        const iconUploadBtn = container.querySelector('.te-item-icon-upload');
        const iconFileInput = container.querySelector('.te-item-icon-file');
        iconUploadBtn?.addEventListener('click', () => iconFileInput.click());
        iconFileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this._handleIconUpload(file, iconPreview, iconInput);
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

                // Laad Mixkit lijst bij eerste keer openen
                if (tab.dataset.tab === 'mixkit') {
                    this._populateMixkitList(container, i);
                }
            });
        });

        // Builtin sound select
        const builtinSel = container.querySelector('.te-item-sound-builtin');
        builtinSel?.addEventListener('change', (e) => {
            this.itemAudio[i] = { type: 'builtin', value: e.target.value };
        });
        // Default
        if (builtinSel) {
            this.itemAudio[i] = { type: 'builtin', value: builtinSel.value };
        }

        // Builtin test
        container.querySelector('.te-builtin-test')?.addEventListener('click', () => {
            const val = builtinSel?.value;
            if (val) document.dispatchEvent(new CustomEvent('leerzone:play-sound', { detail: val }));
        });

        // Mixkit categorie wissel
        const mixkitCat = container.querySelector('.te-mixkit-cat');
        mixkitCat?.addEventListener('change', () => this._populateMixkitList(container, i));

        // Opname
        this._bindRecording(container, i);

        // Upload
        this._bindUpload(container, i);
    },

    _populateMixkitList(container, i) {
        const catSel = container.querySelector('.te-mixkit-cat');
        const listEl = container.querySelector('.mixkit-sound-list');
        if (!catSel || !listEl) return;

        const catId = catSel.value;
        const sounds = MixkitSounds.getSoundsByCategory(catId);

        listEl.innerHTML = sounds.map(s => `
            <div class="mixkit-sound-item" data-slug="${s.slug}">
                <span class="mixkit-sound-name">${s.name}</span>
                <button class="mixkit-preview-btn setting-button small-btn" data-slug="${s.slug}">▶</button>
                <button class="mixkit-use-btn setting-button small-btn" data-slug="${s.slug}" data-name="${s.name}">Gebruik</button>
            </div>
        `).join('');

        // Preview knop
        listEl.querySelectorAll('.mixkit-preview-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = MixkitSounds.getUrl(btn.dataset.slug);
                const audio = new Audio(url);
                audio.volume = 0.5;
                audio.play().catch(() => {
                    this._showToast('Kan dit geluid niet laden. Controleer je internetverbinding.', true);
                });
            });
        });

        // Gebruik knop
        listEl.querySelectorAll('.mixkit-use-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.itemAudio[i] = { type: 'mixkit', slug: btn.dataset.slug };
                listEl.querySelectorAll('.mixkit-sound-item').forEach(el => el.classList.remove('selected'));
                btn.closest('.mixkit-sound-item').classList.add('selected');
                const infoEl = container.querySelector('.mixkit-selected-info');
                if (infoEl) infoEl.textContent = `Geselecteerd: ${btn.dataset.name}`;
            });
        });
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
        document.getElementById('te-icon-input').value = '🎨';
        document.getElementById('te-icon-preview').textContent = '🎨';
        document.getElementById('te-icon-preview').style.backgroundImage = '';
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
        const iconInput = document.getElementById('te-icon-input');
        if (icon.startsWith('data:')) {
            iconPreview.textContent = '';
            iconPreview.style.backgroundImage = `url('${icon}')`;
            iconPreview.style.backgroundSize = 'contain';
            iconPreview.style.backgroundRepeat = 'no-repeat';
            iconPreview.style.backgroundPosition = 'center';
            if (iconInput) iconInput.value = '';
        } else {
            iconPreview.textContent = icon;
            iconPreview.style.backgroundImage = '';
            if (iconInput) iconInput.value = icon;
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
            const iconInputEl = container.querySelector('.te-item-icon-input');
            const itemIcon = item.i || '❓';
            if (itemIcon.startsWith('data:')) {
                if (iconPreview) {
                    iconPreview.textContent = '';
                    iconPreview.style.backgroundImage = `url('${itemIcon}')`;
                    iconPreview.style.backgroundSize = 'contain';
                    iconPreview.style.backgroundRepeat = 'no-repeat';
                    iconPreview.style.backgroundPosition = 'center';
                }
            } else {
                if (iconPreview) {
                    iconPreview.textContent = itemIcon;
                    iconPreview.dataset.value = itemIcon;
                    iconPreview.style.backgroundImage = '';
                }
                if (iconInputEl) iconInputEl.value = itemIcon;
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
                        if (infoEl) infoEl.textContent = `Geselecteerd: ${item._audio.slug}`;
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
        const input = document.getElementById('te-icon-input');
        // Als er een backgroundImage is, is het een afbeelding
        if (preview?.style.backgroundImage && preview.style.backgroundImage !== 'none') {
            // Extraheer data URL uit backgroundImage: url('...')
            const match = preview.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
            return match ? match[1] : '🎨';
        }
        return input?.value || preview?.textContent || '🎨';
    },

    _handleIconUpload(file, previewElOrId, inputElOrId) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const preview = typeof previewElOrId === 'string'
                ? document.getElementById(previewElOrId)
                : previewElOrId;
            const input = typeof inputElOrId === 'string'
                ? document.getElementById(inputElOrId)
                : inputElOrId;

            if (preview) {
                preview.textContent = '';
                preview.style.backgroundImage = `url('${dataUrl}')`;
                preview.style.backgroundSize = 'contain';
                preview.style.backgroundRepeat = 'no-repeat';
                preview.style.backgroundPosition = 'center';
                if (preview.dataset) preview.dataset.value = dataUrl;
            }
            if (input) input.value = '';
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
