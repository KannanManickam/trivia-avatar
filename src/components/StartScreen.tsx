
import React, { useState } from 'react';
import Avatar from './Avatar';
import TextToSpeechService from '../services/TextToSpeechService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface StartScreenProps {
  onStartGame: (categories: string[]) => void;
}

const CATEGORIES = [
  { id: 'geography', label: 'Geography', icon: 'globe' },
  { id: 'science', label: 'Science', icon: 'star' },
  { id: 'history', label: 'History', icon: 'book' },
  { id: 'arts', label: 'Arts', icon: 'music' },
  { id: 'sports', label: 'Sports', icon: 'sports' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film' },
] as const;

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const tts = TextToSpeechService.getInstance();

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      if (prev.length >= 3) {
        tts.speak("You can only select up to 3 categories");
        return prev;
      }
      return [...prev, category];
    });
  };

  const handleStart = () => {
    if (selectedCategories.length === 0) {
      tts.speak("Please select at least one category to begin");
      return;
    }
    tts.speak("Let's begin the game! Are you ready?");
    setTimeout(() => onStartGame(selectedCategories), 1500);
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-2xl">
        {CATEGORIES.map(({ id, label, icon }) => (
          <div
            key={id}
            className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors cursor-pointer ${
              selectedCategories.includes(id)
                ? 'bg-game-primary/20 border-game-primary'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onClick={() => handleCategoryToggle(id)}
          >
            <Checkbox
              id={id}
              checked={selectedCategories.includes(id)}
              onCheckedChange={() => handleCategoryToggle(id)}
            />
            <label htmlFor={id} className="cursor-pointer flex-1">
              {label}
            </label>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={handleStart}
          className="game-button text-lg px-10 py-4"
          disabled={selectedCategories.length === 0}
        >
          Start Game
        </Button>
        
        <p className="text-xs text-gray-400">
          Select up to 3 categories and press start to begin your trivia challenge
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
