import React, { useState, useEffect } from 'react';
import './style/leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Replace the URL with the actual URL of your PHP script
        const url = 'http://localhost:8888/game/getLeaderboardData.php';

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
          // Sort the leaderboard data by score in descending order
          const sortedData = result.data.sort((a, b) => b.score - a.score);
          setLeaderboardData(sortedData);
        } else {
          console.error('Failed to fetch leaderboard data:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaderboardData = leaderboardData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) {
      return <i className="fa fa-trophy fa-2x trophy-icon"></i>; // Trophy icon for rank 1
    } else if (rank === 2) {
      return <i className="fa fa-trophy fa-2x silver-icon"></i>; // Medal icon for rank 2
    } else if (rank === 3) {
      return <i className="fa fa-trophy fa-2x bronze-icon"></i>; // Award icon for rank 3
    } else {
      return <i className="fa fa-trophy fa-2x default-icon"></i>; // Default icon for other ranks
    }
  };

  const globalIndex = (currentPage - 1) * itemsPerPage;
  

  return (
    <div className='leaderboard-container'>
      <div className="leaderboard-main">
        <h2>Leaderboard</h2>
        <div className='rank-container'>
          {currentLeaderboardData.map((entry, localIndex) => (
            <div key={localIndex} className='rank-item'>
              <div className='rank'>
                {getRankIcon(globalIndex + localIndex + 1)} {globalIndex + localIndex + 1}
              </div>
              <div className='username'>{entry.username}</div>
              <div className='score'>{entry.score}</div>
            </div>
          ))}
        </div>

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
      </div>
    </div>
  );
};


export default Leaderboard;
