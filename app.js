// LeerKracht - Toegankelijk Educatief Spelplatform
// Complete JavaScript implementation combining all modules

class LeerKrachtApp {
    constructor() {
        this.themes = {
            sea: {
                id: "sea",
                name: "Zee",
                colors: { primary: "#0077BE", secondary: "#87CEEB", accent: "#FF6B35", background: "#F0F8FF" },
                sounds: ["wave", "seagull", "dolphin"],
                objects: ["🐠", "🐙", "⭐", "🐚", "🐋"]
            },
            jungle: {
                id: "jungle", 
                name: "Jungle",
                colors: { primary: "#228B22", secondary: "#90EE90", accent: "#FFD700", background: "#F5FFFA" },
                sounds: ["monkey", "bird", "leaves"],
                objects: ["🐒", "🦜", "🐍", "🐅", "🍌"]
            },
            farm: {
                id: "farm",
                name: "Boerderij", 
                colors: { primary: "#8B4513", secondary: "#DEB887", accent: "#FF4500", background: "#FFF8DC" },
                sounds: ["cow", "rooster", "pig"],
                objects: ["🐄", "🐷", "🐓", "🐑", "🚜"]
            },
            space: {
                id: "space",
                name: "Ruimte",
                colors: { primary: "#191970", secondary: "#4169E1", accent: "#FFD700", background: "#000011" },
                sounds: ["rocket", "beep", "whoosh"], 
                objects: ["🚀", "🪐", "⭐", "👽", "🛰️"]
            },
            seasons: {
                id: "seasons",
                name: "Seizoenen",
                colors: { primary: "#32CD32", secondary: "#FFB347", accent: "#FF69B4", background: "#F0FFF0" },
                sounds: ["wind", "rain", "snow"],
                objects: ["🌸", "🍃", "❄️", "☀️", "🌈"]
            },
            sports: {
                id: "sports",
                name: "Sport",
                colors: { primary: "#FF4500", secondary: "#32CD32", accent: "#FFD700", background: "#F5F5F5" },
                sounds: ["whistle", "bounce", "cheer"],
                objects: ["⚽", "🥅", "🏆", "🔔", "🏅"]
            }
        };

        this.games = {
            'discover-tap': { name: 'Ontdek en Tik', icon: '👆', levels: [3, 4, 5] },
            'flying-catchers': { name: 'Vliegende Vangers', icon: '🎯', levels: [2, 3, 4] },
            'same-different': { name: 'Hetzelfde of Anders', icon: '🔍', levels: [1, 2, 3] },
            'counting': { name: 'Tellen', icon: '🔢', levels: [3, 5, 10] },
            'math': { name: 'Rekenen', icon: '➕', levels: [5, 10, 20] },
            'memory': { name: 'Memory', icon: '🧠', levels: [2, 4, 6] }
        };

        this.currentView = 'main-menu';
        this.currentGame = null;
        this.currentLevel = 1;
        this.settings = this.loadSettings();
        this.accessibility = new AccessibilityManager(this);
        this.audioContext = new AudioManager(this);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applySettings();
        this.showView('main-menu');
        
        // Initialize accessibility after DOM is ready
        setTimeout(() => {
            this.accessibility.init();
        }, 100);
    }

    setupEventListeners() {
        // Main menu game cards
        document.querySelectorAll('[data-game]').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectGame(e.target.closest('[data-game]').dataset.game);
            });
        });

        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showView('settings-view');
        });

        // Back buttons
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showView('main-menu');
        });
        
        document.getElementById('settings-back-btn').addEventListener('click', () => {
            this.showView('main-menu');
        });

        document.getElementById('game-settings-btn').addEventListener('click', () => {
            this.showView('settings-view');
        });

        // Level buttons
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLevel(parseInt(e.target.dataset.level));
            });
        });

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeTheme(e.target.closest('[data-theme]').dataset.theme);
            });
        });

        // Settings controls
        document.getElementById('control-mode').addEventListener('change', (e) => {
            this.updateSetting('controlMode', e.target.value);
        });

        document.getElementById('scan-speed').addEventListener('change', (e) => {
            this.updateSetting('scanSpeed', parseInt(e.target.value));
        });

        document.getElementById('scan-mode').addEventListener('change', (e) => {
            this.updateSetting('scanMode', e.target.value);
        });

        document.getElementById('voice-gender').addEventListener('change', (e) => {
            this.updateSetting('voiceGender', e.target.value);
        });

        document.getElementById('high-contrast').addEventListener('change', (e) => {
            this.updateSetting('highContrast', e.target.checked);
        });

        document.getElementById('focus-mode').addEventListener('change', (e) => {
            this.updateSetting('focusMode', e.target.checked);
        });

        document.getElementById('audio-feedback').addEventListener('change', (e) => {
            this.updateSetting('audioFeedback', e.target.checked);
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            this.resetSettings();
        });
    }

    showView(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view
        document.getElementById(viewId).classList.add('active');
        this.currentView = viewId;
        
        // Update accessibility scanning
        this.accessibility.updateScannableElements();
        
        // Announce view change
        this.audioContext.announce(`${this.getViewTitle(viewId)} geopend`);
    }

    getViewTitle(viewId) {
        const titles = {
            'main-menu': 'Hoofdmenu',
            'game-view': 'Spel',
            'settings-view': 'Instellingen'
        };
        return titles[viewId] || viewId;
    }

    selectGame(gameId) {
        this.currentGame = gameId;
        document.getElementById('current-game-title').textContent = this.games[gameId].name;
        this.showView('game-view');
        this.selectLevel(1); // Start with level 1
    }

    selectLevel(level) {
        this.currentLevel = level;
        
        // Update level button states
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        // Start the game
        this.startGame();
    }

    startGame() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = '';
        
        switch(this.currentGame) {
            case 'discover-tap':
                this.startDiscoverGame();
                break;
            case 'flying-catchers':
                this.startFlyingGame();
                break;
            case 'same-different':
                this.startSameDifferentGame();
                break;
            case 'counting':
                this.startCountingGame();
                break;
            case 'math':
                this.startMathGame();
                break;
            case 'memory':
                this.startMemoryGame();
                break;
        }
        
        this.accessibility.updateScannableElements();
    }

    startDiscoverGame() {
        const gameArea = document.getElementById('game-area');
        const objectCount = this.games[this.currentGame].levels[this.currentLevel - 1];
        const objects = this.getCurrentThemeObjects().slice(0, objectCount);
        
        gameArea.innerHTML = '<div class="discover-game"></div>';
        const gameDiv = gameArea.querySelector('.discover-game');
        
        objects.forEach((obj, index) => {
            const objElement = document.createElement('div');
            objElement.className = 'discover-object scannable';
            objElement.textContent = obj;
            objElement.addEventListener('click', () => this.discoverObjectClicked(objElement));
            gameDiv.appendChild(objElement);
        });
        
        this.audioContext.announce(`Ontdek en Tik spel gestart met ${objectCount} objecten`);
    }

    discoverObjectClicked(element) {
        element.classList.add('disappearing');
        this.audioContext.playSound('pop');
        
        setTimeout(() => {
            element.classList.remove('disappearing');
        }, 1500);
    }

    startFlyingGame() {
        const gameArea = document.getElementById('game-area');
        const objectCount = this.games[this.currentGame].levels[this.currentLevel - 1];
        
        gameArea.innerHTML = '<div class="flying-game"></div>';
        const gameDiv = gameArea.querySelector('.flying-game');
        
        this.flyingObjects = [];
        
        for(let i = 0; i < objectCount; i++) {
            this.createFlyingObject(gameDiv);
        }
        
        this.audioContext.announce(`Vliegende Vangers spel gestart met ${objectCount} objecten`);
    }

    createFlyingObject(container) {
        const obj = document.createElement('div');
        obj.className = 'flying-object scannable';
        obj.textContent = this.getRandomThemeObject();
        
        // Random position
        obj.style.left = Math.random() * (container.offsetWidth - 60) + 'px';
        obj.style.top = Math.random() * (container.offsetHeight - 60) + 'px';
        
        // Random direction
        obj.vx = (Math.random() - 0.5) * 4;
        obj.vy = (Math.random() - 0.5) * 4;
        
        obj.addEventListener('click', () => this.catchFlyingObject(obj, container));
        container.appendChild(obj);
        this.flyingObjects.push(obj);
        
        // Start movement
        this.moveFlyingObject(obj, container);
    }

    moveFlyingObject(obj, container) {
        if (!obj.parentNode) return;
        
        const rect = obj.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        let left = parseInt(obj.style.left) + obj.vx;
        let top = parseInt(obj.style.top) + obj.vy;
        
        // Bounce off walls
        if (left <= 0 || left >= container.offsetWidth - 60) obj.vx = -obj.vx;
        if (top <= 0 || top >= container.offsetHeight - 60) obj.vy = -obj.vy;
        
        obj.style.left = Math.max(0, Math.min(container.offsetWidth - 60, left)) + 'px';
        obj.style.top = Math.max(0, Math.min(container.offsetHeight - 60, top)) + 'px';
        
        requestAnimationFrame(() => this.moveFlyingObject(obj, container));
    }

    catchFlyingObject(obj, container) {
        obj.remove();
        this.flyingObjects = this.flyingObjects.filter(o => o !== obj);
        this.audioContext.playSound('catch');
        
        // Create new object
        setTimeout(() => this.createFlyingObject(container), 500);
        
        this.accessibility.updateScannableElements();
    }

    startSameDifferentGame() {
        const gameArea = document.getElementById('game-area');
        const objects = this.getCurrentThemeObjects();
        const referenceObj = objects[Math.floor(Math.random() * objects.length)];
        
        // Create choices (1 correct, 2 different)
        const choices = [referenceObj];
        while(choices.length < 3) {
            const different = objects[Math.floor(Math.random() * objects.length)];
            if (!choices.includes(different)) {
                choices.push(different);
            }
        }
        
        // Shuffle choices
        for(let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        gameArea.innerHTML = `
            <div class="same-different-game">
                <div class="reference-object">${referenceObj}</div>
                <div class="choice-objects"></div>
            </div>
        `;
        
        const choicesDiv = gameArea.querySelector('.choice-objects');
        choices.forEach(choice => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice-object scannable';
            choiceElement.textContent = choice;
            choiceElement.addEventListener('click', () => 
                this.sameDifferentChoice(choiceElement, choice === referenceObj));
            choicesDiv.appendChild(choiceElement);
        });
        
        this.audioContext.announce('Vind het object dat hetzelfde is als hierboven');
    }

    sameDifferentChoice(element, isCorrect) {
        if (isCorrect) {
            element.classList.add('correct');
            this.audioContext.announce('Goed gedaan!');
            this.audioContext.playSound('success');
            
            setTimeout(() => this.startSameDifferentGame(), 2000);
        } else {
            this.audioContext.playSound('try-again');
        }
    }

    startCountingGame() {
        const gameArea = document.getElementById('game-area');
        const targetNumber = Math.floor(Math.random() * this.games[this.currentGame].levels[this.currentLevel - 1]) + 1;
        const objects = this.getCurrentThemeObjects();
        
        gameArea.innerHTML = `
            <div class="counting-game">
                <div class="counting-number">${targetNumber}</div>
                <div class="counting-areas">
                    <div class="counting-source"></div>
                    <div class="counting-target"></div>
                </div>
            </div>
        `;
        
        const sourceArea = gameArea.querySelector('.counting-source');
        
        // Create more objects than needed
        for(let i = 0; i < Math.max(8, targetNumber + 3); i++) {
            const obj = document.createElement('div');
            obj.className = 'counting-object scannable';
            obj.textContent = this.getRandomThemeObject();
            obj.addEventListener('click', () => this.moveToTarget(obj, targetNumber));
            sourceArea.appendChild(obj);
        }
        
        this.countingTarget = 0;
        this.countingGoal = targetNumber;
        
        this.audioContext.announce(`Tel ${targetNumber} objecten`);
    }

    moveToTarget(obj, targetNumber) {
        if (this.countingTarget >= targetNumber) return;
        
        const targetArea = document.querySelector('.counting-target');
        obj.remove();
        
        const targetObj = obj.cloneNode(true);
        targetObj.addEventListener('click', () => this.moveToSource(targetObj));
        targetArea.appendChild(targetObj);
        
        this.countingTarget++;
        this.audioContext.announce(this.countingTarget.toString());
        
        if (this.countingTarget === targetNumber) {
            this.audioContext.announce('Heel goed geteld!');
            this.audioContext.playSound('success');
        }
        
        this.accessibility.updateScannableElements();
    }

    moveToSource(obj) {
        const sourceArea = document.querySelector('.counting-source');
        obj.remove();
        
        const sourceObj = obj.cloneNode(true);
        sourceObj.addEventListener('click', () => this.moveToTarget(sourceObj, this.countingGoal));
        sourceArea.appendChild(sourceObj);
        
        this.countingTarget--;
        this.accessibility.updateScannableElements();
    }

    startMathGame() {
        const gameArea = document.getElementById('game-area');
        const maxResult = this.games[this.currentGame].levels[this.currentLevel - 1];
        
        // Generate simple addition
        const a = Math.floor(Math.random() * (maxResult / 2)) + 1;
        const b = Math.floor(Math.random() * (maxResult - a)) + 1;
        const correctAnswer = a + b;
        
        // Generate wrong answers
        const answers = [correctAnswer];
        while(answers.length < 3) {
            const wrong = Math.max(1, correctAnswer + Math.floor(Math.random() * 6) - 3);
            if (!answers.includes(wrong) && wrong <= maxResult && wrong > 0) {
                answers.push(wrong);
            }
        }
        
        // Shuffle answers
        for(let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        
        const objects = this.getCurrentThemeObjects();
        const objA = objects[0].repeat(a);
        const objB = objects[1].repeat(b);
        
        gameArea.innerHTML = `
            <div class="math-game">
                <div class="math-equation">${objA} + ${objB} = ?</div>
                <div class="math-choices"></div>
            </div>
        `;
        
        const choicesDiv = gameArea.querySelector('.math-choices');
        answers.forEach(answer => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'math-choice scannable';
            choiceElement.textContent = answer;
            choiceElement.addEventListener('click', () => 
                this.mathChoice(choiceElement, answer === correctAnswer));
            choicesDiv.appendChild(choiceElement);
        });
        
        this.audioContext.announce(`Hoeveel is ${a} plus ${b}?`);
    }

    mathChoice(element, isCorrect) {
        if (isCorrect) {
            element.classList.add('correct');
            this.audioContext.announce('Goed gerekend!');
            this.audioContext.playSound('success');
            
            setTimeout(() => this.startMathGame(), 2000);
        } else {
            this.audioContext.playSound('try-again');
        }
    }

    startMemoryGame() {
        const gameArea = document.getElementById('game-area');
        const pairs = this.games[this.currentGame].levels[this.currentLevel - 1];
        const objects = this.getCurrentThemeObjects().slice(0, pairs);
        const cards = [...objects, ...objects];
        
        // Shuffle cards
        for(let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        gameArea.innerHTML = `<div class="memory-game pairs-${pairs}"></div>`;
        const gameDiv = gameArea.querySelector('.memory-game');
        
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card scannable';
            cardElement.textContent = '?';
            cardElement.dataset.symbol = card;
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', () => this.flipMemoryCard(cardElement));
            gameDiv.appendChild(cardElement);
        });
        
        this.memoryFlipped = [];
        this.memoryMatched = 0;
        
        this.audioContext.announce(`Memory spel met ${pairs} paren`);
    }

    flipMemoryCard(card) {
        if (card.classList.contains('flipped') || card.classList.contains('matched') || this.memoryFlipped.length >= 2) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        this.memoryFlipped.push(card);
        
        if (this.memoryFlipped.length === 2) {
            setTimeout(() => this.checkMemoryMatch(), 1000);
        }
    }

    checkMemoryMatch() {
        const [card1, card2] = this.memoryFlipped;
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Match!
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.memoryMatched += 2;
            this.audioContext.playSound('success');
            
            if (this.memoryMatched === document.querySelectorAll('.memory-card').length) {
                this.audioContext.announce('Alle paren gevonden! Heel goed!');
            }
        } else {
            // No match
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
        }
        
        this.memoryFlipped = [];
    }

    getCurrentThemeObjects() {
        return this.themes[this.settings.theme].objects;
    }

    getRandomThemeObject() {
        const objects = this.getCurrentThemeObjects();
        return objects[Math.floor(Math.random() * objects.length)];
    }

    changeTheme(themeId) {
        this.updateSetting('theme', themeId);
        
        // Update theme button states
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${themeId}"]`).classList.add('active');
        
        this.audioContext.announce(`${this.themes[themeId].name} thema gekozen`);
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }

    applySettings() {
        // Apply theme
        document.body.setAttribute('data-theme', this.settings.theme);
        
        // Apply high contrast
        document.body.classList.toggle('high-contrast', this.settings.highContrast);
        
        // Apply focus mode
        document.body.classList.toggle('focus-mode', this.settings.focusMode);
        
        // Update form controls
        document.getElementById('control-mode').value = this.settings.controlMode;
        document.getElementById('scan-speed').value = this.settings.scanSpeed;
        document.getElementById('scan-mode').value = this.settings.scanMode;
        document.getElementById('voice-gender').value = this.settings.voiceGender;
        document.getElementById('high-contrast').checked = this.settings.highContrast;
        document.getElementById('focus-mode').checked = this.settings.focusMode;
        document.getElementById('audio-feedback').checked = this.settings.audioFeedback;
        
        // Update theme button states
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${this.settings.theme}"]`).classList.add('active');
        
        // Update accessibility
        this.accessibility.updateSettings();
    }

    loadSettings() {
        const defaults = {
            theme: 'sea',
            controlMode: 'touch',
            scanSpeed: 3,
            scanMode: 'full',
            highContrast: false,
            focusMode: false,
            voiceGender: 'female',
            audioFeedback: true
        };
        
        try {
            const saved = localStorage.getItem('leerkracht-settings');
            return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
        } catch {
            return defaults;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('leerkracht-settings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save settings:', e);
        }
    }

    resetSettings() {
        if (confirm('Weet je zeker dat je alle instellingen wilt resetten?')) {
            localStorage.removeItem('leerkracht-settings');
            this.settings = this.loadSettings();
            this.applySettings();
            this.audioContext.announce('Instellingen gereset naar standaard');
        }
    }
}

class AccessibilityManager {
    constructor(app) {
        this.app = app;
        this.scannableElements = [];
        this.currentScanIndex = 0;
        this.scanTimer = null;
        this.isScanning = false;
        this.keyPressed = {};
    }

    init() {
        this.setupKeyListeners();
        this.updateScannableElements();
    }

    setupKeyListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.keyPressed[e.code]) return; // Prevent repeat
            this.keyPressed[e.code] = true;
            
            const mode = this.app.settings.controlMode;
            
            if (mode === 'oneButton' && e.code === 'Space') {
                e.preventDefault();
                this.handleOneButtonPress();
            } else if (mode === 'twoButton') {
                if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    this.nextScanElement();
                } else if (e.code === 'Enter') {
                    e.preventDefault();
                    this.activateCurrentElement();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keyPressed[e.code] = false;
        });
    }

    updateScannableElements() {
        // Clear current scan
        this.stopScanning();
        
        // Get all scannable elements in current view
        const currentView = document.querySelector('.view.active');
        if (!currentView) return;
        
        if (this.app.settings.scanMode === 'gameOnly' && this.app.currentView === 'game-view') {
            // Only scan elements within game area
            this.scannableElements = Array.from(currentView.querySelectorAll('#game-area .scannable'));
        } else {
            // Scan all elements in current view
            this.scannableElements = Array.from(currentView.querySelectorAll('.scannable'));
        }
        
        this.currentScanIndex = 0;
        
        if (this.app.settings.controlMode === 'oneButton' && this.scannableElements.length > 0) {
            this.startScanning();
        }
    }

    startScanning() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.showScanIndicator();
        this.highlightCurrentElement();
        this.scheduleNextScan();
    }

    stopScanning() {
        if (this.scanTimer) {
            clearTimeout(this.scanTimer);
            this.scanTimer = null;
        }
        
        this.isScanning = false;
        this.hideScanIndicator();
        this.clearHighlights();
    }

    scheduleNextScan() {
        if (!this.isScanning) return;
        
        const speed = this.app.settings.scanSpeed * 1000;
        this.scanTimer = setTimeout(() => {
            this.nextScanElement();
            this.scheduleNextScan();
        }, speed);
    }

    nextScanElement() {
        if (this.scannableElements.length === 0) return;
        
        this.clearHighlights();
        this.currentScanIndex = (this.currentScanIndex + 1) % this.scannableElements.length;
        this.highlightCurrentElement();
    }

    highlightCurrentElement() {
        if (this.scannableElements.length === 0) return;
        
        const element = this.scannableElements[this.currentScanIndex];
        if (element) {
            element.classList.add('scanning');
            
            // Scroll element into view
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center', 
                inline: 'center' 
            });
        }
    }

    clearHighlights() {
        document.querySelectorAll('.scanning').forEach(el => {
            el.classList.remove('scanning');
        });
    }

    handleOneButtonPress() {
        if (this.scannableElements.length === 0) return;
        
        this.activateCurrentElement();
    }

    activateCurrentElement() {
        if (this.scannableElements.length === 0) return;
        
        const element = this.scannableElements[this.currentScanIndex];
        if (element) {
            this.app.audioContext.playSound('select');
            element.click();
            
            // Update scannable elements after interaction
            setTimeout(() => this.updateScannableElements(), 100);
        }
    }

    showScanIndicator() {
        const indicator = document.getElementById('scan-indicator');
        indicator.classList.remove('hidden');
        
        const progress = indicator.querySelector('.scan-progress');
        progress.style.setProperty('--scan-duration', `${this.app.settings.scanSpeed}s`);
    }

    hideScanIndicator() {
        document.getElementById('scan-indicator').classList.add('hidden');
    }

    updateSettings() {
        if (this.app.settings.controlMode === 'oneButton') {
            this.startScanning();
        } else {
            this.stopScanning();
        }
    }
}

class AudioManager {
    constructor(app) {
        this.app = app;
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.loadVoices();
    }

    loadVoices() {
        const loadVoicesHandler = () => {
            this.voices = this.synth.getVoices().filter(voice => 
                voice.lang.startsWith('nl')
            );
        };
        
        loadVoicesHandler();
        this.synth.addEventListener('voiceschanged', loadVoicesHandler);
    }

    announce(text) {
        if (!this.app.settings.audioFeedback) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        // Select voice based on gender preference
        const preferredGender = this.app.settings.voiceGender;
        const voice = this.voices.find(v => 
            v.name.toLowerCase().includes(preferredGender === 'female' ? 'female' : 'male')
        ) || this.voices[0];
        
        if (voice) {
            utterance.voice = voice;
        }
        
        this.synth.cancel(); // Stop any current speech
        this.synth.speak(utterance);
    }

    playSound(type) {
        if (!this.app.settings.audioFeedback) return;
        
        // Create simple audio feedback using Web Audio API or fallback
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different tones for different actions
        const frequencies = {
            'select': 880,
            'success': 1320,
            'try-again': 440,
            'pop': 660,
            'catch': 1100
        };
        
        oscillator.frequency.setValueAtTime(frequencies[type] || 880, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.leerkrachtApp = new LeerKrachtApp();
});