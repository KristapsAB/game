// BackgroundSelector.jsx

import React, { useState } from 'react';

const BackgroundSelector = ({ onSelectBackground }) => {
  const [selectedBackground, setSelectedBackground] = useState('');

  const backgroundOptions = [
    'background1.jpg',
    'background2.jpg',
    'background3.jpg',
    // Add more background options as needed
  ];

  const handleBackgroundClick = (background) => {
    setSelectedBackground(background);
    onSelectBackground(background);
  };

  return (
    <div className="background-selector">
      <h3>Choose Background</h3>
      <div className="background-options">
        {backgroundOptions.map((background, index) => (
          <div
            key={index}
            className={`background-option ${background === selectedBackground ? 'selected' : ''}`}
            onClick={() => handleBackgroundClick(background)}
          >
            <img src={background} alt={`Background ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
