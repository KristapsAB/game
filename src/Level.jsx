import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style/level.css'; // Import your CSS file
import Clock from './levelIcon/hourglass(1).png';
import Poker from './levelIcon/poker.png';
import Coin from './levelIcon/diamond.png';
import ScoreIcon from './levelIcon/high-score.png'; // Import the score icon image

const Levels = ({ levels }) => {
  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    // Fetch best scores for the user when the component mounts
    const fetchBestScores = async () => {
      try {
        const userId = sessionStorage.getItem('userId'); // Retrieve user ID from session
        console.log('User ID:', userId); // Debug: Log user ID
        const response = await fetch(`http://localhost:8888/game/getBestScores.php?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Best scores data:', data); // Debug: Log best scores data
        
        // Filter best scores to get the best score for each level
        const filteredBestScores = {};
        levels.forEach((level, index) => {
          filteredBestScores[index + 1] = data[index + 1]; // Set best score for level
        });
        
        setBestScores(filteredBestScores);
      } catch (error) {
        console.error('Error fetching best scores:', error);
      }
    };

    fetchBestScores();
  }, [levels]);

  console.log('Best scores:', bestScores); // Debug: Log best scores state

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
              <p>
                <img src={ScoreIcon} alt="Score icon" style={{ width: "20px", height: "20px" }} /> {/* Added score icon */}
                &nbsp; {bestScores[index + 1] || 'N/A'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Levels;
