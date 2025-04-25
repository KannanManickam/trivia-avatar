
import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import TextToSpeechService from '../services/TextToSpeechService';
import SpeechRecognitionService from '../services/SpeechRecognitionService';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { triviaQuestions } from '../data/questions';
import { Mic, MicOff } from 'lucide-react';

interface StartScreenProps {
  onStartGame: (categories: string[]) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{id: string, label: string}[]>([]);
  const tts = TextToSpeechService.getInstance();
  const speechRecognition = SpeechRecognitionService.getInstance();

  useEffect(() => {
    const categories = Array.from(new Set(triviaQuestions.map(q => q.category)))
      .map(category => ({
        id: category.toLowerCase(),
        label: category
      }));
    setAvailableCategories(categories);

    // Initial greeting
    tts.speak("Welcome to Quizzy Avatar Showdown! You can select up to 3 categories. Say the category name to select it. Say 'start game' when you're ready.");
  }, []);

  const handleVoiceInput = () => {
    if (!speechRecognition.isSupported()) {
      tts.speak("Sorry, speech recognition is not supported in your browser.");
      return;
    }

    setIsListening(true);
    speechRecognition.startListening(
      (text) => {
        if (text.includes('start game')) {
          if (selectedCategories.length === 0) {
            tts.speak("Please select at least one category before starting the game.");
          } else {
            handleStart();
          }
        } else {
          const matchedCategory = availableCategories.find(
            cat => text.includes(cat.id)
          );

          if (matchedCategory) {
            handleCategoryToggle(matchedCategory.id);
          } else {
            tts.speak("I didn't catch that. Please try again with a valid category name.");
          }
        }
        setIsListening(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      }
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        tts.speak(`Removed ${category}`);
        return prev.filter(c => c !== category);
      }
      if (prev.length >= 3) {
        tts.speak("You can only select up to 3 categories");
        return prev;
      }
      tts.speak(`Selected ${category}`);
      return [...prev, category];
    });
  };

  const handleStart = () => {
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
        {availableCategories.map(({ id, label }) => (
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
          onClick={handleVoiceInput}
          className="game-button text-lg px-10 py-4 mr-4"
          disabled={!speechRecognition.isSupported()}
        >
          {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
          {isListening ? 'Listening...' : 'Speak'}
        </Button>

        <Button 
          onClick={handleStart}
          className="game-button text-lg px-10 py-4"
          disabled={selectedCategories.length === 0}
        >
          Start Game
        </Button>
        
        <p className="text-xs text-gray-400">
          Select up to 3 categories by voice or click, then say "start game" or press the button
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
