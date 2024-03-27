import React, { useState, useEffect } from 'react';
import './style/leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredLeaderboardData, setFilteredLeaderboardData] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(''); // State to store selected level
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Replace the URL with the actual URL of your PHP script
        let url = 'http://localhost:8888/game/getLeaderboardData.php';
  
        // Append selected level to URL if it's not empty
        if (selectedLevel !== '') {
          url += `?level=${selectedLevel}`;
        }
  
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
          // Sort the leaderboard data by score in ascending order (from lowest to highest)
          const sortedData = result.data.sort((a, b) => a.score - b.score);
          setLeaderboardData(sortedData);
          setFilteredLeaderboardData(sortedData);
        } else {
          console.error('Failed to fetch leaderboard data:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchLeaderboardData();
  }, [selectedLevel]);
  

  // Function to filter leaderboard data by selected level
  const filterLeaderboardByLevel = (level) => {
    setSelectedLevel(level);
    if (level === '') {
      // If level is empty, display all leaderboard data
      setFilteredLeaderboardData(leaderboardData);
    } else {
      // Otherwise, filter leaderboard data by selected level
      const filteredData = leaderboardData.filter(entry => entry.level === level);
      setFilteredLeaderboardData(filteredData);
    }
    setCurrentPage(1); // Reset current page to 1 when filtering
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaderboardData = filteredLeaderboardData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredLeaderboardData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to get rank icon based on rank
  const getRankIcon = (rank) => {
    if (rank === 1) {
      return <i className="fa fa-trophy fa-2x trophy-icon"></i>; // Trophy icon for rank 1
    } else if (rank === 2) {
      return <i className="fa fa-trophy fa-2x silver-icon"></i>; // Medal icon for rank 2
    } else if (rank === 3) {
      return <i className="fa fa-trophy fa-2x bronze-icon"></i>; // Award icon for rank 3
    } else {
      return <i className="fa fa-trophy fa-2x red-icon"></i>; // Default icon for other ranks
    }
  };

  return (
    <div className='leaderboard-container'>
      <div className="leaderboard-main">
        <h2>Leaderboard</h2>
        {/* Dropdown menu to select level for filtering */}
        <select onChange={(e) => filterLeaderboardByLevel(e.target.value)}>
          <option value="">All Levels</option>
          {Array.from({ length: 20 }, (_, i) => (
            <option key={i} value={i + 1}>Level {i + 1}</option>
          ))}
        </select>
        <div className='rank-container'>
          {currentLeaderboardData.length > 0 ? (
            currentLeaderboardData.map((entry, localIndex) => (
              <div key={localIndex} className='rank-item'>
                <div className='rank'>
                  {getRankIcon(startIndex + localIndex + 1)} {startIndex + localIndex + 1}
                </div>
                <div className='username'>{entry.username}</div>
                <div className='score'>{entry.score}</div>
              </div>
            ))
          ) : (
            <div className='no-data'>No data available</div>
          )}
        </div>

        {filteredLeaderboardData.length > itemsPerPage && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
