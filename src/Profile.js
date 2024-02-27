import React, { useState, useEffect } from 'react';
import './style/profile.css';

const Profile = () => {
  // Fetch user ID from sessionStorage
  const userId = sessionStorage.getItem('userId');

  // State to store user data
  const [userData, setUserData] = useState(null);

  // State to manage edited data and validation errors
  const [editedData, setEditedData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for success message
  const [successMessage, setSuccessMessage] = useState('');

  // State for duplicate user error
  const [duplicateUserError, setDuplicateUserError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8888/game/getUserProfile.php?id=${userId}`, {
          method: 'GET',
          credentials: 'omit',
        });

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          console.log('Response text:', await response.text());
          return;
        }

        const resultText = await response.text();
        console.log('Raw result text:', resultText);

        try {
          const result = JSON.parse(resultText);
          if (result.success) {
            setUserData(result.userData);
            setEditedData({
              username: result.userData.username,
              email: result.userData.email,
              password: result.userData.password, // Include the password
            });
          } else {
            console.error('Failed to fetch user data:', result.message);
          }
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
          console.log('Raw result text:', resultText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });

    // Clear previous validation errors when the user starts typing
    setValidationErrors({
      ...validationErrors,
      [name]: '',
    });

    // Clear success message when the user starts typing
    setSuccessMessage('');

    // Clear duplicate user error when the user starts typing
    setDuplicateUserError('');
  };

  const validateInputs = () => {
    let valid = true;
    const errors = {};

    // Check for empty fields
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

    // Check for @ symbol in email
    if (!editedData.email.includes('@')) {
      valid = false;
      errors.email = 'Invalid email format';
    }

    // Check minimum password length
    if (editedData.password.length < 7) {
      valid = false;
      errors.password = 'Password must be at least 7 characters';
    }

    // Check for special characters in username
    if (!/^[a-zA-Z]+$/.test(editedData.username)) {
      valid = false;
      errors.username = 'Username can only contain Latin alphabet characters';
    }

    setValidationErrors(errors);

    return valid;
  };

  const handleSave = async () => {
    try {
      // Validate inputs before making the request
      if (!validateInputs()) {
        console.error('Validation failed. Please check the form for errors.');
        return;
      }

      const requestData = {
        username: editedData.username,
        email: editedData.email,
        password: editedData.password,
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
        console.log('Response text:', await response.text());
        return;
      }

      const resultText = await response.text();
      console.log('Raw result text:', resultText);

      const result = JSON.parse(resultText);

      if (result.success) {
        setUserData(result.userData);
        setSuccessMessage('Profile data updated successfully');
        console.log('User data updated successfully');
      } else {
        if (result.errorCode === 'DUPLICATE_USER') {
          setDuplicateUserError(result.message);
        } else {
          console.error('Failed to update user data:', result.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-main">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={editedData.username}
          onChange={handleInputChange}
        />
        <div className="error-message">{validationErrors.username}</div>

        <label>Email</label>
        <input type="text" name="email" value={editedData.email} onChange={handleInputChange} />
        <div className="error-message">{validationErrors.email}</div>

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={editedData.password}
          onChange={handleInputChange}
        />
        <div className="error-message">{validationErrors.password}</div>

        {duplicateUserError && <div className="error-message">{duplicateUserError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
