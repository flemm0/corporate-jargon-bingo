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


function Square({ value, clickedByDefault }) {
  const [clicked, setClicked] = useState(clickedByDefault);

  function handleClick() {
    setClicked(!clicked);
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


function Board({ size, clickedByDefault }) {
  const [squares, setSquares] = useState([]);
  
  useEffect(() => {
    const totalSquares = size * size;
    const middleIndex = Math.floor(totalSquares / 2);
    const shuffledPhrases = [...corporatePhrases].sort(() => 0.5 - Math.random());
    const newSquares = Array(totalSquares).fill(null);

    for (let i = 0, j = 0; i < totalSquares; i++) {
      if (i === middleIndex && size % 2 !== 0) {
        newSquares[i] = "FREE";
      } else {
        newSquares[i] = shuffledPhrases[j];
        j++;
      }
    }

    setSquares(newSquares);
  }, [size]);

  const handleClick = (i) => {
    // Handle click event if needed
  };

  const renderSquare = (i) => {
    const isMiddle = i === Math.floor(size * size / 2);
    return (
      <Square
        key={i}
        value={squares[i]}
        clickedByDefault={isMiddle}
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
  
  return <div className="board">{createBoard()}</div>;
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
