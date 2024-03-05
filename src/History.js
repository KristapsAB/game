// GameHistory.js

import React from 'react';
import './style/history.css'; // You can create a CSS file for styling

const History = () => {
  const mockGameHistory = [
    { id: 1, date: '2022-03-01', duration: 120, score: 150 },
    { id: 2, date: '2022-03-02', duration: 90, score: 200 },
  ];

  return (
    <div className="game-history-container">
        <div className='game-history-main'></div>
        <div className='game-row'></div>
    </div>
  );
};

export default History;
