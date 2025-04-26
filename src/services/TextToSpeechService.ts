export class TextToSpeechService {
  private static instance: TextToSpeechService;
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private onSpeakStartCallbacks: (() => void)[] = [];
  private onSpeakEndCallbacks: (() => void)[] = [];
  private isSpeaking: boolean = false;
  private voicesLoaded: boolean = false;
  private pendingSpeech: { text: string; rate?: number; pitch?: number }[] = [];
  private voiceLoadAttempts: number = 0;
  private maxVoiceLoadAttempts: number = 20; // Increased attempts
  private chromeWorkaroundTimer: number | null = null;
  private resumeContextCheckInterval: number | null = null;

  private constructor() {
    this.synth = window.speechSynthesis;
    
    // Chrome requires waiting for the voiceschanged event
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices.bind(this);
    }
    
    // Initial attempt to load voices
    this.attemptLoadVoices();
    
    // Periodically check if Chrome has paused speech synthesis context
    this.setupChromeSpeechWorkaround();
  }

  private setupChromeSpeechWorkaround(): void {
    // Chrome has a bug where it pauses speech synthesis context after ~15 seconds of inactivity
    // This keeps the speech context active
    this.resumeContextCheckInterval = window.setInterval(() => {
      if (this.synth && !this.isSpeaking) {
        console.log("Keeping speech synthesis context alive");
        this.synth.cancel(); // This activates the speech context without making sound
      }
    }, 10000); // Check every 10 seconds
  }

  private attemptLoadVoices(): void {
    setTimeout(() => {
      this.loadVoices();
      // If voices aren't loaded yet and we haven't exceeded max attempts, try again
      if (!this.voicesLoaded && this.voiceLoadAttempts < this.maxVoiceLoadAttempts) {
        this.voiceLoadAttempts++;
        const delay = this.voiceLoadAttempts * 200; // Increasing delay between attempts
        console.log(`Voice loading attempt ${this.voiceLoadAttempts}, retrying in ${delay}ms`);
        setTimeout(() => this.attemptLoadVoices(), delay);
      }
    }, 100);
  }

  public static getInstance(): TextToSpeechService {
    if (!TextToSpeechService.instance) {
      TextToSpeechService.instance = new TextToSpeechService();
    }
    return TextToSpeechService.instance;
  }

  private loadVoices(): void {
    // Get all available voices
    const availableVoices = this.synth.getVoices();
    
    if (availableVoices && availableVoices.length > 0) {
      this.voices = availableVoices;
      console.log('Available voices loaded:', this.voices.length);
      console.log('Voice examples:', this.voices.slice(0, 3).map(v => ({name: v.name, lang: v.lang})));
      
      // Try to select a good default voice - Chrome voices compatibility
      let preferredVoice = null;
      
      // First try to find a Google US English voice
      preferredVoice = this.voices.find(voice => 
        voice.name.includes('Google') && voice.lang.includes('en-US')
      );
      
      // If not found, try any US English voice
      if (!preferredVoice) {
        preferredVoice = this.voices.find(voice => voice.lang === 'en-US');
      }
      
      // If still not found, try any English voice
      if (!preferredVoice) {
        preferredVoice = this.voices.find(voice => voice.lang.startsWith('en'));
      }
      
      // Fallback to the first voice
      if (!preferredVoice && this.voices.length > 0) {
        preferredVoice = this.voices[0];
      }
      
      this.selectedVoice = preferredVoice;
      console.log('Selected voice:', this.selectedVoice ? 
        { name: this.selectedVoice.name, lang: this.selectedVoice.lang } : 'No voice selected');
      
      this.voicesLoaded = true;
      
      // Process any pending speech requests
      this.processPendingSpeech();
    }
  }

  private processPendingSpeech(): void {
    if (this.pendingSpeech.length > 0) {
      console.log('Processing pending speech requests:', this.pendingSpeech.length);
      
      // Process one speech request at a time to avoid Chrome issues
      const nextSpeech = this.pendingSpeech.shift();
      if (nextSpeech) {
        this.speakImmediate(nextSpeech.text, nextSpeech.rate, nextSpeech.pitch);
      }
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
    console.log('Voice changed to:', voice.name);
  }

  public speak(text: string, rate = 1, pitch = 1): void {
    console.log('Speak requested:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    
    // Force activation of audio context in Chrome
    this.activateAudioContext();
    
    if (!this.voicesLoaded || !this.selectedVoice) {
      console.log('Voices not loaded yet, queuing speech:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
      this.pendingSpeech.push({ text, rate, pitch });
      return;
    }

    // If currently speaking, queue this speech
    if (this.isSpeaking || this.synth.speaking || this.synth.pending) {
      console.log('Currently speaking, queuing next speech');
      this.pendingSpeech.push({ text, rate, pitch });
      return;
    }

    this.speakImmediate(text, rate, pitch);
  }

  // Force activation of audio context for Chrome
  private activateAudioContext(): void {
    try {
      // Create and immediately close an AudioContext to unlock audio in Chrome
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        audioCtx.resume().then(() => {
          console.log("AudioContext activated");
          setTimeout(() => {
            audioCtx.close();
          }, 1000);
        });
      }
    } catch (e) {
      console.error("Failed to activate audio context:", e);
    }
  }

  private speakImmediate(text: string, rate = 1, pitch = 1): void {
    // Cancel any current speech first
    this.synth.cancel();
    
    console.log(`Speaking with voice: ${this.selectedVoice?.name}:`, text.substring(0, 50) + (text.length > 50 ? '...' : ''));

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0; // Ensure maximum volume
    
    utterance.onstart = () => {
      console.log('Speech started:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
      this.isSpeaking = true;
      
      // Clear any existing Chrome workaround timer
      if (this.chromeWorkaroundTimer !== null) {
        clearInterval(this.chromeWorkaroundTimer);
        this.chromeWorkaroundTimer = null;
      }
      
      this.onSpeakStartCallbacks.forEach(callback => callback());
      
      // Chrome bug: speech can stop unexpectedly if utterance is long
      // Set up periodic resume to keep it going
      const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
      if (isChrome && text.length > 100) {
        this.chromeWorkaroundTimer = window.setInterval(() => {
          if (this.synth.paused) {
            console.log("Detected paused speech, resuming...");
            this.synth.resume();
          }
        }, 1000);
      }
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
      this.isSpeaking = false;
      
      // Clear Chrome workaround timer if it exists
      if (this.chromeWorkaroundTimer !== null) {
        clearInterval(this.chromeWorkaroundTimer);
        this.chromeWorkaroundTimer = null;
      }
      
      this.onSpeakEndCallbacks.forEach(callback => callback());
      
      // Process next queued speech item if any
      setTimeout(() => this.processPendingSpeech(), 100);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      this.isSpeaking = false;
      
      // Clear Chrome workaround timer if it exists
      if (this.chromeWorkaroundTimer !== null) {
        clearInterval(this.chromeWorkaroundTimer);
        this.chromeWorkaroundTimer = null;
      }
      
      this.onSpeakEndCallbacks.forEach(callback => callback());
      
      // Try to recover from error by processing next speech
      setTimeout(() => this.processPendingSpeech(), 500);
    };

    // Chrome fix for long utterances getting cut off
    const isLongText = text.length > 200;
    if (isLongText) {
      console.log("Long text detected, applying Chrome workaround");
    }

    // Fix for Chrome issue where speech might not start
    setTimeout(() => {
      try {
        // Chrome requires this pattern in some cases
        this.synth.cancel();
        this.synth.speak(utterance);
        
        // Chrome workaround - check if speech actually started
        setTimeout(() => {
          if (!this.synth.speaking && !this.isSpeaking) {
            console.log('Speech synthesis not starting, attempting restart with alternative method');
            
            // Try an alternative approach
            this.synth.cancel();
            
            // Create a fresh utterance
            const newUtterance = new SpeechSynthesisUtterance(text);
            if (this.selectedVoice) {
              newUtterance.voice = this.selectedVoice;
            }
            newUtterance.rate = rate;
            newUtterance.pitch = pitch;
            newUtterance.volume = 1.0;
            
            // Same event handlers
            newUtterance.onstart = utterance.onstart;
            newUtterance.onend = utterance.onend;
            newUtterance.onerror = utterance.onerror;
            
            // Try speaking again
            this.synth.speak(newUtterance);
            
            // Double-check and force Chrome to speak
            setTimeout(() => {
              if (!this.synth.speaking && !this.isSpeaking) {
                console.log("Still not speaking, trying more aggressive approach for Chrome");
                
                // Try a different voice as last resort
                const differentVoice = this.voices.find(v => v !== this.selectedVoice) || this.voices[0];
                
                const finalUtterance = new SpeechSynthesisUtterance(text);
                finalUtterance.voice = differentVoice;
                finalUtterance.rate = rate;
                finalUtterance.pitch = pitch;
                finalUtterance.volume = 1.0;
                finalUtterance.onstart = utterance.onstart;
                finalUtterance.onend = utterance.onend;
                finalUtterance.onerror = utterance.onerror;
                
                // Play a silent sound first to wake up audio context
                const silentUtterance = new SpeechSynthesisUtterance(" ");
                this.synth.speak(silentUtterance);
                
                // Then speak the actual text
                setTimeout(() => {
                  this.synth.speak(finalUtterance);
                }, 100);
              }
            }, 500);
          }
        }, 250);
      } catch (error) {
        console.error('Exception during speech synthesis:', error);
        this.isSpeaking = false;
      }
    }, 50);
  }

  public stop(): void {
    if (this.synth) {
      console.log("Stopping all speech");
      this.synth.cancel();
      this.isSpeaking = false;
      this.pendingSpeech = []; // Clear any pending speech
      
      // Clear Chrome workaround timer if it exists
      if (this.chromeWorkaroundTimer !== null) {
        clearInterval(this.chromeWorkaroundTimer);
        this.chromeWorkaroundTimer = null;
      }
      
      this.onSpeakEndCallbacks.forEach(callback => callback());
    }
  }

  public onSpeakStart(callback: () => void): void {
    this.onSpeakStartCallbacks.push(callback);
  }

  public onSpeakEnd(callback: () => void): void {
    this.onSpeakEndCallbacks.push(callback);
  }

  public removeSpeakStartCallback(callback: () => void): void {
    this.onSpeakStartCallbacks = this.onSpeakStartCallbacks.filter(cb => cb !== callback);
  }

  public removeSpeakEndCallback(callback: () => void): void {
    this.onSpeakEndCallbacks = this.onSpeakEndCallbacks.filter(cb => cb !== callback);
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export default TextToSpeechService;
