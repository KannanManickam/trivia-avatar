
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

  private constructor() {
    this.synth = window.speechSynthesis;
    
    // Chrome requires waiting for the voiceschanged event
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices.bind(this);
    }
    
    // Initial attempt to load voices
    setTimeout(() => {
      this.loadVoices();
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
    
    if (availableVoices.length > 0) {
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
      if (this.pendingSpeech.length > 0) {
        console.log('Processing pending speech requests:', this.pendingSpeech.length);
        this.pendingSpeech.forEach(speech => {
          this.speak(speech.text, speech.rate, speech.pitch);
        });
        this.pendingSpeech = [];
      }
    } else {
      console.warn('No voices available yet, will retry');
      // In some browsers (particularly Chrome), voices might not be available immediately
      setTimeout(() => this.loadVoices(), 500);
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }

  public speak(text: string, rate = 1, pitch = 1): void {
    if (!this.voicesLoaded || !this.selectedVoice) {
      console.log('Voices not loaded yet, queuing speech:', text);
      this.pendingSpeech.push({ text, rate, pitch });
      return;
    }

    // Cancel any current speech
    this.stop();

    console.log(`Speaking with voice: ${this.selectedVoice.name}:`, text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => {
      console.log('Speech started:', text);
      this.isSpeaking = true;
      this.onSpeakStartCallbacks.forEach(callback => callback());
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
      this.isSpeaking = false;
      this.onSpeakEndCallbacks.forEach(callback => callback());
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      this.isSpeaking = false;
      this.onSpeakEndCallbacks.forEach(callback => callback());
    };

    // Fix for Chrome issue where speech might not start
    this.synth.cancel();
    setTimeout(() => {
      this.synth.speak(utterance);
      
      // Sometimes, in Chrome, we need to kick start the speech synthesis
      if (!this.synth.speaking && !this.synth.pending) {
        console.log('Speech synthesis not starting, attempting to restart');
        this.synth.cancel();
        setTimeout(() => this.synth.speak(utterance), 50);
      }
    }, 50);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
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
