import React, { useEffect, useState } from 'react';
import { TriviaQuestion } from '../data/questions';
import TextToSpeechService from '../services/TextToSpeechService';
import SpeechRecognitionService from '../services/SpeechRecognitionService';
import Timer from './Timer';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface QuestionCardProps {
  question: TriviaQuestion;
  onAnswerSelected: (isCorrect: boolean) => void;
  timePerQuestion: number;
  onTimeUp: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswerSelected,
  timePerQuestion,
  onTimeUp
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const ttsService = TextToSpeechService.getInstance();
  const speechRecognition = SpeechRecognitionService.getInstance();

  useEffect(() => {
    setSelectedOption(null);
    setRevealAnswer(false);
    setHasAnswered(false);
    
    // Read the question with TTS
    const questionText = `${question.question}. Options: ${question.options.map((option, index) => 
      `Option ${String.fromCharCode(65 + index)}: ${option}`
    ).join(", ")}. Please say A, B, C, or D to answer.`;
    ttsService.speak(questionText);

    // Start listening immediately
    startVoiceRecognition();

    return () => {
      speechRecognition.stopListening();
    };
  }, [question]);

  const startVoiceRecognition = () => {
    if (!speechRecognition.isSupported() || hasAnswered) return;

    speechRecognition.startListening(
      (text) => {
        console.log('User answer:', text); // Debug log
        
        const optionMap: { [key: string]: number } = {
          'a': 0, 'b': 1, 'c': 2, 'd': 3,
          'option a': 0, 'option b': 1, 'option c': 2, 'option d': 3
        };

        const selectedIndex = optionMap[text.toLowerCase()];
        if (selectedIndex !== undefined && selectedIndex < question.options.length) {
          handleOptionClick(selectedIndex);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        // Restart listening after error
        if (!hasAnswered) {
          startVoiceRecognition();
        }
      }
    );
  };

  const handleOptionClick = (index: number) => {
    if (hasAnswered) return;
    
    setSelectedOption(index);
    setRevealAnswer(true);
    setHasAnswered(true);
    
    const isCorrect = index === question.correctAnswer;
    
    setTimeout(() => {
      if (isCorrect) {
        ttsService.speak("Correct! Great job!");
      } else {
        ttsService.speak(`Incorrect. The correct answer is ${question.options[question.correctAnswer]}.`);
      }
      
      setTimeout(() => {
        onAnswerSelected(isCorrect);
      }, 2000);
    }, 500);
  };

  const handleTimeUp = () => {
    setRevealAnswer(true);
    setHasAnswered(true);
    ttsService.speak(`Time's up! The correct answer is ${question.options[question.correctAnswer]}.`);
    
    setTimeout(() => {
      onTimeUp();
    }, 2500);
  };

  return (
    <div className="question-container animate-slide-in">
      <h3 className="text-xl md:text-2xl font-bold mb-6">{question.question}</h3>
      
      <Timer 
        duration={timePerQuestion} 
        onTimeUp={handleTimeUp} 
        isActive={!hasAnswered} 
      />
      
      <div className="mt-6">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctAnswer;
          const isSelected = selectedOption === index;
          
          let optionClass = "option-button bg-game-accent";
          
          if (revealAnswer) {
            if (isCorrect) {
              optionClass = "option-button correct";
            } else if (isSelected) {
              optionClass = "option-button incorrect";
            }
          } else if (isSelected) {
            optionClass = "option-button selected bg-game-primary";
          }
          
          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => handleOptionClick(index)}
              disabled={hasAnswered}
            >
              <span className="mr-3 text-lg font-bold">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
