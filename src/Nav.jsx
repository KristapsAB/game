import React, { useState, useEffect } from 'react';
import './style/Nav.css';
import FontSelector from './FontSelector'; // Adjust the path accordingly
const MainMenu = () => {
  // State for theme
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Retrieve theme preference from localStorage or use default value
    return localStorage.getItem('isDarkTheme') === 'true' ? true : false;
  });

  // State for user's coins
  const [userCoins, setUserCoins] = useState(0);

  // State for logged-in username
  const [loggedInUsername, setLoggedInUsername] = useState('');

  useEffect(() => {
    // Fetch user's coins from the server
    const fetchUserCoins = async () => {
      try {
        const loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!loggedInUserData || !loggedInUserData.id) {
          console.log('User data not available. Skipping fetchUserCoins.');
          return;
        }

        setLoggedInUsername(loggedInUserData.username);

        const userId = loggedInUserData.id;

        // Replace the URL with the actual URL of your PHP script
        const url = `http://localhost:8888/game/getUserCoins.php?userId=${userId}`;

        const response = await fetch(url, {
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
          setUserCoins(result.coins);
        } else {
          console.error('Failed to fetch user coins:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserCoins();
  }, []); // Removed [loggedInUserData.id] to ensure it only runs once on mount

  const handleLogout = () => {
    // Clear local storage and redirect to the login page
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login'; // Redirect to the login page
  };

  // Function to toggle theme
  const toggleTheme = () => {
    const newThemeState = !isDarkTheme;
    setIsDarkTheme(newThemeState);
    // Save theme preference in localStorage
    localStorage.setItem('isDarkTheme', newThemeState.toString());
  };

  return (
    <div>
      <div className={`area${isDarkTheme ? ' dark-theme' : ''}`}></div>
      <nav className={`main-menu${isDarkTheme ? ' dark-theme' : ''}`}>
        <ul>
          <li>
            <a href="https://jbfarrow.com">
              <i className="fa fa-home fa-2x"></i>
              <span className="nav-text">Main Page</span>
            </a>
          </li>
          <li className="has-subnav">
            <a href="/levels">
              <i className="fa fa-globe fa-2x"></i>
              <span className="nav-text">View All Levels</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-signal fa-2x"></i>
              <span className="nav-text">Statistics</span>
            </a>
          </li>
          <li>
            <a href="/leaderboard">
              <i className="fa fa-trophy" aria-hidden="true"></i>
              <span className="nav-text">LeaderBoard</span>
            </a>
          </li>
          <li>
            <a href="/profile">
              <i className="fa fa-gear fa-2x"></i>
              <span className="nav-text">Profile</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-heart fa-2x"></i>
              <span className="nav-text">Balance: {userCoins} Coins</span>
            </a>
          </li>
        </ul>
        <ul className="logout">
          {loggedInUsername && (
            <li>
              <i className="fa fa-user fa-2x"></i>
              <span className="nav-text">{loggedInUsername.toUpperCase()}</span>
            </li>
          )}
          <li>
            <a href="#" onClick={toggleTheme}>
              <i className="fa fa-adjust fa-2x"></i>
              <span className="nav-text">Toggle Theme</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <i className="fa fa-power-off fa-2x"></i>
              <span className="nav-text">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainMenu;
