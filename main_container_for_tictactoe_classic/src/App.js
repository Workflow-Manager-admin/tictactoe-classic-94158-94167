import React from 'react';
import './App.css';
import TicTacToeClassic from './TicTacToeClassic';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <a href="https://en.wikipedia.org/wiki/Tic-tac-toe" target="_blank" rel="noopener noreferrer" aria-label="About TicTacToe">
              <button className="btn">About TicTacToe</button>
            </a>
          </div>
        </div>
      </nav>

      <main style={{paddingTop: 100}}>
        <TicTacToeClassic />
      </main>
    </div>
  );
}

export default App;