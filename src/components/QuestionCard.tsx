
import React, { useEffect, useState } from 'react';
import { TriviaQuestion } from '../data/questions';
import TextToSpeechService from '../services/TextToSpeechService';
import Timer from './Timer';

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
  const ttsService = TextToSpeechService.getInstance();

  useEffect(() => {
    setSelectedOption(null);
    setRevealAnswer(false);
    setHasAnswered(false);
    
    // Read the question with TTS
    const questionText = `${question.question}. Options: ${question.options.join(", ")}`;
    ttsService.speak(questionText);
    
    return () => {
      ttsService.stop();
    };
  }, [question]);

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
