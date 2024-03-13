import React from 'react';
import { Link } from 'react-router-dom';
import './style/level.css'; // Import your CSS file
import Clock from './levelIcon/hourglass(1).png';
import Poker from './levelIcon/poker.png';
import Coin from './levelIcon/coin.png';

const Levels = ({ levels }) => {
  return (
    <div className="levels-container">
      <div className="level-grid">
        {levels.map((level, index) => (
          <Link
            key={index}
            to={`/level/${index + 1}`}
            state={{ ...level, numberOfCards: level.cardsCount }}
            className="level-card" // Wrap the entire card
          >
            <div className="level-header">
              <h2>Level {index + 1}</h2>
              <p>
                <img src={Poker} alt="Poker icon" style={{ width: "20px", height: "20px" }} />
                &nbsp; {level.cardsCount}
              </p>
            </div>
            <div className="level-body">
              <p>
                <img
                  src={Clock}
                  alt="Clock icon"
                  style={{ width: "20px", height: "20px", color: "#ffffff" }} // Adjust styles as needed
                />
                &nbsp; {level.gameDuration}
              </p>
              <p>
                <img src={Coin} alt="Coin icon" style={{ width: "20px", height: "20px" }} /> {/* Added coin icon */}
                &nbsp; {level.reward}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Levels;
