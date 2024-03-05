// Levels.js

import React from 'react';
import { Link } from 'react-router-dom';
import './style/styles.css'; // Adjust the file path based on your project structure
import Heart from './image/heart.png';
import Diamond from './image/diamond-side.png';

const Levels = () => {
  const totalLevels = 20;

  return (
    <div className="level-main">
      <div className='level-main-80'>
        {[...Array(totalLevels).keys()].map((index) => (
          <Link key={index + 1} to={`/level/${index + 1}`} className="level-link">
            <div className="level-container">
              <h1>{`Level ${index + 1}`}</h1>
              <p>{(Math.random() * 5 + 1).toFixed(2)} </p>
              {/* Add more level information or components as needed */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Levels;