import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { unmountComponentAtNode } from 'react-dom';



const size = 5;

const corporatePhrases = [
  "above my paygrade",
  "alignment",
  "action item",
  "back burner",
  "bandwidth",
  "break down silos",
  "buy-in",
  "churn",
  "core competencies",
  "deep dive",
  "disrupt",
  "deliverable",
  "drill down",
  "ducks in a row",
  "dumpster fire",
  "EOD",
  "flesh out",
  "go to market",
  "hard stop",
  "in the weeds",
  "circle back",
  "low hanging fruit",
  "move the needle",
  "take this offline",
  "ping",
  "pivot",
  "sidebar",
  "slide deck",
  "touch base",
  "trim the fat"
];


function BingoHeader() {
  return (
    <div class="bingoHeader">
        <span>B</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
        <span>O</span>
    </div>
  );
}


function Timer() {
  const [timer, setTimer] = useState("00:00:00");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const startTime = useRef(null);
  const elapsedTime = useRef(0);
  const intervalRef = useRef(null);


  useEffect(() => {
    if (isActive && !isPaused) {
      startTime.current = Date.now() - elapsedTime.current;
      intervalRef.current = setInterval(updateTimer, 1000);
    } else if (isPaused) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  const updateTimer = () => {
    const now = Date.now();
    const total = now - startTime.current;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60));

    setTimer(
      (hours > 9 ? hours : "0" + hours) + ":" +
      (minutes > 9 ? minutes : "0" + minutes) + ":" +
      (seconds > 9 ? seconds : "0" + seconds)
    );
  };

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPaused(false);
    } else if (isPaused) {
      startTime.current = Date.now() - elapsedTime.current;
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (isActive && !isPaused) {
      elapsedTime.current = Date.now() - startTime.current;
      setIsPaused(true);
    }
  };

  const handleReset = () => {
    setTimer("00:00:00");
    setIsActive(false);
    setIsPaused(false);
    elapsedTime.current = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <>
      <div className="timer">{timer}</div>
      <div className="timer-button-group">
        <button onClick={handleStart} disabled={isActive && !isPaused}>{isActive ? "Resume" : "Start"}</button>
        <button onClick={handlePause} disabled={!isActive || isPaused}>Pause</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
}



function Square({ value, clickedByDefault, onClick }) {
  const [clicked, setClicked] = useState(clickedByDefault);

  useEffect(() => {
    setClicked(clickedByDefault)
  }, [clickedByDefault]);

  function handleClick() {
    setClicked(!clicked);
    onClick();
  }

  return (
    <button
      className={`square ${clicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}


function Board({ size }) {
  const [squares, setSquares] = useState([]);
  const win = calculateWinner(squares, size);
  let status;
  if (win) {
    status = "You Win!"
  }
  
  useEffect(() => {
    const totalSquares = size * size;
    const middleIndex = Math.floor(totalSquares / 2);
    const shuffledPhrases = [...corporatePhrases].sort(() => 0.5 - Math.random());
    const newSquares = Array(totalSquares).fill(null).map((_, i) => {
      if (i === middleIndex && size % 2 !== 0) {
        return { value: "FREE", clicked: true }; // Ensure `clicked` is true for the middle square
      }
      return { value: shuffledPhrases.pop(), clicked: false };
    });

    setSquares(newSquares);
  }, [size]);

  const handleClick = (i) => {
    setSquares(prevSquares => {
      const newSquares = [...prevSquares];
      newSquares[i] = {
        ...newSquares[i],
        clicked: !newSquares[i].clicked, // Toggle clicked status
      };
      calculateWinner(newSquares, size);
      return newSquares;
    });
  };

  const renderSquare = (i) => {
    // const isMiddle = i === Math.floor(size * size / 2);
    return (
      <Square
        key={i}
        value={squares[i]?.value}
        clickedByDefault={squares[i]?.clicked}
        onClick={() => handleClick(i)}
      />
    );
  };
  
  const createBoard = () => {
    let board = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(renderSquare(i * size + j));
      }
      board.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return board;
  };

  return (
    <div className="board-container">
      <div className="status-overlay">{status}</div>
      <div className="board">{createBoard()}</div>
    </div>
  );
}


function calculateWinner(squares, size) {
  const isLineComplete = (indices) =>
    indices.every(index => squares[index]?.clicked);

  // Check rows
  for (let i = 0; i < size; i++) {
    const rowIndices = Array.from({ length: size }, (_, j) => i * size + j);
    if (isLineComplete(rowIndices)) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < size; i++) {
    const colIndices = Array.from({ length: size }, (_, j) => j * size + i);
    if (isLineComplete(colIndices)) {
      return true;
    }
  }

  // Check diagonals
  const diag1Indices = Array.from({ length: size }, (_, i) => i * size + i);
  const diag2Indices = Array.from({ length: size }, (_, i) => (i + 1) * size - i - 1);
  if (isLineComplete(diag1Indices) || isLineComplete(diag2Indices)) {
    return true;
  }
}


export default function App() {
  return (
    <>
      <h1>Corporate Lingo<br></br>Bingo</h1>
      <Timer />
      <BingoHeader />
      <Board size={size} />
    </>
  );
}
