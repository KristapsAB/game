import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/styles.css';


const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const navigate = useNavigate();
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
  
      if (result.success) {
        setRegistrationStatus({
          success: true,
          message: 'User registered successfully. Redirecting to login page...',
        });
        navigate('/login');
      } else {
        setRegistrationStatus({
          success: false,
          message: result.message,
        });
      }
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
      <h2>Register</h2>
      <form>
        <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" />
        <br />
        <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
        <br />
        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
        <br />
        <div className="button">
          <button type="button" onClick={handleRegister}>
            Register
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

      <div className="login-link">
        Already a user? <Link to="/login">Login now</Link>
      </div>
    </div>
  );
};

export default Register;
