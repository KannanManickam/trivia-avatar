
import React from 'react';
import Avatar from './Avatar';
import TextToSpeechService from '../services/TextToSpeechService';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onStartGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const handleStart = () => {
    // Ensure the TTS service is initialized
    const tts = TextToSpeechService.getInstance();
    tts.speak("Let's begin the game! Are you ready?");
    
    setTimeout(onStartGame, 6000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-glow">
        <span className="text-game-primary">Quizzy</span> Avatar 
        <span className="text-game-primary"> Showdown</span>
      </h1>
      <p className="text-lg mb-8 max-w-md text-gray-300">
        Test your knowledge in this fast-paced trivia game with your friendly avatar host!
      </p>
      
      <div className="mb-8">
        <Avatar className="animate-bounce-small" />
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={handleStart}
          className="game-button text-lg px-10 py-4"
        >
          Start Game
        </Button>
        
        <p className="text-xs text-gray-400">
          Press start to enable audio and begin your trivia challenge
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
