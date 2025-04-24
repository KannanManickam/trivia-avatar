
import React, { useState, useEffect } from 'react';
import { TriviaQuestion, getRandomQuestions } from '../data/questions';
import QuestionCard from './QuestionCard';
import Avatar from './Avatar';
import TextToSpeechService from '../services/TextToSpeechService';
import { Button } from '@/components/ui/button';

interface GameScreenProps {
  onGameEnd: (score: number, totalQuestions: number) => void;
  questionCount?: number;
  timePerQuestion?: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ 
  onGameEnd, 
  questionCount = 10,
  timePerQuestion = 15
}) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const ttsService = TextToSpeechService.getInstance();

  useEffect(() => {
    // Get random questions on component mount
    const randomQuestions = getRandomQuestions(questionCount);
    setQuestions(randomQuestions);
    setIsLoading(false);
    
    // Introduction
    ttsService.speak("Welcome to Quizzy Avatar Showdown! Get ready to test your knowledge. I'll be your host for today's trivia challenge.");
  }, [questionCount]);

  const handleAnswerSelected = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Move to the next question or end the game
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        handleGameEnd();
      }
    }, 500);
  };

  const handleTimeUp = () => {
    // Move to the next question or end the game
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      handleGameEnd();
    }
  };

  const handleGameEnd = () => {
    onGameEnd(score, questions.length);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-primary"></div>
        <p className="mt-4">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="game-screen-container max-w-3xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="game-stats bg-black bg-opacity-30 p-3 rounded-lg mb-4 md:mb-0 text-center md:text-left">
          <div className="text-sm opacity-80">Question</div>
          <div className="text-xl font-bold">{currentQuestionIndex + 1} of {questions.length}</div>
        </div>
        
        <Avatar className="mx-auto md:mx-0" />
        
        <div className="game-stats bg-black bg-opacity-30 p-3 rounded-lg mt-4 md:mt-0 text-center md:text-right">
          <div className="text-sm opacity-80">Score</div>
          <div className="text-xl font-bold text-game-primary">{score}</div>
        </div>
      </div>
      
      {questions.length > 0 && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          onAnswerSelected={handleAnswerSelected}
          timePerQuestion={timePerQuestion}
          onTimeUp={handleTimeUp}
        />
      )}

      <div className="mt-6 text-center">
        <Button 
          variant="outline" 
          onClick={handleGameEnd}
          className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white"
        >
          Quit Game
        </Button>
      </div>
    </div>
  );
};

export default GameScreen;
