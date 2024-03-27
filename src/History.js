import React, { useState, useEffect } from 'react';
import './style/history.css'; // You can create a CSS file for styling

const History = () => {
  const [gameHistory, setGameHistory] = useState([]);
  const userId = sessionStorage.getItem('userId'); // Retrieve user ID from sessionStorage

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8888/game/getGameHistory.php?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          mode: 'cors',
        });

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          console.log('Response text:', await response.text());
          return;
        }

        const result = await response.json();

        if (result.success) {
          setGameHistory(result.data);
        } else {
          console.error('Failed to fetch game history:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (userId) { // Ensure userId is available before fetching game history
      fetchGameHistory();
    }
  }, [userId]); // Fetch game history whenever userId changes

  return (
    <div className="game-history-container">
    <div className="game-history-main animate__fadeInUp">
      <h2>Game History</h2>
      <div className="game-history-list">
        {gameHistory.map((game, index) => (
          <div key={index} className="game-item animate__bounceIn">
            <div className="game-info">
              <div><strong>Level:</strong> {game.level}</div>
              <div><strong>Score:</strong> {game.score}</div>
              {/* Add more game information fields as needed */}
            </div>
            {/* Add styling or additional elements for each game item */}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default History;
