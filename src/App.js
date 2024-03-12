// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Nav';
import Login from './Login';
import Game from './game';
import Register from './Register';
import Profile from './Profile';
import Leaderboard from './Leaderboards';
import Stats from './Stats';
import { BackgroundProvider } from './BackgroundContext';
import History from './History';
import Levels from './Level';

const App = () => {
  const levels = [
    { cardsCount: 12, gameDuration: 40, reward: 3 },
    { cardsCount: 16, gameDuration: 60, reward: 4 },
    { cardsCount: 20, gameDuration: 75, reward: 5 },
    { cardsCount: 14, gameDuration: 85, reward: 3 },
    { cardsCount: 18, gameDuration: 90, reward: 4 },
    { cardsCount: 22, gameDuration: 100, reward: 5 },
    { cardsCount: 16, gameDuration: 110, reward: 3 },
    { cardsCount: 20, gameDuration: 110, reward: 4 },
    { cardsCount: 24, gameDuration: 115, reward: 5 },
    { cardsCount: 18, gameDuration: 120, reward: 3 },
    { cardsCount: 22, gameDuration: 125, reward: 4 },
    { cardsCount: 26, gameDuration: 130, reward: 5 },
    { cardsCount: 20, gameDuration: 110, reward: 3 },
    { cardsCount: 24, gameDuration: 120, reward: 4 },
    { cardsCount: 28, gameDuration: 140, reward: 5 },
    { cardsCount: 22, gameDuration: 160, reward: 3 },
    { cardsCount: 26, gameDuration: 130, reward: 4 },
    { cardsCount: 30, gameDuration: 300, reward: 5 },
    { cardsCount: 24, gameDuration: 260, reward: 3 },
    { cardsCount: 28, gameDuration: 240, reward: 4 },
  ];


  const getLevelConfig = (levelNumber) => {
    // Adjust these values based on your game requirements
    const numberOfCards = levels[levelNumber - 1].cardsCount;
    const coinReward = levels[levelNumber - 1].reward;
    const timeLimit = levels[levelNumber - 1].gameDuration;
  
    return { numberOfCards, coinReward, timeLimit };
  };

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
                <Levels levels={levels} />
              </>
            }
          />
          {[...Array(levels.length).keys()].map((levelNumber) => (
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

export default App;
