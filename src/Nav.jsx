import React, { useState, useEffect } from 'react';
import './style/Nav.css';
import wallpaper from './wallpapers/wallpaper29.png';
import wallpaper1 from './wallpapers/wallpaper25.png';
import wallpaper2 from './wallpapers/wallpaper32.png';
import wallpaper3 from './wallpapers/wallpaper30.png';

const MainMenu = () => {
  const [selectedBackground, setSelectedBackground] = useState(localStorage.getItem('selectedBackground') || '');
  const [isDarkTheme, setIsDarkTheme] = useState(localStorage.getItem('isDarkTheme') === 'true');
  const [userCoins, setUserCoins] = useState(0);
  const [showBackgroundDropdown, setShowBackgroundDropdown] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!loggedInUserData || !loggedInUserData.username) {
          console.log('User data not available. Skipping fetchUser.');
          return;
        }

        setLoggedInUsername(loggedInUserData.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        const loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!loggedInUserData || !loggedInUserData.id) {
          console.log('User data not available. Skipping fetchUserCoins.');
          return;
        }

        const userId = loggedInUserData.id;
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
  }, []);

  useEffect(() => {
    // Update background when selectedBackground changes
    document.body.style.backgroundImage = `url(${selectedBackground})`;
    localStorage.setItem('selectedBackground', selectedBackground);
  }, [selectedBackground]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    const newThemeState = !isDarkTheme;
    setIsDarkTheme(newThemeState);
    localStorage.setItem('isDarkTheme', newThemeState.toString());
  };

  const handleBackgroundChange = (background) => {
    setSelectedBackground(background);
  };

  return (
    <div>
      <div className={`area${isDarkTheme ? ' dark-theme' : ''}`}></div>
      <nav className={`main-menu${isDarkTheme ? ' dark-theme' : ''}`}>
        <ul>
  
          <li className="has-subnav">
            <a href="/levels">
              <i className="fa fa-globe fa-2x"></i>
              <span className="nav-text">Levels</span>
            </a>
          </li>
          <li>
            <a href="/history">
              <i className="fa fa-signal fa-2x"></i>
              <span className="nav-text">Game History</span>
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
              <span className="nav-text">Credits: {userCoins} </span>
            </a>
          </li>
          <li className="has-subnav" onMouseEnter={() => setShowBackgroundDropdown(true)} onMouseLeave={() => setShowBackgroundDropdown(false)}>
            <a href="#">
              <i className="fa fa-picture-o fa-2x"></i>
              <span className="nav-text">Backgrounds</span>
            </a>
            {showBackgroundDropdown && (
              <ul className="subnav" onMouseEnter={() => setShowBackgroundDropdown(true)} onMouseLeave={() => setShowBackgroundDropdown(false)}>
                <li onMouseEnter={() => handleBackgroundChange(wallpaper)}>
                  <span><a href="#">Single Father</a></span>
                </li>
                <li onMouseEnter={() => handleBackgroundChange(wallpaper1)}>
                  <span><a href="#">Aqua Guy</a></span>
                </li>
                <li onMouseEnter={() => handleBackgroundChange(wallpaper2)}>
                  <span><a href="#">Stone Guy</a></span>
                </li>
                <li onMouseEnter={() => handleBackgroundChange(wallpaper3)}>
                  <span><a href="#">Purple Dude</a></span>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <ul className="logout">
          <li>
            <a href="#" onClick={toggleTheme}>
              <i className="fa fa-adjust fa-2x"></i>
              <span className="nav-text">Toggle Theme</span>
            </a>
          </li>
          <ul className="logout">
          {loggedInUsername && (
            <li>
              <i className="fa fa-user fa-2x"></i>
              <span className="nav-text">{loggedInUsername.toUpperCase()}</span>
            </li>
          )}
          </ul>
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
