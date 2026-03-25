/**
 * LeerZone - Audio Engines
 * Bevat: jsfxr library, Web Audio API, en SoundController
 */

// --- JSFXR AUDIO LIBRARY (8-bit retro geluiden) ---
export const jsfxr = function(p) {
    var f,i,b,c,h,j,k,l,m,g,n,o,d,q,r,s,e,t,u,v,w,x,y;
    f=p.length;i=8;b=44100;
    p[0]||(p[0]=0);c=p[0];p[1]||(p[1]=0);h=p[1];p[2]||(p[2]=0);j=p[2];p[3]||(p[3]=.3);k=p[3];
    p[4]||(p[4]=0);l=p[4];p[5]||(p[5]=0);m=p[5];p[6]||(p[6]=0);g=p[6];p[7]||(p[7]=0);n=p[7];
    p[8]||(p[8]=0);o=p[8];p[9]||(p[9]=0);d=p[9];p[10]||(p[10]=0);q=p[10];p[11]||(p[11]=0);r=p[11];
    p[12]||(p[12]=0);s=p[12];p[13]||(p[13]=0);e=p[13];p[14]||(p[14]=0);t=p[14];p[15]||(p[15]=0);u=p[15];
    p[16]||(p[16]=0);v=p[16];p[17]||(p[17]=0);w=p[17];p[18]||(p[18]=0);x=p[18];p[19]||(p[19]=0);y=p[19];
    f>20&&(b=p[20]);f>21&&(i=p[21]);
    
    var z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,aa,ab,ac,ad,ae,af,ag,ah;
    c=p[0];h=p[1];j=p[2];k=p[3];l=p[4];m=p[5];g=p[6];n=p[7];o=p[8];d=p[9];q=p[10];r=p[11];s=p[12];e=p[13];t=p[14];u=p[15];v=p[16];w=p[17];x=p[18];y=p[19];
    z=.5-u;A=t*t*.01;B=g*g*g*100;C=n*n*n*100;D=o*o;E=d<0?-1:1;F=d*d;G=d>0?1-d:1+d;H=1-d;I=1-d*d;J=Math.exp(1-H)-H;K=(1-I)/(H>1?-.01:H<0?0:H);L=-k;M=l<0?1+l:1-l;N=-l;O=m*m*m;P=m<0?-1:1;Q=1-m*m;R=(Math.exp(m)-1)/(Math.exp(1)-1);S=-s*Math.PI;T=v*b;U=w*b;V=x*b;W=y*y;X=function(a){return a<0?-1:1};Y=k+j;Z=Y*Y;$=aa=0;ab=Math.pow(10,20*h-10);ac=Math.pow(2,16*j/1200);ad=4*w/b;ae=c==3?1:0;af=-Math.PI*s*s*1.0E-4;ag=-Math.PI*e*e*1.0E-4;
    ah=new Float32Array(Math.ceil((Y+Z+W)*b));
    
    for(var i=0,pp=0;pp<ah.length;pp++){
        $=++$%(T|0);aa=++aa%(V|0);
        if(s){z+=Math.cos(i*S)*A;i+=1}
        if(e){M+=Math.cos(i*ag)*A;N+=Math.cos(i*af)*A;i+=1}
        g=B*Math.exp(-pp*B/b);n=C*Math.exp(-pp*C/b);o=D*Math.sin(pp*D*Math.PI/b);
        d=pp<U?pp/U:1;d=1-Math.pow(1-d,E*F);d=G+d*H;d=d<0?.001:d;
        q=q>0?q*Math.exp(-pp*q/b):0;r=r?1-Math.pow(pp/((Y+Z+W)*b),r):1;
        L+=1-M*Math.exp(-pp*M/b);M=0;N+=1-L*Math.exp(-pp*L/b);L=0;O&&(Q+=O*P,O=0);
        v=c==1?4*z:c==2?X(Math.sin(pp/v)):c==3?X(Math.random()*2-1):0;
        t=(g+n)*(Math.random()-.5);v=(ae*(.9*v+.1*t)+(1-ae)*v*d+t)*ab;ah[pp]=v;
    }
    
    var samples = Math.floor(ah.length/8);
    var binary = '';
    for(i=0; i<samples; i++){
        var sample = 0;
        for(var j=0; j<8; j++) sample += ah[i*8+j];
        sample = Math.floor(sample/8*127+128);
        sample = Math.max(0,Math.min(255,sample));
        binary += String.fromCharCode(sample);
    }
    
    return "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YV" + samples.toString(16) + btoa(binary);
};

// --- WEB AUDIO API ENGINE (Geavanceerde geluidsynthese) ---
export const AudioEngine = {
    context: null,
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API niet ondersteund:', e);
            this.context = null;
        }
    },
    
    playTone(frequency, duration = 0.2, type = 'sine', volume = 0.3, vibrato = false) {
        if (!this.context) return;
        
        try {
            if (this.context.state === 'suspended') {
                this.context.resume();
            }
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
            oscillator.type = type;
            
            // Optioneel vibrato voor diergeluiden
            if (vibrato) {
                const lfo = this.context.createOscillator();
                const lfoGain = this.context.createGain();
                lfoGain.gain.value = frequency * 0.05; // 5% vibrato
                lfo.frequency.value = 5; // 5 Hz vibrato
                lfo.connect(lfoGain);
                lfoGain.connect(oscillator.frequency);
                lfo.start(this.context.currentTime);
                lfo.stop(this.context.currentTime + duration);
            }
            
            // Volume envelope
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
            
        } catch (e) {
            console.warn('Audio playback error:', e);
        }
    },
    
    // Nieuwe functie: Diergeluid met frequency sweep
    playAnimalSound(startFreq, endFreq, duration = 0.5, type = 'sawtooth', volume = 0.3) {
        if (!this.context) return;
        try {
            if (this.context.state === 'suspended') this.context.resume();
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(startFreq, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.context.currentTime + duration);
            
            // Attack-Decay envelope
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        } catch (e) {
            console.warn('Audio error:', e);
        }
    },
    
    // Plons/splash geluid met noise + filter sweep
    playSplash(volume = 0.3) {
        if (!this.context) return;
        try {
            if (this.context.state === 'suspended') this.context.resume();
            
            const bufferSize = this.context.sampleRate * 0.3;
            const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
            const data = buffer.getChannelData(0);
            
            // White noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.context.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, this.context.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.2);
            
            const gainNode = this.context.createGain();
            gainNode.gain.setValueAtTime(volume, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            noise.start(this.context.currentTime);
            noise.stop(this.context.currentTime + 0.3);
        } catch (e) {
            console.warn('Splash error:', e);
        }
    },
    
    // Klik/pop geluid
    playClick(volume = 0.3) {
        if (!this.context) return;
        try {
            if (this.context.state === 'suspended') this.context.resume();
            
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.frequency.setValueAtTime(1500, this.context.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.02);
            
            gain.gain.setValueAtTime(volume, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
            
            osc.connect(gain);
            gain.connect(this.context.destination);
            
            osc.start(this.context.currentTime);
            osc.stop(this.context.currentTime + 0.05);
        } catch (e) {
            console.warn('Click error:', e);
        }
    },
    
    // Bubbel geluid
    playBubble(volume = 0.25) {
        if (!this.context) return;
        try {
            if (this.context.state === 'suspended') this.context.resume();
            
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const osc = this.context.createOscillator();
                    const gain = this.context.createGain();
                    
                    const freq = 400 + Math.random() * 200;
                    osc.frequency.setValueAtTime(freq, this.context.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.context.currentTime + 0.1);
                    osc.type = 'sine';
                    
                    gain.gain.setValueAtTime(volume * 0.5, this.context.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.15);
                    
                    osc.connect(gain);
                    gain.connect(this.context.destination);
                    
                    osc.start(this.context.currentTime);
                    osc.stop(this.context.currentTime + 0.15);
                }, i * 50);
            }
        } catch (e) {
            console.warn('Bubble error:', e);
        }
    },
    
    // Whoosh/swoosh geluid
    playWhoosh(volume = 0.3) {
        if (!this.context) return;
        try {
            if (this.context.state === 'suspended') this.context.resume();
            
            const bufferSize = this.context.sampleRate * 0.4;
            const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
            }
            
            const noise = this.context.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.context.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2000, this.context.currentTime);
            filter.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 0.3);
            
            const gain = this.context.createGain();
            gain.gain.setValueAtTime(volume, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.4);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.context.destination);
            
            noise.start(this.context.currentTime);
        } catch (e) {
            console.warn('Whoosh error:', e);
        }
    },
    
    playChord(frequencies, duration = 0.3, volume = 0.2) {
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, duration * 0.8, 'sine', volume), index * 50);
        });
    },
    
    playSequence(notes, noteDuration = 0.15) {
        notes.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, noteDuration, 'square', 0.25), index * noteDuration * 1000);
        });
    }
};

// --- SOUND CONTROLLER (Beheert alle audio engines) ---
export function createSoundController(settingsGetter) {
    return {
        // Verschillende audio engine mappings
        soundMaps: {
                // 1. Web Audio API - Geavanceerde synthetische geluiden
                // Elk icoon heeft een UNIEK, herkenbaar geluid!
                webaudio: {
                    // === ZEE THEMA ===
                    'plons': { type: 'splash' },  // 🐠 vis - plons
                    'schaar': { type: 'click' },  // 🦀 krab - klik
                    'bubbel': { type: 'bubble' },  // 🐙 octopus - bubbels
                    'walvis_geluid': { type: 'animal', startFreq: 80, endFreq: 40, duration: 1.5, wave: 'sine' },  // 🐳 walvis - diepe zang
                    'dolfijn_geluid': { type: 'sequence', notes: [1200, 1500, 1800, 2000, 1600], duration: 0.06 },  // 🐬 dolfijn - hoge clicks
                    'glinstering': { type: 'sequence', notes: [1568, 1976, 2349, 2794], duration: 0.07 },  // ⭐ zeester - magisch
                    
                    // === JUNGLE THEMA ===
                    'aap_geluid': { type: 'sequence', notes: [400, 300, 400, 500, 400], duration: 0.1 },  // 🐵 aap - "oe oe"
                    'leeuw_brul': { type: 'animal', startFreq: 150, endFreq: 80, duration: 1.0, wave: 'sawtooth' },  // 🦁 leeuw - brul
                    'olifant_trompet': { type: 'animal', startFreq: 200, endFreq: 400, duration: 0.7, wave: 'triangle' },  // 🐘 olifant - trompet
                    'slang_sis': { type: 'tone', freq: 6000, duration: 0.5, wave: 'square' },  // 🐍 slang - sis
                    'papegaai_praat': { type: 'sequence', notes: [900, 1100, 800, 1200, 900], duration: 0.08 },  // 🦜 papegaai - praat
                    'hap': { type: 'click' },  // 🍌 banaan - hap
                    
                    // === BOERDERIJ THEMA ===
                    'koe_boe': { type: 'animal', startFreq: 180, endFreq: 120, duration: 0.8, wave: 'sawtooth' },  // 🐮 koe - "boe"
                    'varken_knor': { type: 'sequence', notes: [250, 200, 250], duration: 0.15 },  // 🐷 varken - "knor knor"
                    'kip_tok': { type: 'sequence', notes: [1800, 1600, 1800, 1600], duration: 0.04 },  // 🐔 kip - "tok tok"
                    'schaap_blaat': { type: 'animal', startFreq: 300, endFreq: 250, duration: 0.6, wave: 'triangle' },  // 🐑 schaap - "bèh"
                    'paard_hinnik': { type: 'sequence', notes: [500, 400, 500, 400, 500], duration: 0.12 },  // 🐴 paard - hinnik
                    'tractor_motor': { type: 'tone', freq: 60, duration: 0.6, wave: 'sawtooth', vibrato: true },  // 🚜 tractor - motor
                    
                    // === RUIMTE THEMA ===
                    'lancering': { type: 'sequence', notes: [110, 165, 220, 330, 440, 659], duration: 0.15 },  // 🚀 raket
                    'alien_geluid': { type: 'sequence', notes: [1320, 660, 1980, 440], duration: 0.1 },  // 👽 alien
                    'space_swoosh': { type: 'whoosh' },  // 🪐 planeet
                    'swoosh': { type: 'whoosh' },  // ☄️ komeet
                    'beep': { type: 'tone', freq: 1320, duration: 0.08, wave: 'square' },  // 🛰️ satelliet
                    
                    // === KERST THEMA ===
                    'kerst_jingle': { type: 'chord', frequencies: [523, 659, 784], duration: 0.4 },  // 🎄 kerstboom
                    'kerstman_hohoho': { type: 'sequence', notes: [330, 294, 330], duration: 0.25 },  // 🎅 kerstman
                    'rendier_bel': { type: 'chord', frequencies: [1047, 1319, 1568], duration: 0.3 },  // 🦌 rendier
                    'cadeau_uitpak': { type: 'click' },  // 🎁 cadeau
                    'kerstbel_ring': { type: 'sequence', notes: [1568, 1760, 1568, 1319], duration: 0.12 },  // 🔔 kerstbel
                    'magisch': { type: 'sequence', notes: [523, 659, 784, 1047, 1319], duration: 0.08 },  // ⛄ sneeuwpop
                    
                    // === HERFST THEMA ===
                    'blad_ritsel': { type: 'whoosh' },  // 🍁🍂 bladeren
                    'pop': { type: 'click' },  // 🍄 paddenstoel
                    'plof': { type: 'tone', freq: 180, duration: 0.2, wave: 'triangle' },  // 🎃 pompoen
                    'eekhoorn_piep': { type: 'tone', freq: 2400, duration: 0.1, wave: 'sine' },  // 🐿️ eekhoorn
                    'tik': { type: 'click' },  // 🌰 kastanje
                    
                    // === LENTE THEMA ===
                    'lente_bries': { type: 'whoosh' },  // 🌸🌷 bloemen
                    'vlinder_fladder': { type: 'sequence', notes: [1760, 2093, 1980, 2217], duration: 0.05 },  // 🦋 vlinder
                    'groei_geluid': { type: 'sequence', notes: [220, 330, 440, 523, 659], duration: 0.12 },  // 🌱 plantje
                    'kuiken_piep': { type: 'tone', freq: 1980, duration: 0.09, wave: 'sine' },  // 🐣 kuiken
                    
                    // === ZOMER THEMA ===
                    'golfslag': { type: 'splash' },  // 🏖️ strand
                    
                    // === WINTER THEMA ===
                    'winter_wind': { type: 'whoosh' },  // ❄️ sneeuwvlok
                    'stof_geluid': { type: 'whoosh' },  // 🧤🧣 wanten/sjaal
                    'schaats_ijs': { type: 'tone', freq: 3300, duration: 0.3, wave: 'sine' },  // ⛸️ schaats
                    'bibber': { type: 'sequence', notes: [440, 523, 440, 523, 440], duration: 0.06 },  // 🥶 koud
                    'rits': { type: 'tone', freq: 2200, duration: 0.15, wave: 'square' },  // 🧥 jas
                    
                    // === SPORT THEMA ===
                    'schot': { type: 'tone', freq: 100, duration: 0.15, wave: 'square' },  // ⚽ voetbal
                    'basketbal_stuit': { type: 'tone', freq: 200, duration: 0.12, wave: 'sine' },  // 🏀 basketbal
                    'honkbal_slag': { type: 'click' },  // ⚾ honkbal
                    'tennis_slag': { type: 'tone', freq: 1500, duration: 0.05, wave: 'square' },  // 🎾 tennisbal
                    'applaus': { type: 'whoosh' },  // 🏆 beker
                    
                    // === KLEUREN THEMA (elke kleur eigen frequentie) ===
                    'toon_1': { type: 'tone', freq: 261, duration: 0.3, wave: 'sine' },  // 🔴 rood - C
                    'toon_2': { type: 'tone', freq: 294, duration: 0.3, wave: 'sine' },  // 🟠 oranje - D
                    'toon_3': { type: 'tone', freq: 329, duration: 0.3, wave: 'sine' },  // 🟡 geel - E
                    'toon_4': { type: 'tone', freq: 349, duration: 0.3, wave: 'sine' },  // 🟢 groen - F
                    'toon_5': { type: 'tone', freq: 392, duration: 0.3, wave: 'sine' },  // 🔵 blauw - G
                    'toon_6': { type: 'tone', freq: 440, duration: 0.3, wave: 'sine' },  // 🟣 paars - A
                    
                    // === VORMEN THEMA (elke vorm eigen akkoord/patroon) ===
                    'vorm_1': { type: 'tone', freq: 523, duration: 0.25, wave: 'square' },  // 🟥 vierkant
                    'vorm_2': { type: 'chord', frequencies: [523, 659], duration: 0.25 },  // 🔺 driehoek
                    'vorm_3': { type: 'tone', freq: 784, duration: 0.25, wave: 'sine' },  // 🔵 cirkel
                    'vorm_4': { type: 'chord', frequencies: [523, 659, 784], duration: 0.25 },  // 🔶 ruit
                    'vorm_5': { type: 'sequence', notes: [523, 659, 784, 1047], duration: 0.1 },  // 💚 hart
                    
                    // === ALGEMEEN ===
                    'klik': { type: 'click' },  // 🕶️ zonnebril enz
                    
                    // === SUPERMARKT THEMA ===
                    'wiel_geluid': { type: 'tone', freq: 200, duration: 0.3, wave: 'sawtooth' },  // 🛒 winkelwagen
                    'mandje_klik': { type: 'click' },  // 🛍️ winkelmandje
                    'munt_geluid': { type: 'tone', freq: 800, duration: 0.2, wave: 'square' },  // 💰 geld
                    'deur_schuif': { type: 'noise', duration: 0.5, filter: 'lowpass', freq: 400 },  // 🚪 schuifdeuren
                    'brood_knapper': { type: 'noise', duration: 0.2, filter: 'highpass', freq: 1000 },  // 🍞 brood
                    
                    // === WINKEL THEMA ===
                    'stof_geluid': { type: 'noise', duration: 0.3, filter: 'bandpass', freq: 600 },  // 👕 kleding
                    'stap_geluid': { type: 'tone', freq: 150, duration: 0.2, wave: 'triangle' },  // 👟 schoenen
                    'knuffel_geluid': { type: 'tone', freq: 400, duration: 0.4, wave: 'sine' },  // 🧸 speelgoed
                    'tas_klik': { type: 'click' }  // 🛍️ boodschappentas
                },
            
                // 2. JSFXR - 8-bit retro geluiden
                // Elk icoon heeft een UNIEK 8-bit geluid!
                jsfxr: {
                    // === ZEE THEMA ===
                    'plons': [3,,.12,.52,.1,.26,,,,,,,,,,,1,,,],  // 🐠 vis
                    'schaar': [3,.1,.01,.8,,.24,,,,,,,,,.3,.8,,-.4,.1,1,,,],  // 🦀 krab
                    'bubbel': [3,,.05,.8,,.59,,.2,,,,,,,,,.4,,,.1,1,,,],  // 🐙 octopus
                    'walvis_geluid': [0,.5,.15,.1,.7,.2,,.1,,,,,,,,,1,,,],  // 🐳 walvis - lage 8-bit
                    'dolfijn_geluid': [0,.1,.08,.9,.5,.4,,,,,,,,,,,1,,,],  // 🐬 dolfijn - hoge piep
                    'glinstering': [1,,.02,.8,,.57,,,,,,,,,,.4,,,.2,1,,,],  // ⭐ zeesster
                    
                    // === JUNGLE THEMA ===
                    'aap_geluid': [0,.15,.18,.3,.4,.5,,.05,,,,,,,,,1,,,],  // 🐵 aap - uniek patroon
                    'leeuw_brul': [2,.4,.25,.15,.6,.8,,,-.1,,,,,,,,,1,,,],  // 🦁 leeuw - diepe brul
                    'olifant_trompet': [0,.6,.35,.1,.9,.3,,,-.2,,,,,,,,,1,,,],  // 🐘 olifant - trompet
                    'slang_sis': [3,,.18,.7,.25,.85,,,,,,,,,.35,,,,,1,,,],  // 🐍 slang - hoog sis
                    'papegaai_praat': [0,.05,.09,.6,.15,.45,,,,,,,,,,,,,1,,,],  // 🦜 papegaai - vrolijk
                    'hap': [0,,.14,.8,,.25,,,,,,,,,,,,,,,],  // 🍌 banaan
                    
                    // === BOERDERIJ THEMA ===
                    'koe_boe': [0,.35,.22,.12,.45,.55,,.08,,,,,,,,,1,,,],  // 🐮 koe - laag
                    'varken_knor': [0,.25,.13,.15,.35,.65,,.1,,,,,,,,,1,,,],  // 🐷 varken - mid
                    'kip_tok': [0,,.008,.9,.08,.18,,,,,,,,,,,,,,,],  // 🐔 kip - kort hoog
                    'schaap_blaat': [0,.12,.11,.25,.32,.42,,.06,,,,,,,,,1,,,],  // 🐑 schaap
                    'paard_hinnik': [0,.45,.28,.2,.55,.62,,.12,,,,,,,,,1,,,],  // 🐴 paard - herhalend
                    'tractor_motor': [2,,.08,.85,.18,.12,,,,,,,,,.75,,,,,1,,,],  // 🚜 tractor
                    
                    // === RUIMTE THEMA ===
                    'lancering': [2,,.42,.6,.42,.1,,.32,,,,,,.23,,.34,-.1,1,,,],  // 🚀 raket
                    'alien_geluid': [1,,.09,.12,.52,.48,,-.05,,,,,,,,,,,1,,,],  // 👽 alien - weird
                    'space_swoosh': [2,,.48,.38,.28,.15,,.05,,,,,,,,,,,1,,,],  // 🪐 planeet
                    'swoosh': [2,,.75,.45,.35,.25,,.08,,,,,,,,,,,1,,,],  // ☄️ komeet
                    'beep': [0,,.08,.85,.09,.12,,,,,,,,,,,,,,,],  // 🛰️ satelliet - beep
                    
                    // === KERST THEMA ===
                    'kerst_jingle': [0,,.18,.38,.48,.28,,.04,,,,,,,,,1,,,],  // 🎄 kerstboom
                    'kerstman_hohoho': [0,.25,.28,.18,.38,.32,,.06,,,,,,,,,1,,,],  // 🎅 kerstman
                    'rendier_bel': [1,,.04,.75,,.18,,,,,,,,,,,,,.15,1,,,],  // 🦌 rendier - bel
                    'cadeau_uitpak': [3,,.18,.35,.25,.15,,,,,,,,,,,,,,,],  // 🎁 cadeau
                    'kerstbel_ring': [1,,.09,.78,,.22,,,.05,,,,,,,,,,.12,1,,,],  // 🔔 kerstbel
                    'magisch': [1,,.12,.48,.35,.28,,.03,,,,,,,,.25,,,,.18,1,,,],  // ⛄ sneeuwpop
                    
                    // === HERFST THEMA ===
                    'blad_ritsel': [3,,.08,.75,,.12,,,,,,,,,.15,,,,,1,,,],  // 🍁🍂 bladeren
                    'plof': [3,,.25,.35,.18,.08,,,,,,,,,,,,,,,],  // 🎃 pompoen - dof
                    'eekhoorn_piep': [0,,.08,.92,,.18,,,,,,,,,,,,,,1,,,],  // 🐿️ eekhoorn
                    'tik': [0,,.005,.85,,.04,,,,,,,,,,,,,,,],  // 🌰 kastanje - hard
                    
                    // === LENTE THEMA ===
                    'lente_bries': [3,,.25,.45,,.35,,,,,,,,,.18,,,,,1,,,],  // 🌸🌷 bloemen
                    'vlinder_fladder': [0,,.04,.95,,.08,,.02,,,,,,,,,,,,.08,1,,,],  // 🦋 vlinder - licht
                    'groei_geluid': [0,,.18,.28,.48,.38,,.05,,,,,,,,.15,,,,.12,1,,,],  // 🌱 plantje - groei
                    'kuiken_piep': [0,,.04,.92,,.13,,,,,,,,,,,,,,1,,,],  // 🐣 kuiken
                    
                    // === ZOMER THEMA ===
                    'golfslag': [3,,.35,.18,.55,.45,,,,,,,,,,.25,,,,,1,,,],  // 🏖️ strand
                    
                    // === WINTER THEMA ===
                    'winter_wind': [3,,.45,.08,.68,.35,,,,,,,,,.22,,,,,1,,,],  // ❄️ sneeuwvlok
                    'stof_geluid': [3,,.08,.72,,.08,,,,,,,,,.12,,,,,1,,,],  // 🧤🧣 wanten/sjaal
                    'schaats_ijs': [0,,.15,.85,,.12,,-.05,,,,,,,,,,,,.08,1,,,],  // ⛸️ schaats - scherp
                    'bibber': [0,,.04,.78,,.09,,.04,,,,,,,,,,,,.05,1,,,],  // 🥶 koud - trilling
                    'rits': [3,,.04,.82,,.08,,,,,,,,,.15,,,,,1,,,],  // 🧥 jas - rits
                    
                    // === SPORT THEMA ===
                    'schot': [3,,.04,.78,,.15,,,,,,,,,,.25,,,,,1,,,],  // ⚽ voetbal - trap
                    'basketbal_stuit': [0,,.15,.08,.09,.08,,,,,,,,,,,,,,,],  // 🏀 basketbal - stuit
                    'honkbal_slag': [3,,.08,.82,,.12,,,,,,,,,,.35,,,,,1,,,],  // ⚾ honkbal - slag
                    'tennis_slag': [3,,.03,.88,,.08,,,,,,,,,,.15,,,,,1,,,],  // 🎾 tennisbal - kort
                    'applaus': [3,,.42,.08,.72,.25,,,,,,,,,,.45,,,,,1,,,],  // 🏆 beker - applaus
                    
                    // === KLEUREN THEMA (elke kleur unieke 8-bit toon) ===
                    'toon_1': [0,,.08,.35,.45,.08,,,,,,,,,,,,,,,],  // 🔴 rood - C
                    'toon_2': [0,,.12,.35,.45,.15,,,,,,,,,,,,,,,],  // 🟠 oranje - D
                    'toon_3': [0,,.18,.35,.45,.22,,,,,,,,,,,,,,,],  // 🟡 geel - E
                    'toon_4': [0,,.25,.35,.45,.28,,,,,,,,,,,,,,,],  // 🟢 groen - F
                    'toon_5': [0,,.32,.35,.45,.35,,,,,,,,,,,,,,,],  // 🔵 blauw - G
                    'toon_6': [0,,.42,.35,.45,.42,,,,,,,,,,,,,,,],  // 🟣 paars - A
                    
                    // === VORMEN THEMA (elke vorm uniek 8-bit patroon) ===
                    'vorm_1': [0,,.15,.45,.35,.15,,,,,,,,,,,,,,,],  // 🟥 vierkant
                    'vorm_2': [0,,.22,.45,.35,.22,,.05,,,,,,,,,,,,.08,1,,,],  // 🔺 driehoek
                    'vorm_3': [0,,.32,.45,.35,.32,,,,,,,,,,,,,,,],  // 🔵 cirkel
                    'vorm_4': [0,,.42,.45,.35,.42,,.08,,,,,,,,.12,,,,.15,1,,,],  // 🔶 ruit
                    'vorm_5': [0,,.52,.45,.35,.52,,.12,,,,,,,,.18,,,,.22,1,,,],  // 💚 hart
                    
                    // === ALGEMEEN ===
                    'klik': [3,,.008,.82,,.08,,,,,,,,,,,,,,,],  // 🕶️ zonnebril enz
                    'pop': [3,,.25,.35,.15,.08,,,,,,,,,,,,,,,],  // algemene pop
                    
                    // === SUPERMARKT THEMA ===
                    'wiel_geluid': [3,,.1,.3,.2,.1,,,,,,,,,.5,,,.1,1,,,],  // 🛒 winkelwagen
                    'mandje_klik': [3,,.01,.6,,.1,,,,,,,,,.3,,,.1,1,,,],  // 🛍️ winkelmandje
                    'munt_geluid': [3,,.05,.4,,.2,,,,,,,,,.2,,,.1,1,,,],  // 💰 geld
                    'deur_schuif': [3,,.2,.1,.3,.3,,,,,,,,,.4,,,.1,1,,,],  // 🚪 schuifdeuren
                    'brood_knapper': [3,,.15,.5,,.1,,,,,,,,,.3,,,.1,1,,,],  // 🍞 brood
                    
                    // === WINKEL THEMA ===
                    'stof_geluid': [3,,.08,.2,,.15,,,,,,,,,.2,,,.1,1,,,],  // 👕 kleding
                    'stap_geluid': [3,,.1,.4,,.2,,,,,,,,,.3,,,.1,1,,,],  // 👟 schoenen
                    'knuffel_geluid': [3,,.2,.3,,.1,,,,,,,,,.4,,,.1,1,,,],  // 🧸 speelgoed
                    'tas_klik': [3,,.05,.5,,.1,,,,,,,,,.2,,,.1,1,,,]  // 🛍️ boodschappentas
                }
        },
        
        play(soundName) {
            const settings = settingsGetter();
            if (settings.feedbackMode === 'visual' || !soundName) return;
            if (settings.audioMode === 'voiceOnly') return; // Alleen stem, geen geluidseffecten
            
            const engine = settings.audioEngine || 'webaudio';
            
            switch(engine) {
                case 'webaudio':
                    this.playWebAudio(soundName);
                    break;
                case 'jsfxr':
                    this.playJsfxr(soundName);
                    break;
                default:
                    this.playWebAudio(soundName);
            }
        },
        
        playWebAudio(soundName) {
            const soundParams = this.soundMaps.webaudio[soundName];
            if (!soundParams) {
                AudioEngine.playTone(440, 0.1, 'square');
                return;
            }
            
            try {
                switch(soundParams.type) {
                    case 'splash':
                        AudioEngine.playSplash();
                        break;
                    case 'click':
                        AudioEngine.playClick();
                        break;
                    case 'bubble':
                        AudioEngine.playBubble();
                        break;
                    case 'whoosh':
                        AudioEngine.playWhoosh();
                        break;
                    case 'tone':
                        AudioEngine.playTone(soundParams.freq, soundParams.duration, soundParams.wave || 'sine', 0.3, soundParams.vibrato || false);
                        break;
                    case 'animal':
                        AudioEngine.playAnimalSound(soundParams.startFreq, soundParams.endFreq, soundParams.duration, soundParams.wave || 'sawtooth');
                        break;
                    case 'chord':
                        AudioEngine.playChord(soundParams.frequencies, soundParams.duration);
                        break;
                    case 'sequence':
                        AudioEngine.playSequence(soundParams.notes, soundParams.duration);
                        break;
                    default:
                        AudioEngine.playTone(440, 0.1, 'square');
                }
            } catch (error) {
                console.error(`WebAudio error for '${soundName}':`, error);
            }
        },
        
        playJsfxr(soundName) {
            const soundParams = this.soundMaps.jsfxr[soundName];
            if (!soundParams) {
                this.playJsfxrData([0,,.1,.8,,.1]);
                return;
            }
            this.playJsfxrData(soundParams);
        },
        
        playJsfxrData(params) {
            try {
                const soundData = jsfxr(params);
                
                if (!soundData || typeof soundData !== 'string') {
                    console.warn('Invalid jsfxr data, using Web Audio fallback');
                    this.playWebAudio('klik');
                    return;
                }
                
                const audio = new Audio();
                audio.volume = 0.4;
                audio.preload = 'auto';
                
                const playPromise = () => {
                    return audio.play().catch(e => {
                        console.warn('JSFXR playback failed, using Web Audio fallback');
                        this.playWebAudio('klik');
                    });
                };
                
                audio.onerror = () => {
                    // Fallback naar Web Audio bij JSFXR fout
                    this.playWebAudio('klik');
                };
                
                audio.oncanplaythrough = playPromise;
                audio.src = soundData;
                
            } catch (error) {
                console.error('JSFXR generation error, using Web Audio fallback:', error);
                this.playWebAudio('klik');
            }
        }
    };
}

