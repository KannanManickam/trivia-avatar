
class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private restartTimeout: number | null = null;

  private constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
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
      console.log('Speech recognition already active, stopping before restart');
      this.stopListening();
      
      // Clear any existing restart timeout
      if (this.restartTimeout !== null) {
        clearTimeout(this.restartTimeout);
      }
      
      // Add a small delay before starting again to avoid "already started" errors
      this.restartTimeout = window.setTimeout(() => {
        this.startListeningInternal(onResult, onError);
      }, 100);
      return;
    }

    this.startListeningInternal(onResult, onError);
  }
  
  private startListeningInternal(onResult: (text: string) => void, onError?: (error: any) => void): void {
    if (!this.recognition) return;
    
    try {
      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        console.log('Speech recognized:', text);
        onResult(text);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        if (onError) onError(event);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
      console.log('Speech recognition started');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.isListening = false;
      if (onError) onError(error);
      
      // Try to reset recognition object on critical errors
      if (error instanceof DOMException && error.name === 'InvalidStateError') {
        console.log('Attempting to recover from InvalidStateError');
        this.recognition.onend = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        
        // Recreate the recognition object after a short delay
        setTimeout(() => {
          try {
            if ('webkitSpeechRecognition' in window) {
              this.recognition = new (window as any).webkitSpeechRecognition();
              this.recognition.continuous = false;
              this.recognition.interimResults = false;
              this.recognition.lang = 'en-US';
              console.log('Speech recognition object recreated');
            }
          } catch (e) {
            console.error('Failed to recreate speech recognition:', e);
          }
        }, 500);
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        console.log('Speech recognition stopped');
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
      this.isListening = false;
    }
  }

  public isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
}

export default SpeechRecognitionService;
