import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Regex Quiz Challenge</h1>
        <p>Test your regular expression skills with challenges of varying difficulty!</p>
      </header>
      
      <div className="difficulty-selection">
        <h2>Choose Your Challenge Level</h2>
        
        <div className="difficulty-cards">
          <Link to="/quiz/easy" className="difficulty-card easy">
            <h3>Easy</h3>
            <p>Basic regex patterns and character classes</p>
            <span className="challenge-count">5 challenges</span>
          </Link>
          
          <Link to="/quiz/medium" className="difficulty-card medium">
            <h3>Medium</h3>
            <p>Quantifiers, word boundaries, and common patterns</p>
            <span className="challenge-count">5 challenges</span>
          </Link>
          
          <Link to="/quiz/hard" className="difficulty-card hard">
            <h3>Hard</h3>
            <p>Advanced patterns, lookaheads, and complex matching</p>
            <span className="challenge-count">5 challenges</span>
          </Link>
        </div>
      </div>
      
      <div className="instructions">
        <h3>How to Play</h3>
        <ul>
          <li>Choose a difficulty level above</li>
          <li>Write regex patterns to match the given requirements</li>
          <li>Test your patterns against provided strings</li>
          <li>Get instant feedback and hints if needed</li>
          <li>Complete all challenges to see your score!</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;