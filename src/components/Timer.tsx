
import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number; // Duration in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  // Reset timer when question changes (duration or isActive changes)
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, isActive]);
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;
  const isWarning = timeLeft <= 5;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>Time Left</span>
        <span className={`font-bold ${isWarning ? 'text-game-timerWarning animate-pulse-light' : ''}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`timer-bar ${isWarning ? 'warning' : ''}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
