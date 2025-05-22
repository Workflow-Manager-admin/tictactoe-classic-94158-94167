import React, { useState } from 'react';
import './App.css';

/**
 * Main Container for TicTacToe Classic (Classic Two-Player Version)
 * Board: 3x3 grid, 'X' and 'O' turn alternates. 
 * Winner: first to make a line of 3 in a row, col, or diagonal.
 */

// Helper: returns winning info (array of winning indices or null)
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// Board square component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="tictactoe-square"
      style={highlight ? { background: 'var(--kavia-orange)', color: '#fff', fontWeight: 600 } : undefined}
      onClick={onClick}
      data-testid="square"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function TicTacToeClassic() {
  /**
   * The primary container implementing classic two-player TicTacToe.
   * Handles game state, rendering, control logic.
   */
  const initialState = Array(9).fill(null);
  const [squares, setSquares] = useState(initialState);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([initialState]); // allow undo
  const [stepNumber, setStepNumber] = useState(0);

  // Determine winner
  const winInfo = calculateWinner(squares);
  const isDraw = !winInfo && squares.every(Boolean);

  // Handler for a square being clicked
  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (squares[i] || winInfo) return; // Ignore if filled or game over
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setHistory([...history.slice(0, stepNumber + 1), nextSquares]);
    setStepNumber(stepNumber + 1);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(initialState);
    setXIsNext(true);
    setHistory([initialState]);
    setStepNumber(0);
  }

  // PUBLIC_INTERFACE
  function jumpTo(move) {
    setStepNumber(move);
    setSquares(history[move]);
    setXIsNext(move % 2 === 0);
  }

  // Status message
  let status;
  if (winInfo) {
    status = `Winner: ${winInfo.winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next Player: ${xIsNext ? 'X' : 'O'}`;
  }

  // Moves history (simple undo, for UX)
  const moves = history.map((step, move) => (
    <button
      key={move}
      className="btn"
      style={{marginBottom: 8, padding: '4px 10px', fontSize: '0.95rem'}}
      onClick={() => jumpTo(move)}
      disabled={move === stepNumber}
      data-testid={`move-btn-${move}`}
    >
      {move === 0 ? 'Go to game start' : `Go to move #${move}`}
    </button>
  ));

  // Board render
  function renderSquare(i) {
    let highlight = winInfo && winInfo.line.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => handleClick(i)}
        highlight={highlight}
      />
    );
  }

  // Add basic styles if not already in App.css
  // Ideally, these would go to App.css, but included below for completeness.
  // .tictactoe-board, .tictactoe-square, etc.

  return (
    <div className="container" style={{marginTop: 32}}>
      <div className="tictactoe-main">
        <h2 className="title" style={{fontSize: '2.1rem', marginBottom: 8, marginTop: 0}}>
          TicTacToe Classic
        </h2>
        <div className="description" style={{marginBottom: 8}}>
          Play classic two-player TicTacToe.<br/>
          {status}
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'start', gap: 40, flexWrap: 'wrap'}}>
          {/* Main Board */}
          <div
            className="tictactoe-board"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 60px)',
              gridTemplateRows: 'repeat(3, 60px)',
              gap: '6px',
              background: 'var(--kavia-dark)',
              borderRadius: 8,
              padding: 10,
              border: '2.5px solid var(--kavia-orange)',
            }}
          >
            {Array(9).fill(0).map((_, i) => renderSquare(i))}
          </div>
          {/* Controls */}
          <div style={{minWidth: 180, marginTop: 6}}>
            <div>
              <button
                onClick={handleRestart}
                className="btn btn-large"
                data-testid="restart-btn"
                style={{marginBottom: 16, width: 120}}
              >
                Restart Game
              </button>
            </div>
            <div style={{marginBottom: 10, fontWeight: 500, color:'var(--kavia-orange)'}}>Moves:</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
              {moves}
            </div>
          </div>
        </div>
        <div style={{marginTop: 26, color: 'var(--text-secondary)', fontSize: '.98rem'}}>
          <span>Players take turns; X always starts.</span>
        </div>
      </div>
      <style>{`
        .tictactoe-square {
          width: 60px;
          height: 60px;
          background: var(--kavia-dark);
          border: 2.5px solid var(--border-color);
          color: var(--kavia-orange);
          font-size: 2.2rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 6px;
          outline: none;
          user-select: none;
        }
        .tictactoe-square:hover {
          background: #272727;
        }
        .tictactoe-board {
          margin-bottom: 8px;
        }
        .tictactoe-main {
          background: rgba(45,45,45,0.83);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.21);
          max-width: 480px;
          margin: 0 auto;
        }
        @media (max-width: 600px) {
          .tictactoe-main {
            padding: 10px;
          }
          .tictactoe-board {
            grid-template-columns: repeat(3, 40px) !important;
            grid-template-rows: repeat(3, 40px) !important;
          }
          .tictactoe-square {
            width: 40px !important;
            height: 40px !important;
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default TicTacToeClassic;
