import React, { useState } from 'react';
import './style/styles.css'; // Adjust the file path based on your project structure
import icon1 from './style/icon1.png';
import heart from './style/heart.png';
import spade from './style/spade.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const isEmailValid = (email) => {
    // Use a simple regex to check for email validity
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isUsernameValid = (username) => {
    // Use a regex to check if the username contains only Latin alphabet characters
    const latinAlphabetRegex = /^[a-zA-Z]+$/;
    return latinAlphabetRegex.test(username) && !/[!@#$%^&*(),.?":{}|<>]/g.test(username);
  };

  const handleRegister = async () => {
    try {
      // Validation checks
      if (!isEmailValid(email)) {
        setRegistrationStatus({
          success: false,
          message: 'Invalid email format. Please enter a valid email address.',
        });
        return;
      }
  
      if (!isUsernameValid(username)) {
        setRegistrationStatus({
          success: false,
          message: 'Invalid username. Please use only Latin alphabet characters with no special characters.',
        });
        return;
      }
  
      if (password.length < 7) {
        setRegistrationStatus({
          success: false,
          message: 'Password must be at least 7 characters long.',
        });
        return;
      }
  
      const response = await fetch('http://localhost:8888/game/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
        credentials: 'omit',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      setRegistrationStatus({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.error('Error:', error);
  
      setRegistrationStatus({
        success: false,
        message: 'Error during registration. Please try again later.',
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
      <img className='icon7' src={spade} alt="Icon" />
      <img className='icon8' src={spade} alt="Icon" />
      <h2>Register</h2>
      <form>
        <input type="text" value={username} onChange={handleUsernameChange} placeholder="USERNAME" />
        <br />
        <input type="email" value={email} onChange={handleEmailChange} placeholder="EMAIL" />
        <br />
        <input type="password" value={password} onChange={handlePasswordChange} placeholder="PASSWORD" />
        <br />
        <div className="button">
          <button type="button" onClick={handleRegister}>
            REGISTER
          </button>
        </div>
      </form>
  
      {registrationStatus && (
        <div className={`registration-message ${registrationStatus.success ? 'success' : 'error'}`}>
          {registrationStatus.success
            ? 'User registered successfully'
            : registrationStatus.message}
        </div>
      )}
    </div>
  );
  
};

export default Register;
