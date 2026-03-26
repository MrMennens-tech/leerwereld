/**
 * LeerZone - Hoofdapplicatie v3
 * Bevat: Settings, Navigation, Games, Accessibility, TTS, GameController
 */

import { Themes } from './themes.js?v=4';
import { AudioEngine, createSoundController } from './audio-engines.js?v=4';
import { CustomThemeStore } from './theme-store.js';
import { MixkitSounds } from './mixkit-sounds.js';
import { ThemeEditor } from './theme-editor.js';

// --- APPLICATIE STATE EN DOM REFERENTIES ---
export const AppState = {
    currentView: 'main-menu-view',
    previousView: null,
    activeGame: null,
    activeLevel: 1
};

export const DOM = {
    views: document.querySelectorAll('.view'),
    gameArea: document.querySelector('.game-area'),
    gameFeedback: document.querySelector('.game-feedback'),
    levelSelector: document.getElementById('game-level-selector'),
    body: document.body,
    settingsContainer: document.querySelector('#settings-view .settings-container')
};

// --- UTILITIES ---
export const Utils = {
    get themes() { return CustomThemeStore.getAllThemes(); },

    getThemeItems: function() {
        const theme = this.themes[Settings.state.theme] || this.themes['sea'];
        theme.scenes = {
            drive: theme.items[0],
            pop: theme.items[1],
            launch: theme.items[0]
        };
        return theme;
    },
    
    shuffleArray: (array) => array.sort(() => Math.random() - 0.5)
};

// --- SETTINGS ---
export const Settings = {
    state: {
        theme: 'sea',
        inputMode: 'touch',
        scanSpeed: 3.0,
        scanScope: 'full',
        focusMode: false,
        contrast: 'normal',
        feedbackMode: 'both',
        voice: 'female',
        voicePitch: 1.0,
        elementSize: 1.0,
        emojiStyle: 'default',
        audioEngine: 'webaudio',
        audioMode: 'soundOnly' // 'both', 'soundOnly', 'voiceOnly' - standaard alleen geluiden
    },
    
    init() {
        this.load();
        this.applyAll();
        this.updateUI();
        
        // Event listeners
        if (DOM.settingsContainer) {
            DOM.settingsContainer.addEventListener('click', e => {
                const btn = e.target.closest('.setting-button');
                if (btn && btn.dataset.setting && btn.dataset.setting !== 'theme') {
                    this.handleButtonClick(e, btn.dataset.setting);
                }
            });
        }
        
        // Scan speed slider
        const scanSlider = document.getElementById('scan-speed-slider');
        if (scanSlider) {
            scanSlider.addEventListener('input', e => {
                this.state.scanSpeed = parseFloat(e.target.value);
                document.getElementById('scan-speed-value').textContent = `${this.state.scanSpeed.toFixed(1)}s`;
            });
            scanSlider.addEventListener('change', () => this.save());
        }
        
        // Element size slider
        const sizeSlider = document.getElementById('element-size-slider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', e => {
                this.state.elementSize = parseFloat(e.target.value);
                this.apply('elementSize');
                document.getElementById('element-size-value').textContent = `${this.state.elementSize.toFixed(1)}x`;
            });
            sizeSlider.addEventListener('change', () => this.save());
        }
        
        // Voice pitch slider
        const pitchSlider = document.getElementById('voice-pitch-slider');
        if (pitchSlider) {
            pitchSlider.addEventListener('input', e => {
                this.state.voicePitch = parseFloat(e.target.value);
                document.getElementById('voice-pitch-value').textContent = `${this.state.voicePitch.toFixed(1)}x`;
            });
            pitchSlider.addEventListener('change', () => {
                this.save();
                TTS.speak('Zo klinkt de stem nu.');
            });
        }
    },
    
    handleButtonClick(event, key) {
        const btn = event.target.closest('.setting-button');
        if (!btn) return;
        
        const val = btn.dataset.value;
        this.state[key] = val === 'true' ? true : (val === 'false' ? false : val);
        
        this.apply(key);
        this.updateUI();
        this.save();
        
        TTS.speak(btn.textContent.replace('🙂',''));
        Accessibility.restartScanIfActive();
    },
    
    save() {
        localStorage.setItem('leerwereld_settings', JSON.stringify(this.state));
    },
    
    load() {
        const saved = localStorage.getItem('leerwereld_settings');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        }
    },
    
    apply(key) {
        if (key === 'elementSize') {
            document.documentElement.style.setProperty('--element-size-multiplier', this.state.elementSize);
        } else {
            DOM.body.dataset[key] = this.state[key];
        }
        
        if (key === 'inputMode') {
            Accessibility.setInputMode(this.state.inputMode);
            this.updateButtonMappingVisibility();
        }
        if (key === 'scanScope') Accessibility.restartScanIfActive();
        if (key === 'theme') {
            const theme = Utils.themes[this.state.theme];
            SoundController.registerThemeAudio(theme);
        }
    },
    
    applyAll() {
        for (const key in this.state) {
            this.apply(key);
        }
    },
    
    updateUI() {
        document.querySelectorAll('.setting-button').forEach(btn => {
            btn.classList.toggle('active', String(this.state[btn.dataset.setting]) === btn.dataset.value);
        });
        
        const scanSlider = document.getElementById('scan-speed-slider');
        if (scanSlider) {
            scanSlider.value = this.state.scanSpeed;
            document.getElementById('scan-speed-value').textContent = `${this.state.scanSpeed.toFixed(1)}s`;
        }
        
        const sizeSlider = document.getElementById('element-size-slider');
        if (sizeSlider) {
            sizeSlider.value = this.state.elementSize;
            document.getElementById('element-size-value').textContent = `${this.state.elementSize.toFixed(1)}x`;
        }
        
        const pitchSlider = document.getElementById('voice-pitch-slider');
        if (pitchSlider) {
            pitchSlider.value = this.state.voicePitch;
            document.getElementById('voice-pitch-value').textContent = `${this.state.voicePitch.toFixed(1)}x`;
        }
        
        this.updateButtonMappingVisibility();
    },
    
    updateButtonMappingVisibility() {
        const section = document.getElementById('button-mapping-section');
        const button2Row = document.getElementById('button2-row');
        
        if (section) {
            // Toon alleen bij one-button of two-button modus
            const shouldShow = this.state.inputMode === 'one-button' || this.state.inputMode === 'two-button';
            section.style.display = shouldShow ? 'block' : 'none';
            
            // Toon button 2 alleen bij two-button modus
            if (button2Row) {
                button2Row.style.display = this.state.inputMode === 'two-button' ? 'flex' : 'none';
            }
        }
    }
};

// --- SOUND CONTROLLER (met toegang tot Settings) ---
export const SoundController = createSoundController(() => Settings.state);

// Custom audio registry: soundKey -> { type: 'custom'|'mixkit', data? }
SoundController.customAudio = {};

SoundController.registerThemeAudio = function(theme) {
    this.customAudio = {};
    if (!theme?.items) return;
    theme.items.forEach((item) => {
        if (item._audio && item.s) {
            this.customAudio[item.s] = item._audio;
        }
    });
};

const MAX_PLAY_MS = 2000;
const _origPlay = SoundController.play.bind(SoundController);
SoundController.play = function(soundName) {
    if (this.customAudio[soundName]) {
        const audioData = this.customAudio[soundName];
        const state = Settings.state;
        if (state.feedbackMode === 'visual' || state.audioMode === 'voiceOnly') return;
        let url;
        if (audioData.type === 'mixkit') {
            url = MixkitSounds.getUrl(audioData.id);
        } else if (audioData.type === 'custom') {
            url = audioData.data;
        }
        if (url) {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.warn('Custom audio mislukt:', e));
            setTimeout(() => { if (!audio.paused) audio.pause(); }, MAX_PLAY_MS);
        }
        return;
    }
    _origPlay(soundName);
};

// --- ACCESSIBILITY ---
// --- BUTTON MAPPING SYSTEM ---
export const ButtonMapping = {
    mappings: {
        button1: { type: 'keyboard', code: 'Space', display: 'Spatie' },
        button2: { type: 'keyboard', code: 'Enter', display: 'Enter' }
    },
    listening: null,
    gamepadIndex: -1,
    gamepadButtonPressed: {},
    
    init() {
        this.load();
        this.startGamepadMonitoring();
        window.addEventListener('gamepadconnected', (e) => {
            console.log('🎮 Controller verbonden:', e.gamepad.id);
            this.gamepadIndex = e.gamepad.index;
        });
        window.addEventListener('gamepaddisconnected', () => {
            console.log('🎮 Controller losgekoppeld');
            this.gamepadIndex = -1;
        });
    },
    
    load() {
        const saved = localStorage.getItem('buttonMappings');
        if (saved) {
            try {
                this.mappings = JSON.parse(saved);
            } catch (e) {
                console.error('Fout bij laden button mappings:', e);
            }
        }
    },
    
    save() {
        localStorage.setItem('buttonMappings', JSON.stringify(this.mappings));
        console.log('💾 Button mappings opgeslagen');
    },
    
    reset() {
        this.mappings = {
            button1: { type: 'keyboard', code: 'Space', display: 'Spatie' },
            button2: { type: 'keyboard', code: 'Enter', display: 'Enter' }
        };
        this.save();
        this.updateUI();
    },
    
    startListening(buttonNumber) {
        this.listening = buttonNumber;
        const modal = document.getElementById('button-mapping-modal');
        if (modal) {
            modal.classList.add('show');
        }
        
        const tempKeyHandler = (e) => {
            e.preventDefault();
            if (e.code === 'Escape') {
                this.stopListening();
                return;
            }
            this.setMapping(buttonNumber, 'keyboard', e.code, this.getKeyDisplay(e.code));
            this.stopListening();
        };
        
        const tempMouseHandler = (e) => {
            e.preventDefault();
            const buttonNames = ['Links', 'Midden', 'Rechts', 'Terug', 'Vooruit'];
            this.setMapping(buttonNumber, 'mouse', e.button, `Muis ${buttonNames[e.button] || e.button}`);
            this.stopListening();
        };
        
        this.tempKeyHandler = tempKeyHandler;
        this.tempMouseHandler = tempMouseHandler;
        
        window.addEventListener('keydown', tempKeyHandler);
        window.addEventListener('mousedown', tempMouseHandler);
    },
    
    stopListening() {
        this.listening = null;
        const modal = document.getElementById('button-mapping-modal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        if (this.tempKeyHandler) {
            window.removeEventListener('keydown', this.tempKeyHandler);
            this.tempKeyHandler = null;
        }
        if (this.tempMouseHandler) {
            window.removeEventListener('mousedown', this.tempMouseHandler);
            this.tempMouseHandler = null;
        }
    },
    
    startGamepadMonitoring() {
        const checkGamepad = () => {
            // Monitoring tijdens "leren" modus
            if (this.listening && this.gamepadIndex >= 0) {
                const gamepads = navigator.getGamepads();
                const gamepad = gamepads[this.gamepadIndex];
                
                if (gamepad) {
                    for (let i = 0; i < gamepad.buttons.length; i++) {
                        if (gamepad.buttons[i].pressed && !this.gamepadButtonPressed[i]) {
                            this.gamepadButtonPressed[i] = true;
                            const buttonNames = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Select', 'Start', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right'];
                            this.setMapping(this.listening, 'gamepad', i, `Controller ${buttonNames[i] || ('Knop ' + i)}`);
                            this.stopListening();
                            break;
                        }
                        if (!gamepad.buttons[i].pressed) {
                            this.gamepadButtonPressed[i] = false;
                        }
                    }
                }
            }
            
            // Continue monitoring tijdens spelen (voor gamepad input)
            if (!this.listening && this.gamepadIndex >= 0) {
                this.checkGamepadButtons();
            }
            
            requestAnimationFrame(checkGamepad);
        };
        checkGamepad();
    },
    
    checkGamepadButtons() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[this.gamepadIndex];
        if (!gamepad) return;
        
        // Check button 1
        if (this.mappings.button1.type === 'gamepad') {
            const btn1Index = this.mappings.button1.code;
            if (gamepad.buttons[btn1Index]?.pressed && !this.gamepadButtonPressed['play_btn1']) {
                this.gamepadButtonPressed['play_btn1'] = true;
                // Trigger button 1 action
                const event = new CustomEvent('gamepadbutton', { detail: { button: 'button1' } });
                window.dispatchEvent(event);
            }
            if (!gamepad.buttons[btn1Index]?.pressed) {
                this.gamepadButtonPressed['play_btn1'] = false;
            }
        }
        
        // Check button 2
        if (this.mappings.button2.type === 'gamepad') {
            const btn2Index = this.mappings.button2.code;
            if (gamepad.buttons[btn2Index]?.pressed && !this.gamepadButtonPressed['play_btn2']) {
                this.gamepadButtonPressed['play_btn2'] = true;
                // Trigger button 2 action
                const event = new CustomEvent('gamepadbutton', { detail: { button: 'button2' } });
                window.dispatchEvent(event);
            }
            if (!gamepad.buttons[btn2Index]?.pressed) {
                this.gamepadButtonPressed['play_btn2'] = false;
            }
        }
    },
    
    setMapping(buttonNumber, type, code, display) {
        this.mappings[buttonNumber] = { type, code, display };
        this.save();
        this.updateUI();
    },
    
    getKeyDisplay(code) {
        const displayNames = {
            'Space': 'Spatie',
            'Enter': 'Enter',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'ShiftLeft': 'Shift Links',
            'ShiftRight': 'Shift Rechts',
            'ControlLeft': 'Ctrl Links',
            'ControlRight': 'Ctrl Rechts'
        };
        return displayNames[code] || code.replace('Key', '').replace('Digit', '');
    },
    
    updateUI() {
        ['button1', 'button2'].forEach(btn => {
            const element = document.getElementById(`${btn}-display`);
            if (element) {
                element.textContent = this.mappings[btn].display;
            }
        });
    },
    
    isButton(event, buttonNumber) {
        const mapping = this.mappings[buttonNumber];
        if (!mapping) return false;
        
        // Check keyboard events (both keydown and keyup)
        if (mapping.type === 'keyboard' && (event.type === 'keydown' || event.type === 'keyup')) {
            return event.code === mapping.code;
        }
        
        // Check mouse events (both mousedown and mouseup)
        if (mapping.type === 'mouse' && (event.type === 'mousedown' || event.type === 'mouseup')) {
            return event.button === mapping.code;
        }
        
        // Check gamepad events
        if (mapping.type === 'gamepad' && this.gamepadIndex >= 0) {
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[this.gamepadIndex];
            return gamepad && gamepad.buttons[mapping.code]?.pressed;
        }
        
        return false;
    }
};

export const Accessibility = {
    scanInterval: null,
    scannableElements: [],
    currentIndex: -1,
    inputMode: 'touch',
    isSwitchDown: false,
    
    init() {
        this.setInputMode(Settings.state.inputMode);
        window.addEventListener('keydown', this.handleKeyPress.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousedown', this.handleMousePress.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.addEventListener('gamepadbutton', this.handleGamepadButton.bind(this));
        ButtonMapping.init();
    },
    
    setInputMode(mode) {
        this.inputMode = mode;
        this.stopScan();
        if (mode !== 'touch') this.startScan();
    },
    
    restartScanIfActive() {
        if (this.inputMode !== 'touch') {
            this.stopScan();
            this.startScan();
        }
    },
    
    startScan() {
        if (this.inputMode === 'touch') return;
        
        const scope = Settings.state.scanScope === 'full' ? '.scannable' : '.game-area .scannable';
        this.scannableElements = Array.from(document.querySelector('.view.active').querySelectorAll(scope));
        
        console.log('🔍 Scan started | Scope:', scope, '| Found elements:', this.scannableElements.length, '| Mode:', this.inputMode);
        
        if (this.scannableElements.length === 0) return;
        
        this.currentIndex = -1;
        
        if (this.inputMode === 'one-button') {
            this.scanInterval = setInterval(() => this.scanNext(), Settings.state.scanSpeed * 1000);
            this.scanNext();
        } else {
            this.scanNext();
        }
    },
    
    stopScan() {
        clearInterval(this.scanInterval);
        this.scanInterval = null;
        this.scannableElements.forEach(el => el.classList.remove('scan-highlight'));
        this.currentIndex = -1;
    },
    
    highlightCurrent() {
        this.scannableElements.forEach((el, index) => {
            const isActive = index === this.currentIndex;
            el.classList.toggle('scan-highlight', isActive);
            
            // Auto-scroll het actieve element in beeld
            if (isActive) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',    // Scroll alleen als het element buiten beeld is
                    inline: 'nearest'    // Horizontaal ook nearest
                });
            }
        });
    },
    
    scanNext() {
        this.currentIndex = (this.currentIndex + 1) % this.scannableElements.length;
        console.log('👉 Scanning to index:', this.currentIndex, '/', this.scannableElements.length);
        this.highlightCurrent();
    },
    
    activateCurrent() {
        if (this.currentIndex > -1 && this.scannableElements[this.currentIndex]) {
            const element = this.scannableElements[this.currentIndex];
            console.log('🎯 Activating:', element.tagName, element.className, element.textContent?.substring(0, 30));
            element.click();
        } else {
            console.log('⚠️ No element to activate. Index:', this.currentIndex, 'Total:', this.scannableElements.length);
        }
    },
    
    handleKeyPress(e) {
        // Check custom button mappings
        const isButton1 = ButtonMapping.isButton(e, 'button1');
        const isButton2 = ButtonMapping.isButton(e, 'button2');
        
        console.log('🎹 Key pressed:', e.code, '| Button1:', isButton1, '| Button2:', isButton2, '| Mode:', this.inputMode);
        
        if (!isButton1 && !isButton2) {
            console.log('⏭️ Not a configured button, skipping');
            return;
        }
        e.preventDefault();
        
        if (this.isSwitchDown) {
            console.log('⚠️ Switch already down, ignoring');
            return;
        }
        this.isSwitchDown = true;
        console.log('🔓 Switch is now DOWN | Current index:', this.currentIndex, '| Elements:', this.scannableElements.length);
        
        if (this.inputMode === 'one-button' && isButton1) {
            console.log('✅ Activating current (one-button)');
            this.activateCurrent();
        } else if (this.inputMode === 'two-button') {
            if (isButton1) {
                console.log('➡️ Scanning next');
                this.scanNext();
            } else if (isButton2) {
                console.log('✅ Activating current (two-button)');
                this.activateCurrent();
            }
        }
    },
    
    handleMousePress(e) {
        // Check custom button mappings for mouse
        const isButton1 = ButtonMapping.isButton(e, 'button1');
        const isButton2 = ButtonMapping.isButton(e, 'button2');
        
        console.log('🖱️ Mouse button:', e.button, '| Button1:', isButton1, '| Button2:', isButton2, '| Mode:', this.inputMode);
        
        if (!isButton1 && !isButton2) return;
        e.preventDefault();
        
        if (this.isSwitchDown) return;
        this.isSwitchDown = true;
        
        if (this.inputMode === 'one-button' && isButton1) {
            console.log('✅ Activating current (one-button)');
            this.activateCurrent();
        } else if (this.inputMode === 'two-button') {
            if (isButton1) {
                console.log('➡️ Scanning next');
                this.scanNext();
            } else if (isButton2) {
                console.log('✅ Activating current (two-button)');
                this.activateCurrent();
            }
        }
        
        // Reset na korte delay
        setTimeout(() => { this.isSwitchDown = false; }, 100);
    },
    
    handleKeyUp(e) {
        console.log('⬆️ KeyUp event:', e.type, e.code);
        const isButton1 = ButtonMapping.isButton(e, 'button1');
        const isButton2 = ButtonMapping.isButton(e, 'button2');
        console.log('⬆️ KeyUp check: Button1:', isButton1, '| Button2:', isButton2);
        
        if (isButton1 || isButton2) {
            console.log('🔓 Switch is now UP');
            this.isSwitchDown = false;
        } else {
            console.log('⚠️ KeyUp not recognized as button1 or button2');
        }
    },
    
    handleMouseUp(e) {
        console.log('⬆️ MouseUp event:', e.type, e.button);
        const isButton1 = ButtonMapping.isButton(e, 'button1');
        const isButton2 = ButtonMapping.isButton(e, 'button2');
        console.log('⬆️ MouseUp check: Button1:', isButton1, '| Button2:', isButton2);
        
        if (isButton1 || isButton2) {
            console.log('🔓 Switch is now UP (mouse)');
            this.isSwitchDown = false;
        }
    },
    
    handleGamepadButton(e) {
        if (this.isSwitchDown) return;
        this.isSwitchDown = true;
        
        const button = e.detail.button;
        
        console.log('🎮 Gamepad button:', button, '| Mode:', this.inputMode);
        
        if (this.inputMode === 'one-button' && button === 'button1') {
            console.log('✅ Activating current (one-button)');
            this.activateCurrent();
        } else if (this.inputMode === 'two-button') {
            if (button === 'button1') {
                console.log('➡️ Scanning next');
                this.scanNext();
            } else if (button === 'button2') {
                console.log('✅ Activating current (two-button)');
                this.activateCurrent();
            }
        }
        
        // Reset na korte delay
        setTimeout(() => { this.isSwitchDown = false; }, 100);
    }
};

// --- TEXT-TO-SPEECH ---
export const TTS = {
    voices: [],
    
    init() {
        const loadVoices = () => {
            this.voices = speechSynthesis.getVoices();
            console.log('TTS voices loaded:', this.voices.length);
        };
        
        // Probeer meerdere keren voices te laden
        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
        
        // Extra fallback na 500ms
        setTimeout(loadVoices, 500);
    },
    
    speak(text) {
        if (Settings.state.feedbackMode === 'visual' || !text) return;
        if (Settings.state.audioMode === 'soundOnly') return; // Alleen geluidseffecten, geen stem
        
        speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        const isMale = Settings.state.voice === 'male';
        
        let chosenVoice = null;
        if (this.voices.length > 0) {
            // Haal Nederlandse stemmen op
            const nlVoices = this.voices.filter(v => v.lang.startsWith('nl'));
            
            console.log('Available NL voices:', nlVoices.map(v => `${v.name} (${v.gender || 'unknown'})`));
            
            if (isMale) {
                // Probeer mannelijke stemmen: Frank, Bart, of Maarten
                chosenVoice = nlVoices.find(v => /frank|bart|maarten/i.test(v.name)) ||
                             nlVoices.find(v => /male|man/i.test(v.name)) ||
                             nlVoices[0];
            } else {
                // Probeer vrouwelijke stemmen
                // Als er geen echte vrouwelijke stem is, gebruik Google (die heeft een vrouwelijk klinkende stem)
                // of gebruik de stem met hogere pitch
                chosenVoice = nlVoices.find(v => /claire|xander|lotte|female|vrouw/i.test(v.name)) ||
                             nlVoices.find(v => /google/i.test(v.name)); // Google klinkt meestal vrouwelijk
                
                // Als we geen vrouwelijke stem hebben, waarschuw in console
                if (!chosenVoice || /frank|bart|maarten/i.test(chosenVoice.name)) {
                    console.warn('Geen vrouwelijke stem beschikbaar, gebruik pitch aanpassing');
                    chosenVoice = nlVoices.find(v => /google/i.test(v.name)) || nlVoices[0];
                }
            }
            
            utt.voice = chosenVoice || this.voices[0];
            console.log('Selected voice:', utt.voice ? utt.voice.name : 'default');
        }
        
        utt.lang = 'nl-NL';
        utt.rate = 0.95;  // Iets langzamer voor duidelijkheid
        
        // Gebruik de user's pitch instelling, of standaard pitch gebaseerd op geslacht
        const basePitch = isMale ? 0.85 : 1.3;
        utt.pitch = Settings.state.voicePitch !== 1.0 
            ? Settings.state.voicePitch  // Gebruik custom pitch als ingesteld
            : basePitch;  // Anders gebruik standaard
        
        utt.volume = 1.0;
        
        speechSynthesis.speak(utt);
    }
};

// --- THEME SELECTOR ---
export const ThemeSelector = {

    init() {
        this.updateMainMenuThemeIcon();

        document.getElementById('close-theme-selector-button')
            ?.addEventListener('click', () => Navigation.showView('main-menu-view'));

        // Selecteer of bewerk thema via ingebouwde thema grid
        document.getElementById('theme-grid')
            ?.addEventListener('click', e => {
                const editBtn = e.target.closest('.theme-card-btn.edit');
                const resetBtn = e.target.closest('.theme-card-btn.reset');
                const card = e.target.closest('.theme-card');

                if (editBtn) {
                    ThemeEditor.open(editBtn.dataset.themeId);
                } else if (resetBtn) {
                    const id = resetBtn.dataset.themeId;
                    const name = resetBtn.dataset.themeName;
                    if (confirm(`Aanpassingen aan "${name}" ongedaan maken en terugzetten naar het origineel?`)) {
                        CustomThemeStore.delete(id);
                        if (Settings.state.theme === id) {
                            Settings.apply('theme');
                        }
                        this.populateThemes();
                        document.dispatchEvent(new CustomEvent('leerzone:themes-changed'));
                    }
                } else if (card?.dataset.theme) {
                    this._selectTheme(card.dataset.theme);
                }
            });

        // Eigen thema's: selecteren, bewerken, verwijderen
        document.getElementById('custom-theme-grid')
            ?.addEventListener('click', e => {
                const editBtn = e.target.closest('.theme-card-btn.edit');
                const deleteBtn = e.target.closest('.theme-card-btn.delete');
                const card = e.target.closest('.theme-card');

                if (editBtn) {
                    ThemeEditor.open(editBtn.dataset.themeId);
                } else if (deleteBtn) {
                    if (confirm(`Thema "${deleteBtn.dataset.themeName}" verwijderen?`)) {
                        CustomThemeStore.delete(deleteBtn.dataset.themeId);
                        if (Settings.state.theme === deleteBtn.dataset.themeId) {
                            Settings.state.theme = 'sea';
                            Settings.apply('theme');
                            Settings.save();
                        }
                        this.populateThemes();
                        this.updateMainMenuThemeIcon();
                    }
                } else if (card?.dataset.theme) {
                    this._selectTheme(card.dataset.theme);
                }
            });

        // Nieuw thema maken
        document.getElementById('open-theme-editor-new')
            ?.addEventListener('click', () => ThemeEditor.open());

        // Importeer thema
        document.getElementById('open-theme-import')
            ?.addEventListener('click', () => document.getElementById('theme-import-file').click());
        document.getElementById('theme-import-file')
            ?.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    await CustomThemeStore.importJSON(file);
                    this.populateThemes();
                } catch (err) {
                    alert('Fout bij importeren: ' + err.message);
                }
                e.target.value = '';
            });

        // Herlaad custom themes wanneer de editor opslaat
        document.addEventListener('leerzone:themes-changed', () => {
            this.populateThemes();
            this.updateMainMenuThemeIcon();
        });
    },

    _selectTheme(themeId) {
        Settings.state.theme = themeId;
        Settings.apply('theme');
        Settings.save();
        this.updateActiveTheme();
        this.updateMainMenuThemeIcon();
        const themeName = Utils.themes[themeId]?.displayName;
        if (themeName) TTS.speak(themeName);
        SoundController.play('klik');
        setTimeout(() => Navigation.showView('main-menu-view'), 300);
    },

    populateThemes() {
        const savedCustom = CustomThemeStore.getAll();

        // Ingebouwde thema's — gebruik override als die bestaat
        const grid = document.getElementById('theme-grid');
        if (grid) {
            grid.innerHTML = Object.keys(Themes).map(themeId => {
                const override = savedCustom[themeId];
                const theme = override || Themes[themeId];
                return this._buildThemeCard(themeId, theme, false, !!override);
            }).join('');
        }

        // Eigen thema's — alleen puur nieuwe thema's (niet de ingebouwde overrides)
        const customGrid = document.getElementById('custom-theme-grid');
        if (customGrid) {
            const builtinIds = new Set(Object.keys(Themes));
            const pureCustom = Object.entries(savedCustom).filter(([id]) => !builtinIds.has(id));
            customGrid.innerHTML = pureCustom.map(([themeId, theme]) =>
                this._buildThemeCard(themeId, theme, true, false)
            ).join('');
        }

        this.updateActiveTheme();
    },

    _buildThemeCard(themeId, theme, isCustom, isOverridden = false) {
        const iconContent = theme.icon?.startsWith('data:')
            ? `<img src="${theme.icon}" class="theme-icon-img" alt="${theme.displayName}">`
            : `<div class="theme-icon icon">${theme.icon || '🎨'}</div>`;

        let actions = '';
        if (isCustom) {
            actions = `<div class="theme-card-actions">
                <button class="theme-card-btn edit" data-theme-id="${themeId}" title="Bewerken">✏️</button>
                <button class="theme-card-btn delete" data-theme-id="${themeId}" data-theme-name="${theme.displayName}" title="Verwijderen">🗑️</button>
            </div>`;
        } else {
            // Ingebouwde thema's krijgen altijd een edit-knop; reset als er een override is
            actions = `<div class="theme-card-actions">
                <button class="theme-card-btn edit" data-theme-id="${themeId}" title="Bewerken">✏️</button>
                ${isOverridden ? `<button class="theme-card-btn reset" data-theme-id="${themeId}" data-theme-name="${theme.displayName}" title="Terugzetten naar origineel">↩️</button>` : ''}
            </div>`;
        }

        const modifiedBadge = isOverridden ? '<span class="theme-modified-badge">✎</span>' : '';

        return `<div class="theme-card scannable${isCustom ? ' custom-theme-card' : ''}" data-theme="${themeId}">
            ${iconContent}
            <div class="theme-name">${theme.displayName || themeId}${modifiedBadge}</div>
            ${actions}
        </div>`;
    },

    updateActiveTheme() {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.toggle('active', card.dataset.theme === Settings.state.theme);
        });
    },

    updateMainMenuThemeIcon() {
        const iconElement = document.getElementById('theme-icon');
        if (!iconElement) {
            setTimeout(() => this.updateMainMenuThemeIcon(), 100);
            return;
        }
        const currentTheme = Utils.themes[Settings.state.theme];
        if (currentTheme) {
            if (currentTheme.icon?.startsWith('data:')) {
                iconElement.innerHTML = `<img src="${currentTheme.icon}" style="width:100%;height:100%;object-fit:contain;border-radius:4px;" alt="thema">`;
            } else {
                iconElement.textContent = currentTheme.icon;
            }
        }
    }
};

// --- NAVIGATION ---
export const Navigation = {
    init() {
        // Main menu navigation - spellen
        document.querySelector('.game-grid').addEventListener('click', e => {
            const card = e.target.closest('.game-card');
            if (!card) return;
            
            const gameId = card.dataset.game;
            if (gameId) {
                AppState.activeLevel = 1;
                GameController.loadGame(gameId);
                this.showView('game-view');
            }
        });
        
        // Floating buttons - Thema's
        const themeButton = document.getElementById('open-theme-selector');
        if (themeButton) {
            themeButton.addEventListener('click', () => {
                ThemeSelector.populateThemes();
                this.showView('theme-selector-view');
                ThemeSelector.updateActiveTheme();
            });
        }
        
        // Floating buttons - Instellingen (van hoofdmenu)
        const settingsButton = document.getElementById('open-settings-from-main');
        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                this.showView('settings-view');
            });
        }
        
        // Back button
        document.getElementById('back-to-main-button').addEventListener('click', () => {
            GameController.unloadGame();
            this.showView('main-menu-view');
        });
        
        // Settings button
        document.getElementById('open-settings-from-game').addEventListener('click', () => {
            this.showView('settings-view');
        });
        
        // Close settings
        document.getElementById('close-settings-button').addEventListener('click', () => {
            this.showView(AppState.previousView || 'main-menu-view');
        });
        
        // Level selector
        DOM.levelSelector.addEventListener('click', e => {
            const btn = e.target.closest('.setting-button');
            if (btn) {
                AppState.activeLevel = parseInt(btn.dataset.level);
                GameController.loadGame(AppState.activeGame);
            }
        });
    },
    
    showView(viewId) {
        AppState.previousView = AppState.currentView;
        AppState.currentView = viewId;
        
        DOM.views.forEach(v => {
            v.classList.toggle('active', v.id === viewId);
        });
        
        Accessibility.stopScan();
        setTimeout(() => Accessibility.startScan(), 100);
    }
};

// --- GAME CONTROLLER ---
export const GameController = {
    loadGame(gameId) {
        this.unloadGame();
        AppState.activeGame = gameId;
        
        const game = Games[gameId];
        if (game) {
            // Voeg data-attribute toe voor game-specifieke styling (zoals custom cursors)
            document.getElementById('game-view').dataset.activeGame = gameId;
            
            if (gameId === 'interactive-scene') {
                DOM.gameArea.style.backgroundImage = Utils.getThemeItems().background;
            }
            
            this.setupLevelSelector(game.levels);
            game.create(AppState.activeLevel);
            TTS.speak(`${game.name}, niveau ${AppState.activeLevel}.`);
        }
    },
    
    unloadGame() {
        if (AppState.activeGame && Games[AppState.activeGame].destroy) {
            Games[AppState.activeGame].destroy();
        }
        
        // Verwijder data-attribute
        const gameView = document.getElementById('game-view');
        if (gameView.dataset.activeGame) {
            delete gameView.dataset.activeGame;
        }
        
        DOM.gameArea.style.backgroundImage = '';
        AppState.activeGame = null;
        DOM.gameArea.innerHTML = '';
        DOM.levelSelector.innerHTML = '';
    },
    
    showFeedback(isCorrect) {
        if (Settings.state.feedbackMode !== 'audio') {
            DOM.gameFeedback.innerHTML = isCorrect ? '<span class="icon">👍</span>' : '<span class="icon">🤔</span>';
            DOM.gameFeedback.classList.add('show');
            setTimeout(() => DOM.gameFeedback.classList.remove('show'), 1000);
        }
        
        TTS.speak(isCorrect ? 'Goed zo!' : 'Probeer het nog eens.');
    },
    
    setupLevelSelector(levels) {
        const levelLabels = ['Makkelijk', 'Gemiddeld', 'Moeilijk', 'Expert', 'Meester', 'Grootmeester'];
        DOM.levelSelector.innerHTML = levels.map((_, i) => 
            `<button class="setting-button level-button scannable ${i + 1 === AppState.activeLevel ? 'active' : ''}" data-level="${i + 1}">
                <span class="level-number">Niveau ${i + 1}</span>
                <span class="level-label">${levelLabels[i] || 'Level ' + (i + 1)}</span>
            </button>`
        ).join('');
    }
};

// --- GAME DEFINITIES ---
export const Games = {
    'interactive-scene': {
        name: "Ontdek en Tik",
        levels: [
            { count: 3, respawn: 3500 },
            { count: 4, respawn: 3000 },
            { count: 5, respawn: 2500 }
        ],
        useWords: false,
        currentWord: null,
        
        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `
                <div id="word-display" style="display: none;"></div>
                <div id="interactive-scene-container"></div>
            `;
            
            this.addWordsToggleToTopBar();
            this.setupLevel();
            this.boundClickHandler = this.handleClick.bind(this);
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        addWordsToggleToTopBar() {
            const levelSelector = DOM.levelSelector;
            if (!levelSelector) return;
            
            const oldToggle = document.querySelector('.scene-words-toggle');
            if (oldToggle) oldToggle.remove();
            
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'scene-words-toggle';
            toggleDiv.innerHTML = `
                <button class="setting-button toggle-btn scannable ${!this.useWords ? 'active' : ''}" data-mode="icons">
                    <span>🎨</span> Plaatjes
                </button>
                <button class="setting-button toggle-btn scannable ${this.useWords ? 'active' : ''}" data-mode="words">
                    <span>🔤</span> Woorden
                </button>
            `;
            
            levelSelector.parentNode.insertBefore(toggleDiv, levelSelector.nextSibling);
            
            toggleDiv.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.useWords = btn.dataset.mode === 'words';
                    document.querySelectorAll('.scene-words-toggle .toggle-btn').forEach(b => 
                        b.classList.toggle('active', b.dataset.mode === (this.useWords ? 'words' : 'icons'))
                    );
                    this.setupLevel();
                });
            });
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
            const toggle = document.querySelector('.scene-words-toggle');
            if (toggle) toggle.remove();
        },
        
        setupLevel() {
            const container = document.getElementById('interactive-scene-container');
            const wordDisplay = document.getElementById('word-display');
            container.innerHTML = '';
            
            const itemsToDisplay = Utils.shuffleArray([...Utils.getThemeItems().items]).slice(0, this.config.count);
            const positions = Utils.shuffleArray([
                {top: '20%', left: '15%'},
                {top: '50%', left: '60%'},
                {top: '30%', left: '40%'},
                {top: '65%', left: '10%'},
                {top: '15%', left: '70%'},
                {top: '70%', left: '80%'}
            ]);
            
            // Als woorden-modus actief is, kies 1 woord om te tonen
            if (this.useWords) {
                this.currentWord = itemsToDisplay[Math.floor(Math.random() * itemsToDisplay.length)];
                wordDisplay.style.display = 'block';
                wordDisplay.innerHTML = `<div class="word-prompt">Zoek: <span class="word-target">${this.currentWord.n}</span></div>`;
            } else {
                this.currentWord = null;
                wordDisplay.style.display = 'none';
            }
            
            itemsToDisplay.forEach((item, index) => {
                const type = item.s === 'lancering' ? 'launch' : (item.s === 'tractor_motor' ? 'drive-off' : 'pop');
                const pos = positions[index % positions.length];
                
                const el = document.createElement('div');
                el.className = 'interactive-object scannable';
                el.textContent = item.i;
                el.dataset.name = item.n;
                el.dataset.sound = item.s || '';
                el.style.top = pos.top;
                el.style.left = pos.left;
                el.dataset.animation = `animate-${type}`;
                container.appendChild(el);
            });
            
            Accessibility.restartScanIfActive();
        },
        
        handleClick(e) {
            const target = e.target.closest('.interactive-object');
            if (!target || target.classList.contains('hidden')) return;
            
            // In woorden-modus: check of dit het juiste woord is
            if (this.useWords && this.currentWord) {
                if (target.dataset.name !== this.currentWord.n) {
                    // Fout antwoord
                    TTS.speak('Probeer het nog eens.');
                    return;
                }
                // Goed antwoord - kies nieuw woord
                TTS.speak('Goed zo!');
                setTimeout(() => {
                    const allItems = [...document.querySelectorAll('.interactive-object')]
                        .filter(el => !el.classList.contains('hidden'))
                        .map(el => ({n: el.dataset.name, s: el.dataset.sound}));
                    
                    if (allItems.length > 0) {
                        this.currentWord = allItems[Math.floor(Math.random() * allItems.length)];
                        document.getElementById('word-display').innerHTML = 
                            `<div class="word-prompt">Zoek: <span class="word-target">${this.currentWord.n}</span></div>`;
                    }
                }, 500);
            }
            
            SoundController.play(target.dataset.sound);
            if (!this.useWords) {
                setTimeout(() => TTS.speak(target.dataset.name), 100);
            }
            
            target.classList.add(target.dataset.animation);
            target.classList.add('hidden');
            
            setTimeout(() => {
                target.classList.remove(target.dataset.animation);
                target.classList.remove('hidden');
            }, this.config.respawn);
        }
    },
    
    'moving-targets': {
        name: "Vliegende Vangers",
        levels: [
            {n: 3, spd: 1},
            {n: 5, spd: 2},
            {n: 7, spd: 3}
        ],
        targets: [],
        animationFrameId: null,
        currentSpeed: 1,
        
        create(level) {
            this.config = this.levels[level - 1];
            this.currentSpeed = this.config.spd;
            
            // Voeg snelheidsslider toe
            // Slider hoort bij "Volledige Controle", niet bij "Enkel Spel"
            // Dus GEEN scannable class bij game-only modus
            const sliderClass = Settings.state.scanScope === 'full' ? 'scannable' : '';
            DOM.gameArea.innerHTML = `
                <div class="speed-control">
                    <label>Snelheid: <span id="speed-value">${this.currentSpeed}x</span></label>
                    <input type="range" id="speed-slider" class="${sliderClass}" min="0.5" max="5" step="0.5" value="${this.currentSpeed}">
                </div>
            `;
            
            // Event listener voor snelheidsslider
            document.getElementById('speed-slider').addEventListener('input', e => {
                this.currentSpeed = parseFloat(e.target.value);
                document.getElementById('speed-value').textContent = `${this.currentSpeed}x`;
            });
            
            requestAnimationFrame(() => {
                for (let i = 0; i < this.config.n; i++) {
                    this.addTarget();
                }
                this.gameLoop();
            });
        },
        
        destroy() {
            cancelAnimationFrame(this.animationFrameId);
            this.targets = [];
        },
        
        addTarget() {
            const el = document.createElement('div');
            el.className = 'moving-target scannable';
            const item = Utils.getThemeItems().items[Math.floor(Math.random() * 6)];
            el.textContent = item.i;
            
            const size = DOM.gameArea.getBoundingClientRect();
            if (size.width < 80) {
                setTimeout(() => this.addTarget(), 100);
                return;
            }
            
            el.style.left = `${Math.random() * (size.width - 80)}px`;
            el.style.top = `${Math.random() * (size.height - 80)}px`;
            DOM.gameArea.appendChild(el);
            
            const target = {
                el,
                x: parseFloat(el.style.left),
                y: parseFloat(el.style.top),
                baseDx: (Math.random() - 0.5) * 2,
                baseDy: (Math.random() - 0.5) * 2
            };
            
            el.addEventListener('click', () => {
                SoundController.play(item.s);
                TTS.speak(item.n);
                el.classList.add('caught');
                
                setTimeout(() => {
                    if (el.parentElement) {
                        el.remove();
                        this.targets.splice(this.targets.indexOf(target), 1);
                        this.addTarget();
                        Accessibility.restartScanIfActive();
                    }
                }, 300);
            });
            
            this.targets.push(target);
        },
        
        gameLoop() {
            const size = DOM.gameArea.getBoundingClientRect();
            
            this.targets.forEach(t => {
                // Gebruik currentSpeed in plaats van vaste snelheid
                const dx = t.baseDx * this.currentSpeed;
                const dy = t.baseDy * this.currentSpeed;
                
                t.x += dx;
                t.y += dy;
                
                // Keer richting om bij grenzen
                if (t.x <= 0 || t.x >= size.width - 80) {
                    t.baseDx *= -1;
                    t.x = Math.max(0, Math.min(t.x, size.width - 80));
                }
                if (t.y <= 50 || t.y >= size.height - 80) { // 50 voor de speed control
                    t.baseDy *= -1;
                    t.y = Math.max(50, Math.min(t.y, size.height - 80));
                }
                
                t.el.style.left = `${t.x}px`;
                t.el.style.top = `${t.y}px`;
            });
            
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        }
    },
    
    'same-or-different': {
        name: "Hetzelfde of Anders",
        levels: [
            { transform: 'none', description: 'Normaal', choices: 3 },
            { transform: 'size', description: 'Grootte', choices: 3 },
            { transform: 'silhouette', description: 'Schaduw', choices: 3 },
            { transform: 'mirror', description: 'Spiegelen', choices: 5 },
            { transform: 'combo', description: 'Combinatie', choices: 5 }
        ],
        useWords: false,
        currentLevel: 1,
        
        create(level) {
            this.config = this.levels[level - 1];
            this.currentLevel = level;
            
            // Reset naar plaatjes voor niveau 2, 3, 5 (ALTIJD plaatjes)
            if (level === 2 || level === 3 || level === 5) {
                this.useWords = false;
            }
            
            DOM.gameArea.innerHTML = `<div id="sod-container"><div id="sod-reference-area"></div><div id="sod-choice-area"></div></div>`;
            
            // Voeg toggle toe ALLEEN voor niveau 1 en 4 (leesoefening)
            if (level === 1 || level === 4) {
                this.addWordsToggleToTopBar();
            }
            
            this.setupLevel();
            
            this.boundClickHandler = e => {
                const card = e.target.closest('.sod-choice-card');
                if (card) this.checkAnswer(card);
            };
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        addWordsToggleToTopBar() {
            const levelSelector = DOM.levelSelector;
            if (!levelSelector) return;
            
            // Verwijder oude toggle als die er is
            const oldToggle = document.querySelector('.sod-words-toggle');
            if (oldToggle) oldToggle.remove();
            
            // Maak nieuwe toggle
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'sod-words-toggle';
            toggleDiv.innerHTML = `
                <button class="setting-button toggle-btn scannable ${!this.useWords ? 'active' : ''}" data-mode="icons">
                    <span>🎨</span> Plaatjes
                </button>
                <button class="setting-button toggle-btn scannable ${this.useWords ? 'active' : ''}" data-mode="words">
                    <span>🔤</span> Woorden
                </button>
            `;
            
            // Voeg toe na de level selector
            levelSelector.parentNode.insertBefore(toggleDiv, levelSelector.nextSibling);
            
            // Event listeners
            toggleDiv.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.useWords = btn.dataset.mode === 'words';
                    document.querySelectorAll('.sod-words-toggle .toggle-btn').forEach(b => 
                        b.classList.toggle('active', b.dataset.mode === (this.useWords ? 'words' : 'icons'))
                    );
                    this.setupLevel();
                });
            });
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
            // Verwijder de words toggle uit de top-bar
            const toggle = document.querySelector('.sod-words-toggle');
            if (toggle) toggle.remove();
        },
        
        setupLevel() {
            const items = Utils.shuffleArray([...Utils.getThemeItems().items]);
            this.correctAnswer = items[0];
            
            // Pas transformatie toe op basis van het niveau
            let transformClass = '';
            let sizeClass = '';
            
            if (this.config.transform === 'mirror') {
                transformClass = 'sod-mirror';
            } else if (this.config.transform === 'size') {
                sizeClass = 'sod-large';
            } else if (this.config.transform === 'silhouette') {
                transformClass = 'sod-silhouette';
            } else if (this.config.transform === 'combo') {
                // Combinatie: schaduw + mogelijk spiegeling
                transformClass = 'sod-silhouette';
            }
            
            // Referentie object
            const referenceTransform = this.config.transform === 'mirror' ? '' : transformClass;
            let referenceSize = this.config.transform === 'size' ? '' : sizeClass;
            
            // Voor size niveau: gebruik de willekeurige grootte en sla op
            if (this.config.transform === 'size') {
                const sizes = ['small', 'normal', 'large'];
                this.referenceSizeValue = sizes[Math.floor(Math.random() * sizes.length)];
                if (this.referenceSizeValue === 'small') referenceSize = 'sod-small';
                else if (this.referenceSizeValue === 'large') referenceSize = 'sod-large';
                // 'normal' blijft leeg (standaard grootte)
            }
            
            // Toon woord of emoji als hoofdplaatje
            const referenceContent = this.useWords 
                ? `<div class="sod-word">${this.correctAnswer.n}</div>`
                : `<div class="sod-object ${referenceTransform} ${referenceSize}">${this.correctAnswer.i}</div>`;
            
            document.getElementById('sod-reference-area').innerHTML = referenceContent;
            
            // Maak keuzes op basis van het niveau
            const numChoices = this.config.choices || 3;
            const choices = [];
            
            if (this.config.transform === 'size') {
                // Niveau 2: 3 keuzes, allemaal hetzelfde icoon maar verschillende groottes
                // Gebruik de opgeslagen referentie grootte
                const sizes = ['small', 'normal', 'large'];
                
                // Alle keuzes gebruiken hetzelfde icoon als het referentie object
                choices.push({...this.correctAnswer, isCorrect: true, isMirrored: false, size: this.referenceSizeValue});
                
                // Voeg de andere twee groottes toe
                const otherSizes = sizes.filter(s => s !== this.referenceSizeValue);
                choices.push({...this.correctAnswer, isCorrect: false, isMirrored: false, size: otherSizes[0]});
                choices.push({...this.correctAnswer, isCorrect: false, isMirrored: false, size: otherSizes[1]});
            } else if (this.config.transform === 'silhouette') {
                // Niveau 3: 3 keuzes, schaduw discriminatie
                choices.push({...this.correctAnswer, isCorrect: true, isMirrored: false, isLarge: false, isSilhouette: false});
                choices.push({...items[1], isCorrect: false, isMirrored: false, isLarge: false, isSilhouette: false});
                choices.push({...items[2], isCorrect: false, isMirrored: false, isLarge: false, isSilhouette: false});
            } else if (this.config.transform === 'mirror') {
                // Niveau 4: 5 keuzes, waarvan sommige gespiegeld kunnen zijn
                const baseItems = items.slice(0, Math.min(5, items.length));
                
                // Voeg het juiste antwoord toe (normaal)
                choices.push({...this.correctAnswer, isCorrect: true, isMirrored: false, isLarge: false});
                
                // Voeg andere items toe, sommige gespiegeld
                baseItems.forEach((item, index) => {
                    if (item.i !== this.correctAnswer.i) {
                        const isMirrored = Math.random() < 0.6; // 60% kans op spiegeling
                        choices.push({...item, isCorrect: false, isMirrored, isLarge: false});
                    }
                });
                
                // Vul aan tot 5 keuzes als nodig
                while (choices.length < 5 && choices.length < items.length) {
                    const randomItem = items[Math.floor(Math.random() * items.length)];
                    if (!choices.find(c => c.i === randomItem.i)) {
                        const isMirrored = Math.random() < 0.5;
                        choices.push({...randomItem, isCorrect: false, isMirrored, isLarge: false});
                    }
                }
            } else if (this.config.transform === 'combo') {
                // Niveau 5: 5 keuzes, combinatie van schaduw en spiegeling
                const baseItems = items.slice(0, Math.min(5, items.length));
                
                // Voeg het juiste antwoord toe (normaal, niet gespiegeld)
                choices.push({...this.correctAnswer, isCorrect: true, isMirrored: false, isSilhouette: false});
                
                // Voeg andere items toe met verschillende combinaties
                baseItems.forEach((item, index) => {
                    if (item.i !== this.correctAnswer.i) {
                        const isMirrored = Math.random() < 0.4; // 40% kans op spiegeling
                        const isSilhouette = Math.random() < 0.3; // 30% kans op schaduw
                        choices.push({...item, isCorrect: false, isMirrored, isSilhouette});
                    }
                });
                
                // Vul aan tot 5 keuzes als nodig
                while (choices.length < 5 && choices.length < items.length) {
                    const randomItem = items[Math.floor(Math.random() * items.length)];
                    if (!choices.find(c => c.i === randomItem.i)) {
                        const isMirrored = Math.random() < 0.4;
                        const isSilhouette = Math.random() < 0.3;
                        choices.push({...randomItem, isCorrect: false, isMirrored, isSilhouette});
                    }
                }
            } else {
                // Niveau 1 & 2: 3 keuzes, normaal
                choices.push({...this.correctAnswer, isCorrect: true, isMirrored: false, isLarge: false, isSilhouette: false});
                choices.push({...items[1], isCorrect: false, isMirrored: false, isLarge: false, isSilhouette: false});
                choices.push({...items[2], isCorrect: false, isMirrored: false, isLarge: false, isSilhouette: false});
            }
            
            // Schud de keuzes en render ze
            document.getElementById('sod-choice-area').innerHTML = Utils.shuffleArray(choices).map(c => {
                let classes = 'sod-object';
                if (c.isMirrored) classes += ' sod-mirror';
                if (c.isLarge) classes += ' sod-large';
                if (c.isSilhouette) classes += ' sod-silhouette';
                if (c.size === 'small') classes += ' sod-small';
                if (c.size === 'large') classes += ' sod-large';
                
                return `<div class="sod-choice-card scannable" data-name="${c.n}" data-sound="${c.s}" data-icon="${c.i}" data-correct="${c.isCorrect}">
                    <div class="${classes}">${c.i}</div>
                </div>`;
            }).join('');
            
            Accessibility.restartScanIfActive();
        },
        
        checkAnswer(card) {
            SoundController.play(card.dataset.sound);
            
            // Gebruik data-correct attribuut voor betere controle
            const isCorrect = card.dataset.correct === 'true';
            
            if (isCorrect) {
                GameController.showFeedback(true);
                setTimeout(() => this.setupLevel(), 1500);
            } else {
                const objectEl = card.querySelector('.sod-object');
                const isMirrored = objectEl.classList.contains('sod-mirror');
                const isLarge = objectEl.classList.contains('sod-large');
                const isSmall = objectEl.classList.contains('sod-small');
                const isSilhouette = objectEl.classList.contains('sod-silhouette');
                
                let feedback = `Dit is ${card.dataset.name}`;
                
                // Bouw feedback op basis van transformaties
                const transformations = [];
                if (isMirrored) transformations.push('gespiegeld');
                if (isLarge) transformations.push('groot');
                if (isSmall) transformations.push('klein');
                if (isSilhouette) transformations.push('als schaduw');
                
                if (transformations.length > 0) {
                    feedback += ` maar ${transformations.join(' en ')}`;
                }
                
                feedback += '. Probeer het nog eens.';
                
                setTimeout(() => TTS.speak(feedback), 100);
                GameController.showFeedback(false);
            }
        }
    },
    
    'counting': {
        name: "Tellen",
        levels: [
            {max: 3},
            {max: 5},
            {max: 10}
        ],
        useWords: false,
        numberWords: ['nul', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien'],
        
        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `
                <div id="counting-container">
                    <h2>Tel tot: <span id="counting-display"></span></h2>
                    <div id="counting-target-area"></div>
                    <div id="counting-source-area"></div>
                </div>`;
            
            this.addWordsToggleToTopBar();
            this.setupLevel();
            this.boundClickHandler = e => this.handleSourceClick(e);
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        addWordsToggleToTopBar() {
            const levelSelector = DOM.levelSelector;
            if (!levelSelector) return;
            
            const oldToggle = document.querySelector('.counting-words-toggle');
            if (oldToggle) oldToggle.remove();
            
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'counting-words-toggle';
            toggleDiv.innerHTML = `
                <button class="setting-button toggle-btn scannable ${!this.useWords ? 'active' : ''}" data-mode="numbers">
                    <span>🔢</span> Cijfers
                </button>
                <button class="setting-button toggle-btn scannable ${this.useWords ? 'active' : ''}" data-mode="words">
                    <span>🔤</span> Woorden
                </button>
            `;
            
            levelSelector.parentNode.insertBefore(toggleDiv, levelSelector.nextSibling);
            
            toggleDiv.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.useWords = btn.dataset.mode === 'words';
                    document.querySelectorAll('.counting-words-toggle .toggle-btn').forEach(b => 
                        b.classList.toggle('active', b.dataset.mode === (this.useWords ? 'words' : 'numbers'))
                    );
                    this.setupLevel();
                });
            });
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
            const toggle = document.querySelector('.counting-words-toggle');
            if (toggle) toggle.remove();
        },
        
        setupLevel() {
            this.targetNumber = Math.floor(Math.random() * this.config.max) + 1;
            this.currentCount = 0;
            
            // Toon als woord of cijfer
            const displayValue = this.useWords 
                ? this.numberWords[this.targetNumber] || this.targetNumber
                : this.targetNumber;
            
            document.getElementById('counting-display').textContent = displayValue;
            document.getElementById('counting-target-area').innerHTML = '';
            
            const sourceArea = document.getElementById('counting-source-area');
            sourceArea.innerHTML = '';
            const item = Utils.getThemeItems().items[0];
            
            for (let i = 0; i < this.config.max; i++) {
                sourceArea.innerHTML += `<div class="counting-object scannable" data-sound="${item.s}">${item.i}</div>`;
            }
            
            const spokenNumber = this.useWords ? displayValue : this.targetNumber;
            TTS.speak(`Tel ${spokenNumber} ${Utils.getThemeItems().name}s.`);
            Accessibility.restartScanIfActive();
        },
        
        handleSourceClick(e) {
            const target = e.target.closest('.counting-object');
            if (!target || this.currentCount >= this.targetNumber) return;
            
            SoundController.play(target.dataset.sound);
            target.remove();
            document.getElementById('counting-target-area').innerHTML += `<div class="counting-object">${target.textContent}</div>`;
            this.currentCount++;
            
            setTimeout(() => TTS.speak(this.currentCount), 200);
            
            if (this.currentCount === this.targetNumber) {
                GameController.showFeedback(true);
                setTimeout(() => this.setupLevel(), 1500);
            }
            
            Accessibility.restartScanIfActive();
        }
    },
    
    'math': {
        name: "Rekenen",
        levels: [
            { min: 1, max: 5, operation: 'addition', displayMode: 'icons', showAllNumbers: true },
            { min: 1, max: 10, operation: 'addition', displayMode: 'icons', showAllNumbers: true },
            { min: 5, max: 10, operation: 'addition', displayMode: 'icons' },
            { min: 10, max: 20, operation: 'addition', displayMode: 'icons' },
            { min: 10, max: 100, operation: 'addition', displayMode: 'numbers' },
            { min: 2, max: 10, operation: 'multiplication', displayMode: 'numbers', maxResult: 100 }
        ],
        useIcons: true,
        currentLevel: 1,
        
        create(level) {
            this.config = this.levels[level - 1];
            this.currentLevel = level;
            this.useIcons = this.config.displayMode === 'icons';
            
            DOM.gameArea.innerHTML = `
                <div id="math-container">
                    <div id="math-problem-area"></div>
                    <div id="math-answer-area"></div>
                </div>`;
            
            // Voeg toggle toe aan de top-bar (onder de niveau knoppen) voor niveau 1-4
            const canToggle = level <= 4;
            if (canToggle) {
                this.addModeToggleToTopBar();
            }
            
            this.setupLevel();
            this.boundClickHandler = e => {
                const btn = e.target.closest('.math-answer-btn');
                if (btn) this.checkAnswer(parseInt(btn.textContent));
            };
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        addModeToggleToTopBar() {
            // Voeg toggle toe na de niveau selector
            const levelSelector = DOM.levelSelector;
            if (!levelSelector) return;
            
            // Verwijder oude toggle als die er is
            const oldToggle = document.querySelector('.math-mode-toggle');
            if (oldToggle) oldToggle.remove();
            
            // Maak nieuwe toggle
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'math-mode-toggle';
            toggleDiv.innerHTML = `
                <button class="setting-button toggle-btn scannable ${this.useIcons ? 'active' : ''}" data-mode="icons">
                    <span>🎨</span> Plaatjes
                </button>
                <button class="setting-button toggle-btn scannable ${!this.useIcons ? 'active' : ''}" data-mode="numbers">
                    <span>🔢</span> Getallen
                </button>
            `;
            
            // Voeg toe na de level selector
            levelSelector.parentNode.insertBefore(toggleDiv, levelSelector.nextSibling);
            
            // Event listeners
            toggleDiv.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.useIcons = btn.dataset.mode === 'icons';
                    document.querySelectorAll('.math-mode-toggle .toggle-btn').forEach(b => 
                        b.classList.toggle('active', b.dataset.mode === (this.useIcons ? 'icons' : 'numbers'))
                    );
                    this.setupLevel();
                });
            });
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
            // Verwijder de mode toggle uit de top-bar
            const toggle = document.querySelector('.math-mode-toggle');
            if (toggle) toggle.remove();
        },
        
        setupLevel() {
            let n1, n2, operator, operatorSymbol, question;
            
            if (this.config.operation === 'multiplication') {
                // Vermenigvuldiging
                n1 = Math.floor(Math.random() * (this.config.max - this.config.min + 1)) + this.config.min;
                n2 = Math.floor(Math.random() * (this.config.max - this.config.min + 1)) + this.config.min;
                this.answer = n1 * n2;
                
                // Zorg dat het antwoord niet boven maxResult komt
                while (this.answer > this.config.maxResult) {
                    n1 = Math.floor(Math.random() * (this.config.max - this.config.min + 1)) + this.config.min;
                    n2 = Math.floor(Math.random() * (this.config.max - this.config.min + 1)) + this.config.min;
                    this.answer = n1 * n2;
                }
                
                operatorSymbol = '×';
                question = `${n1} keer ${n2} is?`;
            } else {
                // Optelling - betere spreiding
                const range = this.config.max - this.config.min;
                n1 = Math.floor(Math.random() * range) + this.config.min;
                
                // Zorg voor betere spreiding: n2 niet altijd klein
                const maxN2 = this.config.max - n1;
                const minN2 = Math.max(1, this.config.min);
                n2 = Math.floor(Math.random() * (maxN2 - minN2 + 1)) + minN2;
                
                this.answer = n1 + n2;
                operatorSymbol = '+';
                question = `${n1} plus ${n2} is?`;
            }
            
            // Render probleem
            if (this.useIcons && n1 <= 20 && n2 <= 20) {
                // Toon met icoontjes
                const item = Utils.getThemeItems().items[0];
                const createGroup = n => `<div class="math-object-group">${Array(n).fill(`<div class="math-object">${item.i}</div>`).join('')}</div>`;
                document.getElementById('math-problem-area').innerHTML = 
                    `${createGroup(n1)}<span class="math-operator">${operatorSymbol}</span>${createGroup(n2)}<span class="math-operator">=</span><span class="math-operator">?</span>`;
            } else {
                // Toon met getallen in thema-kleuren
                document.getElementById('math-problem-area').innerHTML = 
                    `<span class="math-number themed">${n1}</span><span class="math-operator">${operatorSymbol}</span><span class="math-number themed">${n2}</span><span class="math-operator">=</span><span class="math-operator">?</span>`;
            }
            
            // Genereer antwoordopties
            let answers;
            
            if (this.config.showAllNumbers) {
                // Niveau 1-2: toon alle getallen van 1 t/m max
                answers = Array.from({ length: this.config.max }, (_, i) => i + 1);
                document.getElementById('math-answer-area').innerHTML = answers.map(a =>
                    `<button class="math-answer-btn scannable themed-btn ${a === 10 ? 'double-digit' : ''}">${a}</button>`
                ).join('');
            } else {
                // Andere niveaus: 3 willekeurige opties
                answers = [this.answer];
                const answerRange = Math.max(10, Math.floor(this.answer * 0.5));
                
                while (answers.length < 3) {
                    let wrong;
                    if (this.config.operation === 'multiplication') {
                        wrong = Math.floor(Math.random() * this.config.maxResult) + 1;
                    } else {
                        // Zorg ervoor dat wrong altijd een heel getal is
                        const baseValue = Math.floor(this.answer - answerRange/2);
                        wrong = Math.floor(Math.random() * answerRange) + Math.max(1, baseValue);
                    }
                    if (wrong > 0 && !answers.includes(wrong) && Number.isInteger(wrong)) {
                        answers.push(wrong);
                    }
                }
                
                document.getElementById('math-answer-area').innerHTML = Utils.shuffleArray(answers).map(a =>
                    `<button class="math-answer-btn scannable themed-btn">${a}</button>`
                ).join('');
            }
            
            TTS.speak(question);
            Accessibility.restartScanIfActive();
        },
        
        checkAnswer(val) {
            SoundController.play('klik');
            
            if (val === this.answer) {
                GameController.showFeedback(true);
                setTimeout(() => this.setupLevel(), 1500);
            } else {
                GameController.showFeedback(false);
            }
        }
    },
    
    'memory': {
        name: "Memory",
        levels: [
            {pairs: 2, cols: 2},
            {pairs: 4, cols: 4},
            {pairs: 6, cols: 4},
            {pairs: 10, cols: 5}
        ],
        flippedCards: [],
        matchedPairs: 0,
        lockBoard: false,
        useWords: false,
        
        create(level) {
            this.config = this.levels[level - 1];
            this.addWordsToggleToTopBar();
            this.setupLevel();
        },
        
        addWordsToggleToTopBar() {
            const levelSelector = DOM.levelSelector;
            if (!levelSelector) return;
            
            const oldToggle = document.querySelector('.memory-words-toggle');
            if (oldToggle) oldToggle.remove();
            
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'memory-words-toggle';
            toggleDiv.innerHTML = `
                <button class="setting-button toggle-btn scannable ${!this.useWords ? 'active' : ''}" data-mode="icons">
                    <span>🎨</span> Plaatjes
                </button>
                <button class="setting-button toggle-btn scannable ${this.useWords ? 'active' : ''}" data-mode="words">
                    <span>🔤</span> Woord+Plaatje
                </button>
            `;
            
            levelSelector.parentNode.insertBefore(toggleDiv, levelSelector.nextSibling);
            
            toggleDiv.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.useWords = btn.dataset.mode === 'words';
                    document.querySelectorAll('.memory-words-toggle .toggle-btn').forEach(b => 
                        b.classList.toggle('active', b.dataset.mode === (this.useWords ? 'words' : 'icons'))
                    );
                    this.setupLevel();
                });
            });
        },
        
        destroy() {
            if (this.boundCardClickHandler) {
                DOM.gameArea.removeEventListener('click', this.boundCardClickHandler);
            }
            const toggle = document.querySelector('.memory-words-toggle');
            if (toggle) toggle.remove();
        },
        
        setupLevel() {
            this.matchedPairs = 0;
            this.flippedCards = [];
            this.lockBoard = false;
            
            const allItems = Utils.getThemeItems().items;
            // Als we meer paren nodig hebben dan items beschikbaar, herhaal de items cyclisch
            let items = [];
            for (let i = 0; i < this.config.pairs; i++) {
                items.push(allItems[i % allItems.length]);
            }
            items = Utils.shuffleArray(items);
            
            // In woorden-modus: maak paren van woord + plaatje
            let cards;
            if (this.useWords) {
                cards = [];
                items.forEach(item => {
                    // Voeg plaatje toe
                    cards.push({...item, showWord: false});
                    // Voeg woord toe
                    cards.push({...item, showWord: true});
                });
                cards = Utils.shuffleArray(cards);
            } else {
                // Normale modus: 2x hetzelfde plaatje
                cards = Utils.shuffleArray([...items, ...items]);
            }
            
            const grid = document.createElement('div');
            grid.id = 'memory-grid';
            grid.style.gridTemplateColumns = `repeat(${this.config.cols}, 1fr)`;
            DOM.gameArea.innerHTML = '';
            DOM.gameArea.appendChild(grid);
            
            grid.innerHTML = cards.map(item => {
                const content = item.showWord 
                    ? `<div class="memory-word">${item.n}</div>`
                    : item.i;
                
                return `<div class="memory-card scannable" data-item="${item.i}" data-name="${item.n}" data-sound="${item.s}">
                    <div class="memory-card-face memory-card-back"></div>
                    <div class="memory-card-face memory-card-front">${content}</div>
                </div>`;
            }).join('');
            
            this.boundCardClickHandler = this.handleCardClick.bind(this);
            DOM.gameArea.addEventListener('click', this.boundCardClickHandler);
            
            const modeText = this.useWords ? 'Vind de woorden en plaatjes die bij elkaar horen.' : 'Zoek de paren.';
            TTS.speak(modeText);
            Accessibility.restartScanIfActive();
        },
        
        handleCardClick(e) {
            const card = e.target.closest('.memory-card');
            if (this.lockBoard || !card || card.classList.contains('flipped')) return;
            
            SoundController.play(card.dataset.sound);
            setTimeout(() => TTS.speak(card.dataset.name), 100);
            
            card.classList.add('flipped');
            this.flippedCards.push(card);
            
            if (this.flippedCards.length === 2) {
                this.lockBoard = true;
                setTimeout(this.checkMatch.bind(this), 1200);
            }
        },
        
        checkMatch() {
            try {
                const [c1, c2] = this.flippedCards;

                if (c1.dataset.item === c2.dataset.item) {
                    c1.classList.add('matched');
                    c2.classList.add('matched');
                    this.matchedPairs++;
                    GameController.showFeedback(true);

                    if (this.matchedPairs === this.config.pairs) {
                        setTimeout(() => TTS.speak('Alles gevonden! Heel goed gedaan!'), 500);
                        setTimeout(() => this.setupLevel(), 2500);
                    }
                } else {
                    c1.classList.remove('flipped');
                    c2.classList.remove('flipped');
                    setTimeout(() => TTS.speak('Die zijn niet hetzelfde. Probeer opnieuw.'), 500);
                }
            } finally {
                this.flippedCards = [];
                this.lockBoard = false;
            }
        }
    },

    // === EMB SPELLETJES (geïnspireerd op Doorway Online) ===

    'druk-op-mij': {
        name: "Druk op Mij!",
        levels: [
            { aantalKnoppen: 1 },
            { aantalKnoppen: 2 },
            { aantalKnoppen: 4 }
        ],

        create(level) {
            this.config = this.levels[level - 1];
            const items = Utils.getThemeItems().items.slice(0, this.config.aantalKnoppen);

            DOM.gameArea.innerHTML = `<div class="druk-container"></div>`;
            const container = document.querySelector('.druk-container');

            items.forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'druk-knop scannable';
                btn.innerHTML = `<span>${item.i}</span>`;
                btn.dataset.sound = item.s;
                btn.addEventListener('click', () => {
                    SoundController.play(item.s);
                    TTS.speak(item.n);
                    this._explosie(btn, item.i);
                });
                container.appendChild(btn);
            });

            TTS.speak('Druk op een knop!');
            Accessibility.restartScanIfActive();
        },

        _explosie(btn, emoji) {
            btn.classList.add('druk-flash');
            setTimeout(() => btn.classList.remove('druk-flash'), 500);

            const rect = btn.getBoundingClientRect();
            const areaRect = DOM.gameArea.getBoundingClientRect();
            const cx = rect.left - areaRect.left + rect.width / 2;
            const cy = rect.top - areaRect.top + rect.height / 2;

            for (let i = 0; i < 12; i++) {
                const p = document.createElement('div');
                p.className = 'druk-deeltje';
                p.textContent = emoji;
                const angle = (i / 12) * Math.PI * 2;
                const dist = 70 + Math.random() * 100;
                p.style.cssText = `left:${cx}px;top:${cy}px;--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px`;
                DOM.gameArea.appendChild(p);
                setTimeout(() => p.remove(), 900);
            }
        },

        destroy() {}
    },

    'bubbels': {
        name: "Bubbels Tikken",
        levels: [
            { aantal: 3, grootte: 100, snelheid: 4000 },
            { aantal: 6, grootte: 70,  snelheid: 3000 },
            { aantal: 10, grootte: 50, snelheid: 2200 }
        ],
        intervalId: null,

        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = '';
            clearInterval(this.intervalId);

            const vertraging = this.config.snelheid / this.config.aantal;
            for (let i = 0; i < this.config.aantal; i++) {
                setTimeout(() => this._voegBubbel(), i * vertraging);
            }
            this.intervalId = setInterval(() => this._voegBubbel(), vertraging);

            TTS.speak('Tik de bubbels!');
            Accessibility.restartScanIfActive();
        },

        _voegBubbel() {
            const kleuren = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98FB98','#FFB347','#87CEEB','#F0E68C'];
            const kleur = kleuren[Math.floor(Math.random() * kleuren.length)];
            const grootte = this.config.grootte + Math.random() * 20;
            const breedte = DOM.gameArea.clientWidth || 300;

            const bubbel = document.createElement('div');
            bubbel.className = 'bubbel scannable';
            bubbel.style.width = grootte + 'px';
            bubbel.style.height = grootte + 'px';
            bubbel.style.background = `radial-gradient(circle at 35% 35%, white 0%, ${kleur} 50%, ${kleur}99 100%)`;
            bubbel.style.left = Math.max(0, Math.random() * (breedte - grootte)) + 'px';
            bubbel.style.animationDuration = (5 + Math.random() * 3) + 's';

            bubbel.addEventListener('click', () => {
                bubbel.classList.add('bubbel-pop');
                SoundController.play('plons');
                setTimeout(() => bubbel.remove(), 300);
                Accessibility.restartScanIfActive();
            });

            DOM.gameArea.appendChild(bubbel);
            setTimeout(() => { if (bubbel.parentElement) bubbel.remove(); }, 9000);
        },

        destroy() {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    'muziek-maken': {
        name: "Muziek Maken",
        levels: [
            { noten: 4 },
            { noten: 6 },
            { noten: 8 }
        ],
        audioCtx: null,

        create(level) {
            this.config = this.levels[level - 1];

            const alleNoten = [
                { freq: 261.6, naam: 'Do',  kleur: '#FF6B6B' },
                { freq: 293.7, naam: 'Re',  kleur: '#FF9F43' },
                { freq: 329.6, naam: 'Mi',  kleur: '#FFC312' },
                { freq: 349.2, naam: 'Fa',  kleur: '#A3CB38' },
                { freq: 392.0, naam: 'Sol', kleur: '#12CBC4' },
                { freq: 440.0, naam: 'La',  kleur: '#1289A7' },
                { freq: 493.9, naam: 'Si',  kleur: '#9B59B6' },
                { freq: 523.3, naam: "Do'", kleur: '#E84393' }
            ];

            const noten = alleNoten.slice(0, this.config.noten);

            DOM.gameArea.innerHTML = `<div class="muziek-balk-container"></div>`;
            const container = document.querySelector('.muziek-balk-container');

            noten.forEach((noot, i) => {
                // Xylofoon: langere balk = lagere toon (omgekeerde volgorde)
                const balkHoogte = 100 + (noten.length - i) * 22;
                const balk = document.createElement('button');
                balk.className = 'muziek-balk scannable';
                balk.style.background = `linear-gradient(to bottom, ${noot.kleur}cc, ${noot.kleur})`;
                balk.style.height = balkHoogte + 'px';
                balk.innerHTML = `<span class="muziek-naam">${noot.naam}</span>`;

                balk.addEventListener('click', () => {
                    this._speelNoot(noot.freq);
                    balk.classList.add('muziek-hit');
                    setTimeout(() => balk.classList.remove('muziek-hit'), 200);
                    TTS.speak(noot.naam);
                });

                container.appendChild(balk);
            });

            TTS.speak('Druk op de balken om muziek te maken!');
            Accessibility.restartScanIfActive();
        },

        _speelNoot(freq) {
            try {
                if (!this.audioCtx) {
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                const ctx = this.audioCtx;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.5, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
                osc.start();
                osc.stop(ctx.currentTime + 1.2);
            } catch (e) {}
        },

        destroy() {
            if (this.audioCtx) {
                this.audioCtx.close().catch(() => {});
                this.audioCtx = null;
            }
        }
    },

    'vuurwerk': {
        name: "Vuurwerk!",
        levels: [
            { raketten: 1, sterren: 20 },
            { raketten: 3, sterren: 35 },
            { raketten: 5, sterren: 50 }
        ],
        boundClick: null,

        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `<div class="vuurwerk-hint">✨ Tik op het scherm! ✨</div>`;

            this.boundClick = (e) => {
                const rect = DOM.gameArea.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                for (let i = 0; i < this.config.raketten; i++) {
                    setTimeout(() => {
                        const ox = x + (Math.random() - 0.5) * 100;
                        const oy = y + (Math.random() - 0.5) * 100;
                        this._ontplof(ox, oy);
                    }, i * 180);
                }

                SoundController.play('glinstering');
            };

            DOM.gameArea.addEventListener('click', this.boundClick);
            TTS.speak('Tik op het scherm voor vuurwerk!');
            Accessibility.restartScanIfActive();
        },

        _ontplof(x, y) {
            const kleuren = ['#FF6B6B','#FFD700','#00FF88','#00BFFF','#FF69B4','#FFA500','#ADFF2F','#FF4500','#7FFFD4'];
            for (let i = 0; i < this.config.sterren; i++) {
                const ster = document.createElement('div');
                ster.className = 'vuurwerk-ster';
                const kleur = kleuren[Math.floor(Math.random() * kleuren.length)];
                ster.style.background = kleur;
                ster.style.boxShadow = `0 0 6px 2px ${kleur}`;
                ster.style.left = x + 'px';
                ster.style.top = y + 'px';
                const angle = (i / this.config.sterren) * Math.PI * 2 + Math.random() * 0.4;
                const dist = 50 + Math.random() * 120;
                ster.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
                ster.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
                DOM.gameArea.appendChild(ster);
                setTimeout(() => ster.remove(), 1300);
            }
        },

        destroy() {
            if (this.boundClick) {
                DOM.gameArea.removeEventListener('click', this.boundClick);
            }
        }
    },

    'schilderen': {
        name: "Vrij Schilderen",
        levels: [
            { penGrootte: 40, aantalKleuren: 4 },
            { penGrootte: 25, aantalKleuren: 8 },
            { penGrootte: 15, aantalKleuren: 12 }
        ],
        canvas: null,
        ctx2d: null,
        schildert: false,
        huidigKleur: '#FF6B6B',

        create(level) {
            this.config = this.levels[level - 1];
            this.schildert = false;

            const allKleuren = ['#FF6B6B','#FF9F43','#FFC312','#A3CB38','#12CBC4','#1289A7','#9B59B6','#E84393','#C4E538','#FDA7DF','#D980FA','#00B894'];
            const kleuren = allKleuren.slice(0, this.config.aantalKleuren);
            this.huidigKleur = kleuren[0];

            DOM.gameArea.innerHTML = `
                <div class="schilder-palet">
                    ${kleuren.map((k, i) => `<button class="schilder-kleur scannable${i === 0 ? ' actief' : ''}" data-kleur="${k}" style="background:${k}" aria-label="Kleur ${k}"></button>`).join('')}
                    <button class="schilder-wis scannable" aria-label="Wissen">🗑️</button>
                </div>
                <canvas id="schilder-canvas"></canvas>
            `;

            this.canvas = document.getElementById('schilder-canvas');
            this.ctx2d = this.canvas.getContext('2d');

            requestAnimationFrame(() => {
                const areaRect = DOM.gameArea.getBoundingClientRect();
                const paletH = document.querySelector('.schilder-palet')?.getBoundingClientRect().height || 60;
                this.canvas.width = areaRect.width;
                this.canvas.height = Math.max(100, areaRect.height - paletH - 12);
                this.ctx2d.fillStyle = '#FFFFFF';
                this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
            });

            document.querySelectorAll('.schilder-kleur').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.schilder-kleur').forEach(b => b.classList.remove('actief'));
                    btn.classList.add('actief');
                    this.huidigKleur = btn.dataset.kleur;
                });
            });

            document.querySelector('.schilder-wis').addEventListener('click', () => {
                this.ctx2d.fillStyle = '#FFFFFF';
                this.ctx2d.fillRect(0, 0, this.canvas.width, this.canvas.height);
                SoundController.play('klik');
            });

            this.boundDown = (e) => { this.schildert = true; this._verf(e); };
            this.boundMove = (e) => { if (this.schildert) this._verf(e); };
            this.boundUp   = () => { this.schildert = false; };

            this.canvas.addEventListener('mousedown',  this.boundDown);
            this.canvas.addEventListener('mousemove',  this.boundMove);
            this.canvas.addEventListener('mouseup',    this.boundUp);
            this.canvas.addEventListener('touchstart', this.boundDown, { passive: true });
            this.canvas.addEventListener('touchmove',  this.boundMove, { passive: true });
            this.canvas.addEventListener('touchend',   this.boundUp);

            TTS.speak('Schilder iets moois!');
            Accessibility.restartScanIfActive();
        },

        _verf(e) {
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches?.[0];
            const x = (touch ? touch.clientX : e.clientX) - rect.left;
            const y = (touch ? touch.clientY : e.clientY) - rect.top;
            this.ctx2d.beginPath();
            this.ctx2d.arc(x, y, this.config.penGrootte / 2, 0, Math.PI * 2);
            this.ctx2d.fillStyle = this.huidigKleur;
            this.ctx2d.fill();
        },

        destroy() {
            if (this.canvas) {
                this.canvas.removeEventListener('mousedown',  this.boundDown);
                this.canvas.removeEventListener('mousemove',  this.boundMove);
                this.canvas.removeEventListener('mouseup',    this.boundUp);
                this.canvas.removeEventListener('touchstart', this.boundDown);
                this.canvas.removeEventListener('touchmove',  this.boundMove);
                this.canvas.removeEventListener('touchend',   this.boundUp);
            }
            this.canvas = null;
            this.ctx2d = null;
        }
    },

    'geluid-raden': {
        name: "Wat Hoor Je?",
        levels: [
            { opties: 2 },
            { opties: 3 },
            { opties: 4 }
        ],
        huidigItem: null,

        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `
                <div class="geluid-speel-wrapper">
                    <button id="geluid-speel" class="geluid-speel-knop scannable">🔊 Speel geluid</button>
                </div>
                <div id="geluid-opties" class="geluid-opties"></div>
            `;

            document.getElementById('geluid-speel').addEventListener('click', () => {
                if (this.huidigItem) SoundController.play(this.huidigItem.s);
            });

            this._setupRonde();
        },

        _setupRonde() {
            const alleItems = Utils.getThemeItems().items;
            const shuffled = Utils.shuffleArray([...alleItems]);
            const opties = shuffled.slice(0, this.config.opties);
            this.huidigItem = opties[Math.floor(Math.random() * opties.length)];

            const optiesEl = document.getElementById('geluid-opties');
            optiesEl.innerHTML = opties.map(item => `
                <button class="geluid-optie scannable" data-naam="${item.n}" data-sound="${item.s}">
                    <span class="geluid-optie-icon">${item.i}</span>
                    <span class="geluid-optie-naam">${item.n}</span>
                </button>
            `).join('');

            setTimeout(() => {
                SoundController.play(this.huidigItem.s);
                TTS.speak('Welk plaatje hoort bij dit geluid?');
            }, 500);

            optiesEl.querySelectorAll('.geluid-optie').forEach(btn => {
                btn.addEventListener('click', () => {
                    const isGoed = btn.dataset.naam === this.huidigItem.n;
                    GameController.showFeedback(isGoed);
                    if (isGoed) {
                        SoundController.play(this.huidigItem.s);
                        setTimeout(() => this._setupRonde(), 1800);
                    }
                });
            });

            Accessibility.restartScanIfActive();
        },

        destroy() {}
    },

    'groot-klein': {
        name: "Groot of Klein?",
        levels: [
            { factor: 4.0 },
            { factor: 2.5 },
            { factor: 1.7 }
        ],

        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `
                <div id="gk-vraag" class="gk-vraag">Tik op het <strong>GROTE</strong> plaatje!</div>
                <div id="gk-items" class="gk-items"></div>
            `;
            TTS.speak('Tik op het grote plaatje!');
            this._setupRonde();
        },

        _setupRonde() {
            const items = Utils.shuffleArray([...Utils.getThemeItems().items]).slice(0, 2);
            const grotereIdx = Math.floor(Math.random() * 2);
            const grootFontSize = 110;
            const kleinFontSize = Math.round(grootFontSize / this.config.factor);

            const itemsEl = document.getElementById('gk-items');
            itemsEl.innerHTML = items.map((item, i) => {
                const isGroot = i === grotereIdx;
                const fs = isGroot ? grootFontSize : kleinFontSize;
                return `<button class="gk-item scannable" data-correct="${isGroot}" style="font-size:${fs}px" data-naam="${item.n}" data-sound="${item.s}">${item.i}</button>`;
            }).join('');

            itemsEl.querySelectorAll('.gk-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    SoundController.play(btn.dataset.sound);
                    const isGoed = btn.dataset.correct === 'true';
                    GameController.showFeedback(isGoed);
                    if (isGoed) {
                        setTimeout(() => this._setupRonde(), 1600);
                    }
                });
            });

            Accessibility.restartScanIfActive();
        },

        destroy() {}
    },

    'kies-favoriet': {
        name: "Kies Je Favoriet!",
        levels: [
            { opties: 2 },
            { opties: 3 },
            { opties: 4 }
        ],

        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `
                <div class="kies-vraag">Wat vind jij het leukst? 🌟</div>
                <div id="kies-opties" class="kies-opties"></div>
            `;
            this._setupRonde();
            TTS.speak('Wat vind jij het leukst? Kies maar!');
        },

        _setupRonde() {
            const items = Utils.shuffleArray([...Utils.getThemeItems().items]).slice(0, this.config.opties);
            const optiesEl = document.getElementById('kies-opties');

            optiesEl.innerHTML = items.map(item => `
                <button class="kies-optie scannable" data-sound="${item.s}" data-naam="${item.n}">
                    <span class="kies-icon">${item.i}</span>
                    <span class="kies-naam">${item.n}</span>
                </button>
            `).join('');

            optiesEl.querySelectorAll('.kies-optie').forEach(btn => {
                btn.addEventListener('click', () => {
                    SoundController.play(btn.dataset.sound);
                    TTS.speak('Goed gekozen! ' + btn.dataset.naam);
                    GameController.showFeedback(true);
                    setTimeout(() => this._setupRonde(), 2000);
                });
            });

            Accessibility.restartScanIfActive();
        },

        destroy() {}
    }
};

// --- PWA INSTALLATIE ---
export const PWAInstaller = {
    deferredPrompt: null,
    iosPrompt: null,
    androidPrompt: null,
    
    init() {
        // Luister naar het beforeinstallprompt event (Android/Chrome)
        window.addEventListener('beforeinstallprompt', (e) => {
            // Voorkom dat Chrome automatisch de installatie prompt toont
            e.preventDefault();
            // Bewaar het event zodat we het later kunnen triggeren
            this.deferredPrompt = e;
            // Toon de Android banner
            this.showAndroidBanner();
        });
        
        // Luister naar app installed event
        window.addEventListener('appinstalled', () => {
            console.log('LeerWereld app is geïnstalleerd!');
            this.deferredPrompt = null;
            this.hideAllBanners();
        });
        
        // Check of app al geïnstalleerd is (standalone mode)
        if (this.isInStandaloneMode()) {
            console.log('App draait in standalone mode');
            this.hideAllBanners();
            return;
        }
        
        // Setup banners
        this.setupBanners();
        
        // Check platform en toon juiste banner
        this.checkPlatformAndShowBanner();
    },
    
    setupBanners() {
        // iOS banner
        this.iosPrompt = document.getElementById('ios-install-prompt');
        const closeIosBtn = document.getElementById('close-ios-prompt');
        if (closeIosBtn) {
            closeIosBtn.addEventListener('click', () => this.hideIOSBanner());
        }
        
        // Android banner
        this.androidPrompt = document.getElementById('android-install-prompt');
        const closeAndroidBtn = document.getElementById('close-android-prompt');
        const installAndroidBtn = document.getElementById('android-install-button');
        
        if (closeAndroidBtn) {
            closeAndroidBtn.addEventListener('click', () => this.hideAndroidBanner());
        }
        
        if (installAndroidBtn) {
            installAndroidBtn.addEventListener('click', () => this.promptInstall());
        }
        
        // Setup installatie knop in settings
        const installBtn = document.getElementById('install-button');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.promptInstall());
        }
    },
    
    isIOS() {
        // Oude iOS detectie (iPhone, iPod, oude iPads)
        const oldIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Nieuwe iPad detectie (iPadOS 13+)
        // iPadOS identificeert zich als "Macintosh" maar heeft touch support
        const isIPad = navigator.userAgent.includes('Macintosh') && 
                       navigator.maxTouchPoints > 1;
        
        return oldIOS || isIPad;
    },
    
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    },
    
    isWindows() {
        return /Windows/.test(navigator.userAgent);
    },
    
    isInStandaloneMode() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    },
    
    checkPlatformAndShowBanner() {
        // Wacht even zodat de DOM volledig geladen is
        setTimeout(() => {
            if (this.isIOS() && !this.isInStandaloneMode()) {
                console.log('iOS gedetecteerd - toon iOS banner');
                this.showIOSBanner();
            } else if ((this.isAndroid() || this.isWindows()) && this.deferredPrompt) {
                console.log('Android/Windows gedetecteerd - toon Android banner');
                this.showAndroidBanner();
            }
        }, 1000); // 1 seconde delay zodat gebruiker de app kan zien
    },
    
    showIOSBanner() {
        if (this.iosPrompt) {
            this.iosPrompt.classList.remove('hidden');
            // Forceer reflow voor animatie
            void this.iosPrompt.offsetWidth;
            this.iosPrompt.classList.add('show');
        }
    },
    
    hideIOSBanner() {
        if (this.iosPrompt) {
            this.iosPrompt.classList.remove('show');
            setTimeout(() => {
                this.iosPrompt.classList.add('hidden');
            }, 300);
        }
    },
    
    showAndroidBanner() {
        if (this.androidPrompt) {
            this.androidPrompt.classList.remove('hidden');
            // Forceer reflow voor animatie
            void this.androidPrompt.offsetWidth;
            this.androidPrompt.classList.add('show');
        }
    },
    
    hideAndroidBanner() {
        if (this.androidPrompt) {
            this.androidPrompt.classList.remove('show');
            setTimeout(() => {
                this.androidPrompt.classList.add('hidden');
            }, 300);
        }
    },
    
    hideAllBanners() {
        this.hideIOSBanner();
        this.hideAndroidBanner();
        this.hideInstallButton();
    },
    
    showInstallButton() {
        const installBtn = document.getElementById('install-button');
        const instructions = document.getElementById('install-instructions');
        if (installBtn) {
            installBtn.style.display = 'block';
            if (instructions) {
                instructions.style.display = 'none'; // Verberg instructies als de native installatie beschikbaar is
            }
        }
    },
    
    hideInstallButton() {
        const installBtn = document.getElementById('install-button');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    },
    
    async promptInstall() {
        if (!this.deferredPrompt) {
            alert('De app kan niet automatisch geïnstalleerd worden. Volg de instructies in het instellingen menu.');
            return;
        }
        
        // Verberg de banner eerst
        this.hideAndroidBanner();
        
        // Toon de installatie prompt
        this.deferredPrompt.prompt();
        
        // Wacht op de keuze van de gebruiker
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('Gebruiker heeft de app geïnstalleerd');
            TTS.speak('LeerZone is geïnstalleerd!');
        } else {
            console.log('Gebruiker heeft installatie geweigerd');
        }
        
        // We kunnen het prompt maar één keer gebruiken
        this.deferredPrompt = null;
        this.hideInstallButton();
    }
};

// --- INITIALISATIE ---
export function initApp() {
    AudioEngine.init();
    Settings.init();
    TTS.init();
    Accessibility.init();
    ThemeSelector.init();
    Navigation.init();
    PWAInstaller.init();

    // Thema editor initialiseren
    ThemeEditor.init((viewId) => Navigation.showView(viewId));

    // Geluid testen vanuit de editor (ingebouwde geluiden)
    document.addEventListener('leerzone:play-sound', (e) => {
        SoundController.play(e.detail);
    });

    // Registreer geluiden voor huidig actief thema (bij herstart)
    const activeTheme = Utils.themes[Settings.state.theme];
    SoundController.registerThemeAudio(activeTheme);

    // Maak ButtonMapping beschikbaar voor onclick handlers in HTML
    window.ButtonMapping = ButtonMapping;
}

