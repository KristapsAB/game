import React, { createContext, useContext, useState, useEffect } from 'react';

const BackgroundContext = createContext();

export const BackgroundProvider = ({ children }) => {
  const storedBackground = localStorage.getItem('selectedBackground');
  const [background, setBackground] = useState(storedBackground || 'wallpapers/default.jpg');
  const [textColor, setTextColor] = useState('#000000'); // Default text color
  const [inputStyle, setInputStyle] = useState({ border: '1px solid #000000' }); // Default input style

  const availableBackgrounds = [
    'wallpapers/wallpaper1.jpg',
    'wallpapers/wallpaper2.jpg',
    'wallpapers/wallpaper3.jpg',
  ];

  const changeBackground = (newBackground) => {
    setBackground(newBackground);
    localStorage.setItem('selectedBackground', newBackground);
    // Add logic here to set textColor and inputStyle based on the selected background
    // For example, you can check if newBackground is 'wallpapers/wallpaper1.jpg' and update accordingly
    if (newBackground === 'wallpapers/wallpaper1.jpg') {
      setTextColor('#FFFFFF'); // Set text color to white
      setInputStyle({ border: '1px solid #FFFFFF' }); // Set input border color to white
    } else {
      setTextColor('#000000'); // Reset text color
      setInputStyle({ border: '1px solid #000000' }); // Reset input border color
    }
  };

  const applyBackgroundStyle = (newBackground) => {
    document.body.style.backgroundImage = `url(${newBackground})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  };

  // Additional useEffect for dynamic body background update
  useEffect(() => {
    applyBackgroundStyle(background);
  }, [background]);

  return (
    <BackgroundContext.Provider value={{ background, availableBackgrounds, changeBackground, textColor, inputStyle }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  return useContext(BackgroundContext);
};
