import React, { useState, useEffect } from 'react';
import './style/game.css'; // Adjust the file path based on your project structure
import hearts from './image/heart.png';
import spade from './image/spade.png';
import diamondSide from './image/diamond-side.png';
import Clubs from './image/clubs.png';
import { useNavigate } from 'react-router-dom';

const GameLevelTwo = () => {
  const symbols = [hearts, spade, diamondSide, Clubs];
  const numberOfMatchesToWin = 3;
  const hintDelay = 3000; // milliseconds for hint delay
  const gameDuration = 80; // seconds for game duration (1.3 minutes)
  const coinReward = 3; // Coin reward for completing the level
  const navigate = useNavigate();

  const generateRandomCards = () => {
    const initialCards = symbols
      .map((symbol, index) =>
        Array.from({ length: 3 }, () => ({
          id: Math.random(),
          img: symbol,
          matched: false,
          type: index,
        }))
      )
      .flat()
      .slice(0, 9); // Take only the first 9 cards

    // Shuffle the cards
    return initialCards.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(generateRandomCards());
  const [flippedCount, setFlippedCount] = useState(0);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [checkingForMatch, setCheckingForMatch] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [userId, setUserId] = useState(""); // State to store user ID

  useEffect(() => {
    // Fetch userId from sessionStorage
    const storedUserId = sessionStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (flippedCount === numberOfMatchesToWin && !checkingForMatch) {
      setCheckingForMatch(true);
      setTimeout(() => checkForMatch(), 1000);
    }
  }, [flippedCount, checkingForMatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer >= gameDuration) {
          // Game duration reached, end the game
          setGameOver(true);
          clearInterval(intervalId);
          return gameDuration; // Ensure the timer stops at 1:20
        }
        if (gameCompleted) {
          // If game is completed, stop the timer
          clearInterval(intervalId);
          return prevTimer;
        }
        return prevTimer + 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, gameDuration, gameCompleted]);

  useEffect(() => {
    if (cards.filter((card) => card.matched).length === cards.length) {
      // All cards matched, set gameCompleted to true
      setGameCompleted(true);
    }
  }, [cards]);

  const handleCardClick = (index) => {
    if (!cards[index].matched && !flippedIndexes.includes(index) && !checkingForMatch) {
      setCards((prevCards) =>
        prevCards.map((card, i) =>
          i === index ? { ...card, flipped: true } : card
        )
      );
      setFlippedCount((prevCount) => prevCount + 1);
      setFlippedIndexes((prevIndexes) => [...prevIndexes, index]);
    }
  };

  const checkForMatch = () => {
    const flippedIndexesCopy = [...flippedIndexes];
    let match = true;

    for (let i = 1; i < flippedIndexesCopy.length; i++) {
      if (cards[flippedIndexesCopy[i]].img !== cards[flippedIndexesCopy[0]].img) {
        match = false;
        break;
      }
    }

    setCards((prevCards) =>
      prevCards.map((card, i) =>
        flippedIndexesCopy.includes(i)
          ? { ...card, flipped: match, matched: match }
          : card
      )
    );

    setFlippedCount(0);
    setFlippedIndexes([]);
    setCheckingForMatch(false);

    if (!match) {
      // If not a match, instantly flip the first two cards back
      flippedIndexesCopy.slice(0, 2).forEach((index) => {
        setCards((prevCards) =>
          prevCards.map((card, i) =>
            i === index ? { ...card, flipped: false } : card
          )
        );
      });
    }

    if (match) {
      checkForWin();
    }
  };

  const checkForWin = () => {
    if (cards.filter((card) => card.matched).length === cards.length) {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCards(generateRandomCards());
    setFlippedCount(0);
    setFlippedIndexes([]);
    setCheckingForMatch(false);
    setHintUsed(false);
    setTimer(0);
    setGameOver(false);
    setGameCompleted(false);
  };

  const useHint = async () => {
    if (!hintUsed) {
      try {
        // Deduct coins from the database
        const url = 'http://localhost:8888/game/updateCoins.php';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `userId=${userId}`,
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
          // Coins deducted successfully, now reveal the cards
          setHintUsed(true);
  
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) => ({ ...card, flipped: true }))
            );
          }, 0);
  
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) => ({
                ...card,
                flipped: card.matched ? true : false,
              }))
            );
            setHintUsed(false);
          }, hintDelay);
        } else {
          console.error('Failed to deduct coins:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  

  const handleGameCompletion = async () => {
    try {
      const level = 2; // Level 2
      const score = calculateScore(); // Implement a function to calculate the score
  
      // Replace the URL with the actual URL of your PHP script
      const url = 'http://localhost:8888/game/saveScore.php';
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&level=${level}&score=${score}`,
        credentials: 'include', // Add this line
        mode: 'cors', // Add this line
      });
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        console.log('Response text:', await response.text());
        return;
      }
  
      const result = await response.json();
  
      if (result.success) {
        // Score updated successfully, now update the user's coins
        const coinsEarned = coinReward;
  
        // Award coins to the user
        awardCoins(coinsEarned);
  
        // Redirect to the start page
        navigate('/levels'); // Replace '/start' with the actual route of your start page
      } else {
        console.error('Failed to update score:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const awardCoins = async (coinsEarned) => {
    try {
      // Award coins to the user by updating the database
      const awardCoinsUrl = 'http://localhost:8888/game/updateCoins.php'; // Replace with the actual URL
      const awardCoinsResponse = await fetch(awardCoinsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&coins=${coinsEarned}`,
        credentials: 'include', // Add this line
        mode: 'cors', // Add this line
      });
  
      if (!awardCoinsResponse.ok) {
        console.error(`HTTP error! Status: ${awardCoinsResponse.status}`);
        console.log('Response text:', await awardCoinsResponse.text());
        return;
      }
  
      const awardCoinsResult = await awardCoinsResponse.json();
  
      if (awardCoinsResult.success) {
        console.log('Coins awarded successfully');
      } else {
        console.error('Failed to award coins:', awardCoinsResult.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  

  const calculateScore = () => {
    // Implement the logic to calculate the score based on game performance
    // You might consider factors like time taken, hints used, etc.
    // For simplicity, let's assume a basic score for now.
    return gameDuration - timer;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
    return formattedTime;
  };

  return (
    <div className="game-main">
      {gameCompleted && (
        <div className="blur">
          <div className="popup">
            <p>{`Congratulations! You finished Level 2 in ${formatTime(timer)}`}</p>
            <button onClick={handleGameCompletion}>Save Score</button>
            <button onClick={() => alert('Redirecting to Levels')}>Go to Levels Page</button>
          </div>
        </div>
      )}

      <div className="game-buttons">
        <button onClick={useHint} disabled={hintUsed}>
          HINT
        </button>
        <div className="timer-container">{formatTime(timer)}</div>
        <button onClick={resetGame}>GIVE UP</button>
      </div>
      <div className="card-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card1 ${card.flipped ? 'flipped' : ''} ${
              card.matched ? 'matched' : ''
            }`}
            onClick={() => handleCardClick(index)}
          >
            {card.flipped && (
              <>
                {renderCornerSymbol(card.type)}
                <img src={card.img} alt="Icon" />
              </>
            )}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="blur">
          <div className="popup">
            <p>Time has expired, you lost!</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

const renderCornerSymbol = (type) => {
  return (
    <div className="symbol">
      <div className="top-left">
        <div className="text">A</div>
        {type === 0 && <div className="icon">&#x2665;</div>}
        {type === 1 && <div className="icon">&#x2660;</div>}
        {type === 2 && <div className="icon">&#x2666;</div>}
        {type === 3 && <div className="icon">&#x2663;</div>}
        {type === 4 && <div className="icon">&#x2665;</div>}
      </div>
      <div className="bottom-right">
        <div className="text2">A</div>
        {type === 0 && <div className="icon">&#x2665;</div>}
        {type === 1 && <div className="icon">&#x2660;</div>}
        {type === 2 && <div className="icon">&#x2666;</div>}
        {type === 3 && <div className="icon">&#x2663;</div>}
        {type === 4 && <div className="icon">&#x2665;</div>}
      </div>
    </div>
  );
};

export default GameLevelTwo;
