import React from 'react';
import './style/styles.css'; // Adjust the file path based on your project structure
import Heart from './image/heart.png';
import Diamond from './image/diamond-side.png';

const Levels = () => {
  // Check if a user is logged in
  const loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser'));

  return (
    
    <div className="level-main">
      <div className="level-container4">
        <a href="/game">
          <div className="clock">Time Limit</div>
          <div className="time">2 Minutes</div>
          <img src={Heart} alt="Spade" />
          <p>1</p>
          <h2>Easy</h2>
        </a>
      </div>
      <div className="level-container">
        <a href="/game">
          <div className="clock">Time Limit</div>
          <div className="time">2.30 Minutes</div>
          <img src={Diamond} alt="Spade" />
          <p>1</p>
          <h2>Medium</h2>
        </a>
      </div>
      <div className="level-container">
        <a href="/game">
          <div className="clock">Time Limit</div>
          <div className="time">2.30 Minutes</div>
          <img src={Diamond} alt="Spade" />
          <p>1</p>
          <h2>HARD</h2>
        </a>
      </div>
      <div className="level-container4">
        <a href="/game">
          <div className="clock">Time Limit</div>
          <div className="time">2 Minutes</div>
          <img src={Heart} alt="Spade" />
          <p>1</p>
          <h2>Intermittent</h2>
        </a>
      </div>
    </div>
  );
};

export default Levels;
