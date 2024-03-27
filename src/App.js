import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation hook
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
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const levels = [
    { cardsCount: 12, gameDuration: 120, reward: 3 },
    { cardsCount: 12, gameDuration: 110, reward: 4 },
    { cardsCount: 12, gameDuration: 90, reward: 5 },
    { cardsCount: 15, gameDuration: 90, reward: 6 },
    { cardsCount: 15, gameDuration: 80, reward: 7 },
    { cardsCount: 18, gameDuration: 100, reward: 8 },
    { cardsCount: 18, gameDuration: 85, reward: 9 },
    { cardsCount: 18, gameDuration: 80, reward: 10 },
    { cardsCount: 18, gameDuration: 70, reward: 15 },
    { cardsCount: 24, gameDuration: 400, reward: 20},
    { cardsCount: 21, gameDuration: 320, reward: 25 },
    { cardsCount: 21, gameDuration: 300, reward: 30 },
    { cardsCount: 15, gameDuration: 40, reward: 35 },
    { cardsCount: 18, gameDuration: 50, reward: 40 },
    { cardsCount: 21, gameDuration: 220, reward: 45 },
    { cardsCount: 24, gameDuration: 240, reward: 50 },
    { cardsCount: 24, gameDuration: 220, reward: 60 },
    { cardsCount: 18, gameDuration: 200, reward: 75 },
    { cardsCount: 24, gameDuration: 200, reward: 80 },
    { cardsCount: 24, gameDuration: 180, reward: 85 },
  ];


  const getLevelConfig = (levelNumber) => {
    // Adjust these values based on your game requirements
    const level = levels[levelNumber];
    if (!level) {
      throw new Error(`Invalid level number: ${levelNumber}`);
    }
    const numberOfCards = level.cardsCount;
    const coinReward = level.reward;
    const timeLimit = level.gameDuration;
  
    return { levelNumber, numberOfCards, coinReward, timeLimit };
  };
  

  return (
    <Router>
      <BackgroundProvider>
        <GoogleOAuthProvider clientId="301743701977-0jo8mmnfhqigsk8i1bpti9m6vv50rvgt.apps.googleusercontent.com">
          {/* <GoogleLoginComponent /> */}
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
                    <Game levels={levels} levelNumber={levelNumber + 1} /> {/* Pass levelNumber as a prop */}
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
        </GoogleOAuthProvider>
        <ToastContainer/>


      </BackgroundProvider>
    </Router>
  );
};

const GoogleLoginComponent = () => {
  const location = useLocation();
  const currentLocation = location.pathname;
  if (currentLocation === '/login' || currentLocation === '/register') {
    return (
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
         
        }}
        onError={() => {
          console.log('Login Failed');
         
        }}
      />
    );
  } else {
    return null;
  }
};

export default App;
