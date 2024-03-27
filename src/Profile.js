// Profile.js

import React, { useState, useEffect } from 'react';
import './style/profile.css';
import { useBackground } from './BackgroundContext';
import wallpaper from './wallpapers/wallpaper29.png';
import wallpaper1 from './wallpapers/wallpaper25.png';
import wallpaper2 from './wallpapers/wallpaper32.png';
import wallpaper3 from './wallpapers/wallpaper30.png';
import Cat from './profile/cat.jpg';
import Dog from './profile/dog.png';
const Profile = () => {
  const userId = sessionStorage.getItem('userId');
  const { changeBackground } = useBackground();
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [duplicateUserError, setDuplicateUserError] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const [textColor, setTextColor] = useState('#000000'); // Default text color
  const [inputStyle, setInputStyle] = useState({ border: '3px solid #e12b2b' }); // Default input style

  const applyBackgroundStyle = (background) => {
    document.body.style.backgroundImage = `url(${background})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  };

  const updateDynamicStyles = (newBackground) => {
    if (newBackground === wallpaper1) {
      setTextColor('#000000'); // Set text color to white
      setInputStyle({ borderBottom: 'none' });
    } else {
      resetDynamicStyles(); // Reset styles for other backgrounds
    }
  };

  const resetDynamicStyles = () => {
    const defaultTextColor = '#000000';
    const defaultInputStyle = { border: 'none' };

    setTextColor(defaultTextColor);
    setInputStyle(defaultInputStyle);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8888/game/getUserProfile.php?id=${userId}`, {
          method: 'GET',
          credentials: 'omit',
        });

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          console.log('Response text (fetchUserData):', await response.text());
          return;
        }

        const result = await response.json();

        if (result.success) {
          setUserData(result.userData);
          setEditedData({
            username: result.userData.username,
            email: result.userData.email,
            password: '', // Do not include the password initially
          });
        } else {
          console.error('Failed to fetch user data:', result.message);
        }
      } catch (error) {
        console.error('Error (fetchUserData):', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const storedBackground = localStorage.getItem('selectedBackground');
    if (storedBackground && storedBackground !== selectedBackground) {
      setSelectedBackground(storedBackground);
      changeBackground(storedBackground);
      applyBackgroundStyle(storedBackground);
      updateDynamicStyles(storedBackground);
    }
  }, [changeBackground, selectedBackground]);
  
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:8888/game/checkEmailExists.php?email=${email}`, {
        method: 'GET',
        credentials: 'omit',
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        console.log('Response text (checkEmailExists):', await response.text());
        return false; // Treat as non-existing email on error
      }

      const result = await response.json();

      return result.exists;
    } catch (error) {
      console.error('Error (checkEmailExists):', error);
      return false; // Treat as non-existing email on error
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });

    setValidationErrors({
      ...validationErrors,
      [name]: '',
    });

    setSuccessMessage('');
    setDuplicateUserError('');

    resetDynamicStyles();
  };

  const validateInputs = () => {
    let valid = true;
    const errors = {};

    if (!editedData.username.trim()) {
      valid = false;
      errors.username = 'Username cannot be empty';
    }

    if (!editedData.email.trim()) {
      valid = false;
      errors.email = 'Email cannot be empty';
    }

    if (!editedData.password.trim()) {
      valid = false;
      errors.password = 'Password cannot be empty';
    }

    if (!editedData.email.includes('@')) {
      valid = false;
      errors.email = 'Invalid email format';
    }

    if (editedData.password.length < 7) {
      valid = false;
      errors.password = 'Password must be at least 7 characters';
    }

    if (!/^[a-zA-Z]+$/.test(editedData.username)) {
      valid = false;
      errors.username = 'Username can only contain Latin alphabet characters';
    }

    setValidationErrors(errors);

    return valid;
  };

  const handleSave = async () => {
    try {
      if (!validateInputs()) {
        console.error('Validation failed. Please check the form for errors.');
        return;
      }
  
      // Check if the edited username is different from the current username
      const currentUsername = userData.username;
      const editedUsername = editedData.username;
  
      if (currentUsername !== editedUsername) {
        // Check for duplicate username
        const usernameExists = await checkUsernameExists(editedData.username);
  
        if (usernameExists) {
          setDuplicateUserError('Username already exists.');
          return;
        }
      }
  
      // Check if the edited email is different from the current email
      const currentEmail = userData.email;
      const editedEmail = editedData.email;
  
      if (currentEmail !== editedEmail) {
        // Check for duplicate email
        const emailExists = await checkEmailExists(editedData.email);
  
        if (emailExists) {
          setDuplicateUserError('Email already exists.');
          return;
        }
      }
  
      // Proceed with saving the profile data
      const requestData = {
        username: editedData.username,
        email: editedData.email,
        ...(editedData.password && { password: editedData.password }),
      };
  
      const response = await fetch(`http://localhost:8888/game/updateUserProfile.php?id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        console.log('Response text (handleSave):', await response.text());
        return;
      }
  
      const result = await response.json();
  
      if (result.success) {
        setUserData(result.userData);
        setSuccessMessage('Data updated successfully');
        console.log('User data updated successfully');
      } else {
        if (result.errorCode === 'DUPLICATE_USER') {
          setDuplicateUserError(result.message);
        } else {
          console.error('Failed to update user data:', result.message);
        }
      }
    } catch (error) {
      console.error('Error (handleSave):', error);
    }
  };
  
  
  
  const checkUsernameExists = async (username) => {
    try {
      const response = await fetch(`http://localhost:8888/game/checkUsernameExists.php?username=${username}`, {
        method: 'GET',
        credentials: 'omit',
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        console.log('Response text (checkUsernameExists):', await response.text());
        return false; // Treat as non-existing username on error
      }
  
      const result = await response.json();
  
      return result.exists;
    } catch (error) {
      console.error('Error (checkUsernameExists):', error);
      return false; // Treat as non-existing username on error
    }
  };
  

  const handleBackgroundChange = (newBackground) => {
    setSelectedBackground(newBackground);
    changeBackground(newBackground);
    applyBackgroundStyle(newBackground);
    updateDynamicStyles(newBackground);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-main">
        <div className='profile-second'>
          <div className='profile-input'>
            <div className='profile-image'>
              <img className='profile-image-div' src={Dog}></img>
            </div>
            <label><span>Username</span></label>
  <input type="text" name="username" value={editedData.username} onChange={handleInputChange} style={{ color: textColor, ...inputStyle }} />
  <div className="error-message">{validationErrors.username}</div> {/* Render username error message */}
  {duplicateUserError && duplicateUserError.startsWith('Username already exists') && <div className="error-message">{duplicateUserError}</div>} {/* Render duplicate username error message */}

  <label>Email</label>
  <input type="text" name="email" value={editedData.email} onChange={handleInputChange} style={{ color: textColor, ...inputStyle }} />
  <div className="error-message">{validationErrors.email}</div> {/* Render email error message */}
  {duplicateUserError && duplicateUserError.startsWith('Email already exists') && <div className="error-message">{duplicateUserError}</div>} {/* Render duplicate email error message */}

  <label>Password</label>
  <input type="password" name="password" value={editedData.password} onChange={handleInputChange} style={{ color: textColor, ...inputStyle }} />
  <div className="error-message">{validationErrors.password}</div> {/* Render password error message */}

  {successMessage && <div className="success-message">{successMessage}</div>}
  <button onClick={handleSave}>Save</button>
        </div>
        <div className='background-right'>
        <label>Change Background</label>
        <div className='background-container'>
          <div
            className='a-background'
            style={{
              backgroundImage: `url(${wallpaper})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => handleBackgroundChange(wallpaper)}
          ></div>
          <div
            className='a-background'
            style={{
              backgroundImage: `url(${wallpaper1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => handleBackgroundChange(wallpaper1)}
          ></div>
          <div
            className='a-background'
            style={{
              backgroundImage: `url(${wallpaper2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => handleBackgroundChange(wallpaper2)}
          ></div>
          <div
            className='a-background'
            style={{
              backgroundImage: `url(${wallpaper3})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={() => handleBackgroundChange(wallpaper3)}
          ></div>
        </div>
        </div>
       
      </div>
      </div>
    </div>
  );
};

export default Profile;
