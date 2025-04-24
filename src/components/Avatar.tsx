
import React, { useEffect, useState } from 'react';
import TextToSpeechService from '../services/TextToSpeechService';

interface AvatarProps {
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ className = "" }) => {
  const [isTalking, setIsTalking] = useState(false);
  const ttsService = TextToSpeechService.getInstance();
  
  useEffect(() => {
    const handleSpeakStart = () => setIsTalking(true);
    const handleSpeakEnd = () => setIsTalking(false);
    
    ttsService.onSpeakStart(handleSpeakStart);
    ttsService.onSpeakEnd(handleSpeakEnd);
    
    return () => {
      ttsService.removeSpeakStartCallback(handleSpeakStart);
      ttsService.removeSpeakEndCallback(handleSpeakEnd);
    };
  }, []);

  return (
    <div className={`avatar-container ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-700 to-blue-500"></div>
      
      {/* Face Elements */}
      <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white rounded-full flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-black rounded-full"></div>
      </div>
      
      <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-white rounded-full flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-black rounded-full"></div>
      </div>
      
      <div className={`avatar-mouth ${isTalking ? 'talking' : ''}`}></div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-20"></div>
    </div>
  );
};

export default Avatar;
