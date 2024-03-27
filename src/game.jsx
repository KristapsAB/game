import React, { useState, useEffect } from 'react';
import './style/game.css';
import hearts from './image/minecraft13.png';
import spade from './image/minecraft12.png';
import diamondSide from './image/minecraft11.png';
import Clubs from './image/minecraft10.png';
import star from './image/minecraft9.png';
import king from './image/minecraft8.png';
import queen from './image/minecraft7.png';//yes	
import jack from './image/minecraft6.png';//yes
import rose from './image/minecraft14.png';	
import { useNavigate, useLocation } from 'react-router-dom';

const Game = ( {levels, levelNumber} ) => {
  const location = useLocation();
  const levelConfig = location.state;
  const symbols = [hearts, spade, diamondSide, Clubs, star, king, queen, jack,rose];
  const numberOfCards = levelConfig?.numberOfCards || 12; // Adjust the default value as needed
  const numberOfMatchesToWin = levelConfig?.numberOfMatchesToWin || 3;
  const hintDelay = levelConfig?.hintDelay || 3000;
  const gameDuration = levelConfig?.gameDuration || 120;
  const navigate = useNavigate();
  const [insufficientCoins, setInsufficientCoins] = useState(false);

  // console.log('Level Config:', levelConfig);
  const generateRandomCards = () => {
    const allSymbols = [...symbols]; 
    const symbolCounts = new Map();
  
    const shuffledSymbols = allSymbols.sort(() => Math.random() - 0.5);
  
    const matchingPairs = shuffledSymbols.slice(0, numberOfMatchesToWin);
  
    let initialCards = matchingPairs.flatMap((symbol, index) => {
      const matchingCards = Array.from(
        { length: numberOfCards / numberOfMatchesToWin },
        (_, i) => {
          if (!symbolCounts.has(symbol)) {
            symbolCounts.set(symbol, 1);
          } else if (symbolCounts.get(symbol) < numberOfMatchesToWin) {
            symbolCounts.set(symbol, symbolCounts.get(symbol) + 1);
          } else {
            const nextSymbolIndex = shuffledSymbols.findIndex(
              (s) => !symbolCounts.has(s) || symbolCounts.get(s) < numberOfMatchesToWin
            );
            if (nextSymbolIndex !== -1) {
              const nextSymbol = shuffledSymbols[nextSymbolIndex];
              symbolCounts.set(nextSymbol, (symbolCounts.get(nextSymbol) || 0) + 1);
              symbol = nextSymbol;
            } else {
              throw new Error(
                'Invalid level configuration: Not enough unique symbols for required matches.'
              );
            }
          }
  
          return {
            id: Math.random(),
            img: symbol,
            matched: false,
            type: index,
          };
        }
      );
  
      return matchingCards;
    });
  
    initialCards = initialCards.sort(() => Math.random() - 0.5);
  
    return initialCards;
  };
  

  

  
  
  const [cards, setCards] = useState(generateRandomCards(levelConfig?.numberOfCards || 12));

  const [flippedCount, setFlippedCount] = useState(0);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [checkingForMatch, setCheckingForMatch] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [timer, setTimer] = useState(gameDuration); // Initialize with gameDuration

  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [userId, setUserId] = useState(""); // State to store user ID
  const [showGiveUpPopup, setShowGiveUpPopup] = useState(false);
  const [coins, setCoins] = useState(0); // State to store user's coins

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    setUserId(storedUserId);

    const fetchCoinBalance = async () => {
      try {
        const coinBalanceResponse = await fetch(
          `http://localhost:8888/game/getUserCoins.php?userId=${storedUserId}`
        );

        if (!coinBalanceResponse.ok) {
          console.error(`HTTP error! Status: ${coinBalanceResponse.status}`);
          console.log('Response text:', await coinBalanceResponse.text());
          return;
        }

        const coinBalanceResult = await coinBalanceResponse.json();

        if (coinBalanceResult.success) {
          setCoins(coinBalanceResult.coins);
        } else {
          console.error('Failed to fetch coin balance:', coinBalanceResult.message);
        }
      } catch (error) {
        console.error('Error fetching coin balance:', error);
      }
    };

    if (storedUserId) {
      fetchCoinBalance();
    }
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
        if (prevTimer <= 0) {
          setGameOver(true);
          clearInterval(intervalId);
          return 0; 
        }
        if (gameCompleted) {
          clearInterval(intervalId);
          return prevTimer;
        }
        return prevTimer - 1; 
      });
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [timer, gameDuration, gameCompleted]);
  

  useEffect(() => {
    if (cards.filter((card) => card.matched).length === cards.length) {
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
  const handleRetry = () => {
    setTimer(gameDuration); // Reset the timer to the initial game duration
    resetGame(); // Reset the game after setting the timer
    setShowGiveUpPopup(false); // Hide the "Give Up" popup
  };
  const resetGame = () => {
    setCards(generateRandomCards());
    setFlippedCount(0);
    setFlippedIndexes([]);
    setCheckingForMatch(false);
    setHintUsed(false);
    setGameOver(false);
    setGameCompleted(false);
    setShowGiveUpPopup(false); // Hide the "Give Up" popup on reset
    
    // Reset the timer to the initial game duration
    setTimer(gameDuration);
  };

  const useHint = async () => {
    if (!hintUsed) {
      try {
        // Check if the user has enough coins
        if (coins > 0) {
          // Deduct coins from the database
          const url = 'http://localhost:8888/game/deductCoinsForHint.php';
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
  
            // Update user's coin balance after using hint
            const updatedCoinsResponse = await fetch(
              `http://localhost:8888/game/getUserCoins.php?userId=${userId}`
            );
  
            if (updatedCoinsResponse.ok) {
              const updatedCoinsResult = await updatedCoinsResponse.json();
              if (updatedCoinsResult.success) {
                // Update user's coin balance in state
                setCoins(updatedCoinsResult.coins);
              } else {
                console.error('Failed to fetch updated coin balance:', updatedCoinsResult.message);
              }
            } else {
              console.error(`HTTP error! Status: ${updatedCoinsResponse.status}`);
              console.log('Response text:', await updatedCoinsResponse.text());
            }
          } else {
            console.error('Failed to deduct coins:', result.message);
          }
        } else {
          // User doesn't have enough coins
          console.log('User has 0 coins. Cannot use hint.');
  
          // Display insufficient coins message
          setInsufficientCoins(true);
  
          // Hide the message after a few seconds (e.g., 3 seconds)
          setTimeout(() => {
            setInsufficientCoins(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleGameCompletion = async () => {
    try {
      if (!levelNumber) {
        console.error('Invalid level number:', levelNumber);
        return;
      }
  
      const level = levels[levelNumber];
      if (!level) {
        console.error('Invalid level:', levelNumber);
        return;
      }
  
      const score = calculateScore(level.gameDuration, timer);
      console.log('Score:', score);
  
      const coinsEarned = level.reward; // Get the reward for the level
  
      const saveScoreUrl = 'http://localhost:8888/game/saveScore.php';
      const response = await fetch(saveScoreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&level=${levelNumber}&score=${score}&coinsEarned=${coinsEarned}`, // Include coinsEarned in the body
        credentials: 'include',
        mode: 'cors',
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        console.log('Response text:', await response.text());
        return;
      }
  
      const responseText = await response.text();
      console.log('Response text:', responseText);
  
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('Error parsing response JSON:', error.message);
        return;
      }
  
      console.log('Result from server:', result);
  
      if (!result.success) {
        console.error('Failed to save score:', result.message);
        return;
      }
  
      console.log(`Score for level ${levelNumber} saved successfully`);
  
      setCoins((prevCoins) => prevCoins + coinsEarned); // Update user's coin balance
  
      navigate('/levels');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const calculateScore = (hintsUsed, timeTaken, cardsFlipped) => {
    const hintWeight = 10; 
    const timeWeight = 1;
    const cardWeight = 5; 
  
    const hintScore = hintsUsed * hintWeight || 0;
    const timeScore = timeTaken * timeWeight || 0; 
    const cardScore = cardsFlipped * cardWeight || 0; 
  
    const totalScore = hintScore + timeScore + cardScore;
  
    return totalScore;
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
      {showGiveUpPopup && (
        <div className="blur">
          <div className="popup">
            <p>Press Play Again to Retry</p>
            <button onClick={handleRetry}>Retry</button>
          </div>
        </div>
      )}

{gameCompleted && (
  <div className="victory-overlay">
    <div className="blur">
      <div className="victory-popup">
        <p>Congratulations!</p>
        <p>You finished the game in {formatTime(timer)}</p>
        <button onClick={handleGameCompletion}>Save Score</button>
        <button onClick={() => alert('Redirecting to Levels')}>Go to Levels Page</button>
        <div className="coin-rain-container">
          <div className="coin"></div>
          <div className="coin"></div>
          <div className="coin"></div>
          <div className="coin"></div>
          <div className="coin"></div>
          <div className="coin"></div>
          <div className="coin"></div>
          <div className="coin"></div>
          <div className="coin"></div>
        </div>
      </div>
    </div>
  </div>
)}




      {insufficientCoins && (
        <div className="corner-alert">
          <p className="alert-message">Insufficient coins. Earn more to use hints</p>
        </div>
      )}
      <div className="game-buttons">
        <button onClick={useHint} disabled={hintUsed}>
          HINT
        </button>
        <div className="timer-container">{formatTime(timer)}</div>
        <button onClick={() => setShowGiveUpPopup(true)}>GIVE UP</button>
        
      </div>

      <div className="card-container">
        <div className="card-container-80">
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
        {/* {type === 0 && <div className="icon">&#x2665;</div>}
        {type === 1 && <div className="icon">&#x2660;</div>}
        {type === 2 && <div className="icon">&#x2666;</div>}
        {type === 3 && <div className="icon">&#x2663;</div>}
        {type === 4 && <div className="icon">&#x2665;</div>} */}
      </div>
      <div className="bottom-right">
        {/* {type === 0 && <div className="icon">&#x2665;</div>}
        {type === 1 && <div className="icon">&#x2660;</div>}
        {type === 2 && <div className="icon">&#x2666;</div>}
        {type === 3 && <div className="icon">&#x2663;</div>}
        {type === 4 && <div className="icon">&#x2665;</div>} */}
      </div>
    </div>
  );
};

export default Game;
