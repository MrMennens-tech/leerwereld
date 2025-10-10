/**
 * LeerWereld - Hoofdapplicatie
 * Bevat: Settings, Navigation, Games, Accessibility, TTS, GameController
 */

import { Themes } from './themes.js';
import { AudioEngine, createSoundController } from './audio-engines.js';

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
    themes: Themes,
    
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
        elementSize: 1.0,
        emojiStyle: 'default',
        audioEngine: 'webaudio',
        audioMode: 'both' // 'both', 'soundOnly', 'voiceOnly'
    },
    
    init() {
        this.load();
        this.applyAll();
        this.updateUI();
        
        // Event listeners
        DOM.settingsContainer.addEventListener('click', e => {
            const btn = e.target.closest('.setting-button');
            if (btn && btn.dataset.setting) {
                this.handleButtonClick(e, btn.dataset.setting);
            }
        });
        
        // Scan speed slider
        const scanSlider = document.getElementById('scan-speed-slider');
        scanSlider.addEventListener('input', e => {
            this.state.scanSpeed = parseFloat(e.target.value);
            document.getElementById('scan-speed-value').textContent = `${this.state.scanSpeed.toFixed(1)}s`;
        });
        scanSlider.addEventListener('change', () => this.save());
        
        // Element size slider
        const sizeSlider = document.getElementById('element-size-slider');
        sizeSlider.addEventListener('input', e => {
            this.state.elementSize = parseFloat(e.target.value);
            this.apply('elementSize');
            document.getElementById('element-size-value').textContent = `${this.state.elementSize.toFixed(1)}x`;
        });
        sizeSlider.addEventListener('change', () => this.save());
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
        
        if (key === 'inputMode') Accessibility.setInputMode(this.state.inputMode);
        if (key === 'scanScope') Accessibility.restartScanIfActive();
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
        
        document.getElementById('scan-speed-slider').value = this.state.scanSpeed;
        document.getElementById('scan-speed-value').textContent = `${this.state.scanSpeed.toFixed(1)}s`;
        document.getElementById('element-size-slider').value = this.state.elementSize;
        document.getElementById('element-size-value').textContent = `${this.state.elementSize.toFixed(1)}x`;
    }
};

// --- SOUND CONTROLLER (met toegang tot Settings) ---
export const SoundController = createSoundController(() => Settings.state);

// --- ACCESSIBILITY ---
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
            el.classList.toggle('scan-highlight', index === this.currentIndex);
        });
    },
    
    scanNext() {
        this.currentIndex = (this.currentIndex + 1) % this.scannableElements.length;
        this.highlightCurrent();
    },
    
    activateCurrent() {
        if (this.currentIndex > -1 && this.scannableElements[this.currentIndex]) {
            this.scannableElements[this.currentIndex].click();
        }
    },
    
    handleKeyPress(e) {
        if (!['Space', 'ArrowRight', 'Enter'].includes(e.code)) return;
        e.preventDefault();
        
        if (this.isSwitchDown) return;
        this.isSwitchDown = true;
        
        if (this.inputMode === 'one-button' && e.code === 'Space') {
            this.activateCurrent();
        } else if (this.inputMode === 'two-button') {
            if (e.code === 'ArrowRight') {
                this.scanNext();
            } else if (['Enter', 'Space'].includes(e.code)) {
                this.activateCurrent();
            }
        }
    },
    
    handleKeyUp(e) {
        if (['Space', 'ArrowRight', 'Enter'].includes(e.code)) {
            this.isSwitchDown = false;
        }
    }
};

// --- TEXT-TO-SPEECH ---
export const TTS = {
    voices: [],
    
    init() {
        const loadVoices = () => {
            this.voices = speechSynthesis.getVoices();
        };
        
        if (speechSynthesis.getVoices().length) {
            loadVoices();
        } else {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    },
    
    speak(text) {
        if (Settings.state.feedbackMode === 'visual' || !text) return;
        if (Settings.state.audioMode === 'soundOnly') return; // Alleen geluidseffecten, geen stem
        
        speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        const isMale = Settings.state.voice === 'male';
        
        let chosenVoice = null;
        if (this.voices.length > 0) {
            const nlVoices = this.voices.filter(v => v.lang.startsWith('nl'));
            if (isMale) {
                chosenVoice = nlVoices.find(v => v.gender === 'male' || /man|male|heer|maarten/i.test(v.name));
            } else {
                chosenVoice = nlVoices.find(v => v.gender === 'female' || /vrouw|female|dame|lotte/i.test(v.name));
            }
            utt.voice = chosenVoice || nlVoices.find(v => !/google/i.test(v.name)) || nlVoices[0] || this.voices[0];
        }
        
        utt.lang = 'nl-NL';
        speechSynthesis.speak(utt);
    }
};

// --- NAVIGATION ---
export const Navigation = {
    init() {
        // Main menu navigation
        document.querySelector('.game-grid').addEventListener('click', e => {
            const card = e.target.closest('.game-card');
            if (!card) return;
            
            if (card.id === 'open-settings-from-main') {
                this.showView('settings-view');
                return;
            }
            
            const gameId = card.dataset.game;
            if (gameId) {
                AppState.activeLevel = 1;
                GameController.loadGame(gameId);
                this.showView('game-view');
            }
        });
        
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
        DOM.levelSelector.innerHTML = levels.map((_, i) => 
            `<button class="setting-button scannable ${i + 1 === AppState.activeLevel ? 'active' : ''}" data-level="${i + 1}">${i + 1}</button>`
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
        
        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `<div id="interactive-scene-container"></div>`;
            this.setupLevel();
            this.boundClickHandler = this.handleClick.bind(this);
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
        },
        
        setupLevel() {
            const container = document.getElementById('interactive-scene-container');
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
            
            SoundController.play(target.dataset.sound);
            setTimeout(() => TTS.speak(target.dataset.name), 100);
            
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
        
        create(level) {
            this.config = this.levels[level - 1];
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
                dx: (Math.random() - 0.5) * this.config.spd,
                dy: (Math.random() - 0.5) * this.config.spd
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
                t.x += t.dx;
                t.y += t.dy;
                
                if (t.x <= 0 || t.x >= size.width - 80) t.dx *= -1;
                if (t.y <= 0 || t.y >= size.height - 80) t.dy *= -1;
                
                t.el.style.left = `${t.x}px`;
                t.el.style.top = `${t.y}px`;
            });
            
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        }
    },
    
    'same-or-different': {
        name: "Hetzelfde of Anders",
        levels: [{}, {}, {}],
        
        create() {
            DOM.gameArea.innerHTML = `<div id="sod-container"><div id="sod-reference-area"></div><div id="sod-choice-area"></div></div>`;
            this.setupLevel();
            
            this.boundClickHandler = e => {
                const card = e.target.closest('.sod-choice-card');
                if (card) this.checkAnswer(card);
            };
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
        },
        
        setupLevel() {
            const items = Utils.shuffleArray([...Utils.getThemeItems().items]);
            this.correctAnswer = items[0];
            
            document.getElementById('sod-reference-area').innerHTML = `<div class="sod-object">${this.correctAnswer.i}</div>`;
            
            const choices = [items[0], items[1], items[2]];
            document.getElementById('sod-choice-area').innerHTML = Utils.shuffleArray(choices).map(c =>
                `<div class="sod-choice-card scannable" data-name="${c.n}" data-sound="${c.s}" data-icon="${c.i}">
                    <div class="sod-object">${c.i}</div>
                </div>`
            ).join('');
            
            Accessibility.restartScanIfActive();
        },
        
        checkAnswer(card) {
            SoundController.play(card.dataset.sound);
            
            if (card.dataset.icon === this.correctAnswer.i) {
                GameController.showFeedback(true);
                setTimeout(() => this.setupLevel(), 1500);
            } else {
                setTimeout(() => TTS.speak(`Dit is ${card.dataset.name}. Probeer het nog eens.`), 100);
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
        
        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `
                <div id="counting-container">
                    <h2>Tel tot: <span id="counting-display"></span></h2>
                    <div id="counting-target-area"></div>
                    <div id="counting-source-area"></div>
                </div>`;
            
            this.setupLevel();
            this.boundClickHandler = e => this.handleSourceClick(e);
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
        },
        
        setupLevel() {
            this.targetNumber = Math.floor(Math.random() * this.config.max) + 1;
            this.currentCount = 0;
            
            document.getElementById('counting-display').textContent = this.targetNumber;
            document.getElementById('counting-target-area').innerHTML = '';
            
            const sourceArea = document.getElementById('counting-source-area');
            sourceArea.innerHTML = '';
            const item = Utils.getThemeItems().items[0];
            
            for (let i = 0; i < this.config.max; i++) {
                sourceArea.innerHTML += `<div class="counting-object scannable" data-sound="${item.s}">${item.i}</div>`;
            }
            
            TTS.speak(`Tel ${this.targetNumber} ${Utils.getThemeItems().name}s.`);
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
            {max: 5},
            {max: 10},
            {max: 20}
        ],
        
        create(level) {
            this.config = this.levels[level - 1];
            DOM.gameArea.innerHTML = `
                <div id="math-container">
                    <div id="math-problem-area"></div>
                    <div id="math-answer-area"></div>
                </div>`;
            
            this.setupLevel();
            this.boundClickHandler = e => {
                const btn = e.target.closest('.math-answer-btn');
                if (btn) this.checkAnswer(parseInt(btn.textContent));
            };
            DOM.gameArea.addEventListener('click', this.boundClickHandler);
        },
        
        destroy() {
            DOM.gameArea.removeEventListener('click', this.boundClickHandler);
        },
        
        setupLevel() {
            const n1 = Math.ceil(Math.random() * this.config.max);
            const n2 = Math.ceil(Math.random() * (this.config.max - n1));
            this.answer = n1 + n2;
            
            const item = Utils.getThemeItems().items[0];
            const createGroup = n => `<div class="math-object-group">${Array(n).fill(`<div class="math-object">${item.i}</div>`).join('')}</div>`;
            
            document.getElementById('math-problem-area').innerHTML = `${createGroup(n1)}<span>+</span>${createGroup(n2)}<span>=</span><span>?</span>`;
            
            const answers = [this.answer];
            while (answers.length < 3) {
                const wrong = Math.floor(Math.random() * this.config.max) + 1;
                if (wrong > 0 && !answers.includes(wrong)) {
                    answers.push(wrong);
                }
            }
            
            document.getElementById('math-answer-area').innerHTML = Utils.shuffleArray(answers).map(a =>
                `<button class="math-answer-btn scannable">${a}</button>`
            ).join('');
            
            TTS.speak(`${n1} plus ${n2} is?`);
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
            {pairs: 6, cols: 4}
        ],
        flippedCards: [],
        matchedPairs: 0,
        lockBoard: false,
        
        create(level) {
            this.config = this.levels[level - 1];
            this.setupLevel();
        },
        
        destroy() {
            if (this.boundCardClickHandler) {
                DOM.gameArea.removeEventListener('click', this.boundCardClickHandler);
            }
        },
        
        setupLevel() {
            this.matchedPairs = 0;
            this.flippedCards = [];
            this.lockBoard = false;
            
            const items = Utils.shuffleArray([...Utils.getThemeItems().items]).slice(0, this.config.pairs);
            const cards = Utils.shuffleArray([...items, ...items]);
            
            const grid = document.createElement('div');
            grid.id = 'memory-grid';
            grid.style.gridTemplateColumns = `repeat(${this.config.cols}, 1fr)`;
            DOM.gameArea.innerHTML = '';
            DOM.gameArea.appendChild(grid);
            
            grid.innerHTML = cards.map(item =>
                `<div class="memory-card scannable" data-item="${item.i}" data-name="${item.n}" data-sound="${item.s}">
                    <div class="memory-card-face memory-card-back"></div>
                    <div class="memory-card-face memory-card-front">${item.i}</div>
                </div>`
            ).join('');
            
            this.boundCardClickHandler = this.handleCardClick.bind(this);
            DOM.gameArea.addEventListener('click', this.boundCardClickHandler);
            
            TTS.speak('Zoek de paren.');
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
    }
};

// --- INITIALISATIE ---
export function initApp() {
    AudioEngine.init();
    Settings.init();
    TTS.init();
    Accessibility.init();
    Navigation.init();
}

