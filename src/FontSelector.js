// FontSelector.js

import React from 'react';

const FontSelector = ({ selectedFont, onFontChange }) => {
  const fontOptions = [
    'Arial, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Georgia, serif',
    'Verdana, sans-serif',
  ];

  return (
    <div>
      <label htmlFor="fontSelect">Choose a font:</label>
      <select id="fontSelect" value={selectedFont} onChange={(e) => onFontChange(e.target.value)}>
        {fontOptions.map((font, index) => (
          <option key={index} value={font}>
            {font.split(',')[0]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;
