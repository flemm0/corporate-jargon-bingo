import React, { useEffect, useState } from 'react';
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
}


export default function App() {
  return (
    <>
      <h1>Corporate Lingo<br></br>Bingo</h1>
      <BingoHeader />
      <Board size={size} />
    </>
  );
}
