// ChangeBackground.js

import React, { useState } from 'react';
import { useBackground } from './BackgroundContext';

const ChangeBackground = () => {
  const { setBackground } = useBackground();
  const [newImage, setNewImage] = useState('');

  const handleChangeBackground = () => {
    setBackground(newImage);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter new background image URL"
        value={newImage}
        onChange={(e) => setNewImage(e.target.value)}
      />
      <button onClick={handleChangeBackground}>Change Background</button>
    </div>
  );
};

export default ChangeBackground;
