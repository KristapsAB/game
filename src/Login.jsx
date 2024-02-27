import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/styles.css'; // Adjust the file path based on your project structure
import icon1 from './style/icon1.png'; // Adjust the file path based on your project structure
import heart from './style/heart.png';

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
  
  

  return (
    <div className="login-main">
      <img className='icon1' src={icon1} alt="Icon" />
      <img className='icon2' src={icon1} alt="Icon" />
      <img className='icon3' src={icon1} alt="Icon" />
      <img className='icon4' src={icon1} alt="Icon" />
      <img className='icon5' src={heart} alt="Icon" />
      <img className='icon6' src={heart} alt="Icon" />

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

      {loginStatus && (
        <div className={`login-message ${loginStatus.success ? 'success' : 'error'}`}>
          {loginStatus.success
            ? 'Login successful'
            : loginStatus.message}
        </div>
      )}
    </div>
  );
};

export default Login;
