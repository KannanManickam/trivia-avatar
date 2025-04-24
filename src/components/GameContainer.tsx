
import React, { useState } from 'react';
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import EndScreen from './EndScreen';

enum GameState {
  START,
  PLAYING,
  END
}

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleStartGame = (categories: string[]) => {
    setSelectedCategories(categories);
    setGameState(GameState.PLAYING);
  };

  const handleGameEnd = (finalScore: number, questionCount: number) => {
    setScore(finalScore);
    setTotalQuestions(questionCount);
    setGameState(GameState.END);
  };

  const handlePlayAgain = () => {
    setGameState(GameState.START);
  };

  return (
    <div className="min-h-screen bg-gradient-game">
      <div className="container mx-auto py-8 min-h-screen">
        {gameState === GameState.START && (
          <StartScreen onStartGame={handleStartGame} />
        )}
        
        {gameState === GameState.PLAYING && (
          <GameScreen 
            onGameEnd={handleGameEnd} 
            categories={selectedCategories}
            timePerQuestion={12}
          />
        )}
        
        {gameState === GameState.END && (
          <EndScreen
            score={score}
            totalQuestions={totalQuestions}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
};

export default GameContainer;
