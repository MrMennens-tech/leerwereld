/**
 * LeerWereld - Audio Engines
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

// --- WEB AUDIO API ENGINE (Synthetische geluiden) ---
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
    
    playTone(frequency, duration = 0.2, type = 'sine', volume = 0.3) {
        if (!this.context) return;
        
        try {
            // Resume context if needed (voor autoplay policy)
            if (this.context.state === 'suspended') {
                this.context.resume();
            }
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
            oscillator.type = type;
            
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
            // 1. Web Audio API - Synthetische geluiden
            webaudio: {
                'plons': { type: 'tone', freq: 220, duration: 0.3, wave: 'sine' },
                'schaar': { type: 'sequence', notes: [440, 880], duration: 0.1 },
                'bubbel': { type: 'chord', frequencies: [261, 329, 392], duration: 0.4 },
                'walvis_geluid': { type: 'tone', freq: 80, duration: 0.8, wave: 'sine' },
                'dolfijn_geluid': { type: 'sequence', notes: [523, 659, 784], duration: 0.1 },
                'glinstering': { type: 'sequence', notes: [1047, 1319, 1568, 1760], duration: 0.08 },
                'aap_geluid': { type: 'sequence', notes: [330, 262, 330], duration: 0.15 },
                'leeuw_brul': { type: 'tone', freq: 110, duration: 0.6, wave: 'sawtooth' },
                'olifant_trompet': { type: 'tone', freq: 165, duration: 0.5, wave: 'triangle' },
                'slang_sis': { type: 'tone', freq: 4000, duration: 0.3, wave: 'square' },
                'papegaai_praat': { type: 'sequence', notes: [523, 440, 659], duration: 0.1 },
                'hap': { type: 'tone', freq: 880, duration: 0.1, wave: 'square' },
                'koe_boe': { type: 'tone', freq: 147, duration: 0.5, wave: 'sawtooth' },
                'varken_knor': { type: 'tone', freq: 196, duration: 0.3, wave: 'square' },
                'kip_tok': { type: 'tone', freq: 1760, duration: 0.05, wave: 'square' },
                'schaap_blaat': { type: 'tone', freq: 220, duration: 0.4, wave: 'triangle' },
                'paard_hinnik': { type: 'sequence', notes: [330, 247, 330, 247], duration: 0.12 },
                'tractor_motor': { type: 'tone', freq: 98, duration: 0.4, wave: 'sawtooth' },
                'lancering': { type: 'sequence', notes: [110, 165, 220, 330, 440], duration: 0.2 },
                'alien_geluid': { type: 'sequence', notes: [880, 440, 1760, 220], duration: 0.1 },
                'space_swoosh': { type: 'tone', freq: 1320, duration: 0.4, wave: 'sine' },
                'swoosh': { type: 'tone', freq: 660, duration: 0.3, wave: 'triangle' },
                'beep': { type: 'tone', freq: 880, duration: 0.1, wave: 'square' },
                'toon_1': { type: 'tone', freq: 261, duration: 0.3, wave: 'sine' },
                'toon_2': { type: 'tone', freq: 294, duration: 0.3, wave: 'sine' },
                'toon_3': { type: 'tone', freq: 329, duration: 0.3, wave: 'sine' },
                'toon_4': { type: 'tone', freq: 349, duration: 0.3, wave: 'sine' },
                'toon_5': { type: 'tone', freq: 392, duration: 0.3, wave: 'sine' },
                'toon_6': { type: 'tone', freq: 440, duration: 0.3, wave: 'sine' },
                'klik': { type: 'tone', freq: 2640, duration: 0.05, wave: 'square' }
            },
            
            // 2. JSFXR - 8-bit retro geluiden
            jsfxr: {
                'plons': [3,,.12,.52,.1,.26,,,,,,,,,,,1,,,],
                'schaar': [3,.1,.01,.8,,.24,,,,,,,,,.3,.8,,-.4,.1,1,,,],
                'bubbel': [3,,.05,.8,,.59,,.2,,,,,,,,,.4,,,.1,1,,,],
                'walvis_geluid': [0,.3,.32,.2,.5,.7,,,,,,,,,,,1,,,],
                'dolfijn_geluid': [0,.1,.4,.4,.5,.8,,,,,,,,,,,1,,,],
                'glinstering': [1,,.02,.8,,.57,,,,,,,,,,.4,,,.2,1,,,],
                'aap_geluid': [0,.1,.2,.3,.4,.5],
                'leeuw_brul': [2,0.3,0.3,0.2,0.5,0.7,,,,,,,,,,,1,,,],
                'olifant_trompet': [0,.5,.4,.1,.8,.4,,,-.1],
                'slang_sis': [2,0,.2,0.7,0.3,0.8,,,,,,,,0.3,,,,,1,,,],
                'papegaai_praat': [0,0,.1,.6,.2,.4,,,,,,,,,,,,,,1,,,],
                'hap': [0,,.14,.8,,.25],
                'koe_boe': [0,.3,.2,.1,.4,.5],
                'varken_knor': [0,.2,.1,.1,.3,.6],
                'kip_tok': [0,0,.01,.8,.1,.2],
                'schaap_blaat': [0,.1,.1,.2,.3,.4],
                'paard_hinnik': [0,.4,.3,.2,.5,.6],
                'tractor_motor': [2,0,.1,0.8,0.2,0.1,,,,,,,,0.8,,,,,1,,,],
                'lancering': [2,,.42,.6,.42,.1,,.32,,,,,,.23,,.34,-.1,1,,,],
                'alien_geluid': [1,,.1,.1,.5,.5],
                'space_swoosh': [2,,.5,.4,.3,.1],
                'swoosh': [2,,.8,.5,.4,.3],
                'beep': [0,0,.1,.8,.1,.1],
                'toon_1': [0,,.1,.4,.5,.1],
                'toon_2': [0,,.2,.4,.5,.2],
                'toon_3': [0,,.3,.4,.5,.3],
                'toon_4': [0,,.4,.4,.5,.4],
                'toon_5': [0,,.5,.4,.5,.5],
                'toon_6': [0,,.6,.4,.5,.6],
                'klik': [3,,.01,.8,,.1],
                'pop': [3,,.3,.4,.2,.1]
            },
            
            // 3. Sample geluiden - Echte audio bestanden (Mixkit royalty-vrij)
            samples: {
                'plons': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
                'schaar': 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
                'bubbel': 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3',
                'klik': 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3',
                'pop': 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
                'beep': 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
                'swoosh': 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
                'lancering': 'https://assets.mixkit.co/active_storage/sfx/1671/1671-preview.mp3',
                'applaus': 'https://assets.mixkit.co/active_storage/sfx/2398/2398-preview.mp3',
                fallback: 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3'
            }
        },
        
        play(soundName) {
            const settings = settingsGetter();
            if (settings.feedbackMode === 'visual' || !soundName) return;
            
            const engine = settings.audioEngine || 'webaudio';
            
            switch(engine) {
                case 'webaudio':
                    this.playWebAudio(soundName);
                    break;
                case 'jsfxr':
                    this.playJsfxr(soundName);
                    break;
                case 'samples':
                    this.playSample(soundName);
                    break;
                default:
                    console.warn(`Onbekende audio engine: ${engine}`);
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
                    case 'tone':
                        AudioEngine.playTone(soundParams.freq, soundParams.duration, soundParams.wave || 'sine');
                        break;
                    case 'chord':
                        AudioEngine.playChord(soundParams.frequencies, soundParams.duration);
                        break;
                    case 'sequence':
                        AudioEngine.playSequence(soundParams.notes, soundParams.duration);
                        break;
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
                    console.warn('Invalid jsfxr data generated');
                    return;
                }
                
                const audio = new Audio();
                audio.volume = 0.4;
                audio.preload = 'auto';
                
                const playPromise = () => {
                    return audio.play().catch(e => {
                        console.warn('JSFXR playback failed:', e);
                    });
                };
                
                if (audio.readyState >= 2) {
                    playPromise();
                } else {
                    audio.oncanplaythrough = playPromise;
                    audio.onerror = () => console.warn('JSFXR audio error');
                }
                
                audio.src = soundData;
                
            } catch (error) {
                console.error('JSFXR generation error:', error);
            }
        },
        
        playSample(soundName) {
            let soundUrl = this.soundMaps.samples[soundName];
            
            if (!soundUrl) {
                soundUrl = this.soundMaps.samples.fallback;
                console.warn(`Sample '${soundName}' niet gevonden, gebruik fallback geluid`);
            }
            
            try {
                const audio = new Audio();
                audio.volume = 0.4;
                audio.preload = 'none';
                
                let timeoutId = setTimeout(() => {
                    console.warn(`Sample loading timeout for '${soundName}', using Web Audio fallback`);
                    this.playWebAudio(soundName);
                }, 2000);
                
                audio.oncanplaythrough = () => {
                    clearTimeout(timeoutId);
                    audio.play().catch(e => {
                        console.warn(`Sample playback failed for '${soundName}':`, e);
                        this.playWebAudio(soundName);
                    });
                };
                
                audio.onerror = () => {
                    clearTimeout(timeoutId);
                    console.warn(`Sample loading failed for '${soundName}', using Web Audio fallback`);
                    this.playWebAudio(soundName);
                };
                
                audio.onended = () => {
                    audio.src = '';
                };
                
                audio.src = soundUrl;
                audio.load();
                
            } catch (error) {
                console.error(`Sample error for '${soundName}':`, error);
                this.playWebAudio(soundName);
            }
        }
    };
}

