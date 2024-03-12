import React from 'react';
import { Link } from 'react-router-dom';
import './style/level.css'; // Import your CSS file

const Levels = ({ levels }) => {
  return (
    <div className="levels-container">
   
      <div className="level-grid">
        {levels.map((level, index) => (
          <div className="level-card" key={index}>
            <div className="level-header">
              <h2>Level {index + 1}</h2>
              <p>Cards: {level.cardsCount}</p>
            </div>
            <div className="level-body">
              <p>Duration: {level.gameDuration} seconds</p>
              <p>Reward: {level.reward} coins</p>
            </div>
            <Link
              to={`/level/${index + 1}`}
              state={{ ...level, numberOfCards: level.cardsCount }}
            >
              <button>Play Level {index + 1}</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Levels;
