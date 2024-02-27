
// Import necessary React modules
import React, { useState, useEffect } from 'react';
import './style/stats.css';
// Define a functional component
function Stats() {
  // State variables using the useState hook
  const [count, setCount] = useState(0);

  // useEffect hook for side effects (e.g., data fetching, subscriptions)
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // Event handler function
  const handleIncrement = () => {
    setCount(count + 1);
  };

  // JSX structure for the component
  return (
    <div className='stats-container'>
        <div className="stats-main">
          <div className="basic-info">
            <h1>Average</h1>
            <h1>Complitation</h1>
            <p>20.35s</p>
         </div>
         <div className="basic-info">
            <h1>Best</h1>
            <h1>Level</h1>
            <p>Level 1 Was your best</p>
         </div>
         <div className="basic-info">
            <h1>Hearts</h1>
            <h1>Earned</h1>
            <p>20</p>
         </div>
    


        </div>
     
    </div>
  );
}

// Export the component for use in other files
export default Stats;
