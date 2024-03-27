import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './style/styles.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8888/game/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'omit',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Inside the handleLogin function
      if (result.success) {
        console.log('Login successful');
  
        // Save user data in localStorage upon successful login
        localStorage.setItem('loggedInUser', JSON.stringify({
          id: result.userData.id,
          username: result.userData.username,
          email: result.userData.email,
        }));
  
        // Save user ID in sessionStorage
        sessionStorage.setItem('userId', result.userData.id);
  
        // Log userId
        console.log('userId:', result.userData.id);
  
        localStorage.setItem('isLoggedIn', 'true');
  
        // Redirect to the levels page
        navigate('/levels');
      } else {
        console.error('Login failed:', result.message);
      }
  
      setLoginStatus({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error('Error:', error);
  
      setLoginStatus({
        success: false,
        message: 'Error during login. Please try again later.',
      });
    }
  };
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log('Google login successful:', credentialResponse);
  
    try {
      const response = await fetch('http://localhost:8888/game/getUserId.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      console.log('Response from server:', result);
  
      if (result.success && result.userId) {
        localStorage.setItem('loggedInUser', JSON.stringify({
          id: result.userId,
          username: result.username || generateRandomUsername(),
          email: result.email,
        }));
        // Set userId in sessionStorage
        sessionStorage.setItem('userId', result.userId);
        navigate('/levels');
      } else {
        console.error('Error during Google login:', result.message || 'User ID not found');
        setLoginStatus({
          success: false,
          message: result.message || 'User ID not found',
        });
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      setLoginStatus({
        success: false,
        message: 'Error during Google login. Please try again later.',
      });
    }
  };
  

  const handleGoogleLoginError = (error) => {
    console.error('Google login failed:', error);
    setLoginStatus({
      success: false,
      message: 'Google login failed.',
    });
  };

  const handleRegister = () => {
    // Redirect to the registration page
    navigate('/register');
  };
  
  const generateRandomUsername = () => {
    const adjectives = ['Happy', 'Funny', 'Clever', 'Smart', 'Creative'];
    const nouns = ['Cat', 'Dog', 'Rabbit', 'Tiger', 'Elephant'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}${randomNoun}`;
  };


  return (
    <div className="login-main">
    <h2>Login</h2>
    <form>
      <input type="email" value={email} onChange={handleEmailChange} placeholder="EMAIL" />
      <br />
      <input type="password" value={password} onChange={handlePasswordChange} placeholder="PASSWORD" />
      <br />
      <div className="button">
        <button type="button" onClick={handleLogin}>
          LOGIN
        </button>
      </div>
    </form>

    <div className="google-login">
      <GoogleLogin
        clientId="301743701977-0jo8mmnfhqigsk8i1bpti9m6vv50rvgt.apps.googleusercontent.com"
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
        className="custom-google-button"
      >
        Login with Google
      </GoogleLogin>
    </div>

    {loginStatus && (
      <div className={`login-message ${loginStatus.success ? 'success' : 'error'}`}>
        {loginStatus.success ? 'Login successful' : loginStatus.message}
      </div>
    )}

    <div className="register-link">
      Not a user? <a href="/register" onClick={handleRegister}>Register now</a>
    </div>
  </div>
);
};

export default Login;