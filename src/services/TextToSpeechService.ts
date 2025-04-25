
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
  private maxVoiceLoadAttempts: number = 10;

  private constructor() {
    this.synth = window.speechSynthesis;
    
    // Chrome requires waiting for the voiceschanged event
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices.bind(this);
    }
    
    // Initial attempt to load voices
    this.attemptLoadVoices();
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
      
      // Try to select a good default voice
      // First try to find a Google US English female voice
      let preferredVoice = this.voices.find(voice => 
        voice.name.includes('Google') && voice.name.includes('US') && voice.name.includes('Female')
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
  }

  public speak(text: string, rate = 1, pitch = 1): void {
    console.log('Speak requested:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    
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
      this.onSpeakStartCallbacks.forEach(callback => callback());
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
      this.isSpeaking = false;
      this.onSpeakEndCallbacks.forEach(callback => callback());
      
      // Process next queued speech item if any
      setTimeout(() => this.processPendingSpeech(), 100);
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      this.isSpeaking = false;
      this.onSpeakEndCallbacks.forEach(callback => callback());
      
      // Try to recover from error by processing next speech
      setTimeout(() => this.processPendingSpeech(), 500);
    };

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
      this.synth.cancel();
      this.isSpeaking = false;
      this.pendingSpeech = []; // Clear any pending speech
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
