// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Nav';
import Login from './Login';
import Game from './game';  // Adjust the case to match the actual file name

import Register from './Register';
import Profile from './Profile';
import Leaderboard from './Leaderboards';
import Stats from './Stats';
import { BackgroundProvider } from './BackgroundContext';
import History from './History';
import Levels from './Level';

const App = () => {
  return (
    <Router>
      <BackgroundProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/levels"
            element={
              <>
                <NavBar />
                <Levels />
              </>
            }
          />
          {/* Updated Level route to use :levelNumber parameter */}
          {[...Array(20).keys()].map((levelNumber) => (
            <Route
              key={levelNumber + 1}
              path={`/level/${levelNumber + 1}`}
              element={
                <>
                  <NavBar />
                  <Game levelConfig={getLevelConfig(levelNumber + 1)} />
                </>
              }
            />
          ))}
          <Route
            path="/profile"
            element={
              <>
                <NavBar />
                <Profile />
              </>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <>
                <NavBar />
                <Leaderboard />
              </>
            }
          />
          <Route
            path="/stats"
            element={
              <>
                <NavBar />
                <Stats />
              </>
            }
          />
        
          <Route
            path="/history"
            element={
              <>
                <NavBar />
                <History />
              </>
            }
          />
        </Routes>
      </BackgroundProvider>
    </Router>
  );
};

// Sample level configurations
const getLevelConfig = (levelNumber) => {
  // Adjust these values based on your game requirements
  const numberOfCards = 10 + levelNumber * 2;
  const coinReward = 5 + levelNumber * 2;
  const timeLimit = 120 - levelNumber * 5;

  return { numberOfCards, coinReward, timeLimit };
};

export default App;
