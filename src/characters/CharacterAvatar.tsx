import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CharacterAvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAnimated?: boolean;
  emotion?: 'happy' | 'excited' | 'thinking' | 'neutral' | 'celebrating';
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  name,
  color,
  size = 'md',
  isAnimated = true,
  emotion = 'happy',
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Auto-blink effect
  useEffect(() => {
    if (!isAnimated) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [isAnimated]);

  const getEmotionAnimation = () => {
    switch (emotion) {
      case 'excited':
        return {
          y: [0, -10, 0],
          transition: { repeat: Infinity, duration: 0.5 },
        };
      case 'celebrating':
        return {
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.1, 1],
          transition: { duration: 0.5 },
        };
      case 'thinking':
        return {
          rotate: [0, 5, 0, -5, 0],
          transition: { repeat: Infinity, duration: 2 },
        };
      default:
        return {
          y: [0, -3, 0],
          transition: { repeat: Infinity, duration: 2 },
        };
    }
  };

  return (
    <motion.div
      className={`${sizeMap[size]} relative`}
      animate={isAnimated ? getEmotionAnimation() : {}}
    >
      {/* Character Body */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      >
        {/* Head */}
        <circle cx="50" cy="45" r="35" fill={color} />
        
        {/* Ears */}
        <ellipse cx="20" cy="35" rx="8" ry="12" fill={color} />
        <ellipse cx="80" cy="35" rx="8" ry="12" fill={color} />
        
        {/* Inner ears */}
        <ellipse cx="20" cy="35" rx="4" ry="7" fill={`${color}dd`} />
        <ellipse cx="80" cy="35" rx="4" ry="7" fill={`${color}dd`} />
        
        {/* Eyes */}
        {!isBlinking ? (
          <>
            <circle cx="38" cy="42" r="6" fill="white" />
            <circle cx="62" cy="42" r="6" fill="white" />
            <circle cx="38" cy="42" r="3" fill="#1f2937" />
            <circle cx="62" cy="42" r="3" fill="#1f2937" />
            {/* Shine in eyes */}
            <circle cx="40" cy="40" r="1.5" fill="white" />
            <circle cx="64" cy="40" r="1.5" fill="white" />
          </>
        ) : (
          <>
            <line x1="32" y1="42" x2="44" y2="42" stroke="#1f2937" strokeWidth="2" />
            <line x1="56" y1="42" x2="68" y2="42" stroke="#1f2937" strokeWidth="2" />
          </>
        )}
        
        {/* Nose */}
        <ellipse cx="50" cy="52" rx="4" ry="3" fill="#1f2937" />
        
        {/* Mouth */}
        <path
          d={emotion === 'happy' || emotion === 'excited' || emotion === 'celebrating' 
            ? 'M 40 58 Q 50 65 60 58' 
            : 'M 43 60 Q 50 58 57 60'}
          stroke="#1f2937"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Cheeks */}
        <circle cx="28" cy="50" r="5" fill="#ffb6c1" opacity="0.6" />
        <circle cx="72" cy="50" r="5" fill="#ffb6c1" opacity="0.6" />
        
        {/* Body */}
        <ellipse cx="50" cy="85" rx="25" ry="15" fill={color} />
        
        {/* Arms */}
        <ellipse cx="25" cy="80" rx="8" ry="12" fill={color} />
        <ellipse cx="75" cy="80" rx="8" ry="12" fill={color} />
        
        {/* Hands */}
        <circle cx="20" cy="88" r="5" fill={`${color}cc`} />
        <circle cx="80" cy="88" r="5" fill={`${color}cc`} />
      </svg>
      
      {/* Name tag */}
      {size !== 'sm' && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full shadow-md">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{name}</span>
        </div>
      )}
    </motion.div>
  );
};

export default CharacterAvatar;
