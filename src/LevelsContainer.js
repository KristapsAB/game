// LevelsContainer.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Levels from './Levels';

const LevelsContainer = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLevelCompletion = () => {
    // Your completion logic

    // Navigate to the next level
    setCurrentLevel((prevLevel) => prevLevel + 1);
    navigate(`/levels/${currentLevel + 1}`);
  };

  return (
    <div>
      <Level levelNumber={currentLevel} onComplete={handleLevelCompletion} />
    </div>
  );
};

export default LevelsContainer;
