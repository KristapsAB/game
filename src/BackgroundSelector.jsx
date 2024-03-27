import React from 'react';

const BackgroundSelector = ({ onSelectBackground, wallpapers }) => {
  const handleChange = (event) => {
    const selectedBackground = event.target.value;
    onSelectBackground(selectedBackground);
  };

  return (
    <div className="background-selector">
      <h3>Choose Background</h3>
      <select onChange={handleChange}>
        {wallpapers.map((wallpaper, index) => (
          <option key={index} value={wallpaper}>
            {`Background ${index + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BackgroundSelector;
