// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Nav';
import Login from './Login';
import Game from './game';
import Level from './Level';
import Register from './Register';
import Profile from './Profile';
import Leaderboard from './Leaderboards';
import Stats from './Stats';
import GameLevelTwo from './GameLevelTwo';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/levels"
          element={
            <>
              <NavBar /> {/* Include NavBar only on Levels page */}
              <Level />
            </>
          }
        />
        <Route
          path="/game"
          element={
            <>
              <NavBar /> {/* Include NavBar only on Game page */}
              <Game />
            </>
          }
        />
         <Route
          path="/profile"
          element={
            <>
              <NavBar /> {/* Include NavBar only on Game page */}
              <Profile />
            </>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <>
              <NavBar /> {/* Include NavBar only on Game page */}
              <Leaderboard />
            </>
          }
        />
        <Route
          path="/stats"
          element={
            <>
              <NavBar /> {/* Include NavBar only on Game page */}
              <Stats />
            </>
          }
        />
         <Route
          path="/gametwo"
          element={
            <>
              <NavBar /> {/* Include NavBar only on Game page */}
              <GameLevelTwo />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
