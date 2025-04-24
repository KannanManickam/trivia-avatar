
export class TextToSpeechService {
  private static instance: TextToSpeechService;
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private onSpeakStartCallbacks: (() => void)[] = [];
  private onSpeakEndCallbacks: (() => void)[] = [];
  private isSpeaking: boolean = false;

  private constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    
    // Handle case where voices aren't loaded immediately
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  public static getInstance(): TextToSpeechService {
    if (!TextToSpeechService.instance) {
      TextToSpeechService.instance = new TextToSpeechService();
    }
    return TextToSpeechService.instance;
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    
    // Try to select a good default voice
    let preferredVoice = this.voices.find(voice => 
      voice.name.includes('Google') && voice.name.includes('US') && voice.name.includes('Female')
    );
    
    if (!preferredVoice) {
      preferredVoice = this.voices.find(voice => voice.lang === 'en-US');
    }
    
    this.selectedVoice = preferredVoice || (this.voices.length > 0 ? this.voices[0] : null);
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }

  public speak(text: string, rate = 1, pitch = 1): void {
    if (!this.selectedVoice) {
      console.error("No voice selected for text-to-speech");
      return;
    }

    // Cancel any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.onSpeakStartCallbacks.forEach(callback => callback());
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      this.onSpeakEndCallbacks.forEach(callback => callback());
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    this.synth.cancel();
    this.isSpeaking = false;
    this.onSpeakEndCallbacks.forEach(callback => callback());
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
