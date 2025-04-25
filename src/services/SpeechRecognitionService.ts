
class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  private constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  }

  public static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  public startListening(onResult: (text: string) => void, onError?: (error: any) => void): void {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      onResult(text);
    };

    this.recognition.onerror = (event) => {
      if (onError) onError(event);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
    this.isListening = true;
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public isSupported(): boolean {
    return 'webkitSpeechRecognition' in window;
  }
}

export default SpeechRecognitionService;
