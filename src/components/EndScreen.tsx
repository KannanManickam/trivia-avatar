
import React, { useEffect } from 'react';
import Avatar from './Avatar';
import TextToSpeechService from '../services/TextToSpeechService';
import { Button } from '@/components/ui/button';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, totalQuestions, onPlayAgain }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    const tts = TextToSpeechService.getInstance();
    
    let message = "";
    
    if (percentage >= 80) {
      message = `Amazing job! You got ${score} out of ${totalQuestions} questions correct. That's ${percentage}%! You're a trivia master!`;
    } else if (percentage >= 60) {
      message = `Well done! You scored ${score} out of ${totalQuestions}, which is ${percentage}%. Pretty good!`;
    } else {
      message = `Game over! You got ${score} out of ${totalQuestions} questions right. That's ${percentage}%. Better luck next time!`;
    }
    
    tts.speak(message);
  }, [score, totalQuestions, percentage]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Game Over!</h1>
      
      <div className="my-6">
        <Avatar />
      </div>
      
      <div className="game-card max-w-md w-full mb-8">
        <h2 className="text-xl mb-4">Your Results</h2>
        
        <div className="text-5xl font-bold mb-2 text-game-primary">
          {score} / {totalQuestions}
        </div>
        
        <div className="mb-4">
          <div className="text-xl">{percentage}%</div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 my-2">
            <div 
              className={`h-2.5 rounded-full ${
                percentage >= 80 ? 'bg-game-correct' : 
                percentage >= 60 ? 'bg-game-primary' : 'bg-game-incorrect'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6">
          {percentage >= 80 ? 'Incredible! You\'re a trivia master!' :
           percentage >= 60 ? 'Well done! You know your stuff.' :
           'Not bad! Keep playing to improve your score.'}
        </p>
      </div>
      
      <Button 
        onClick={onPlayAgain}
        className="game-button"
      >
        Play Again
      </Button>
    </div>
  );
};

export default EndScreen;
