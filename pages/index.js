'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [quizType, setQuizType] = useState('regex');

  return (
    <div className="home">
      <header className="home-header">
        <h1>Programming Quiz Challenge</h1>
        <p>Test your programming skills with challenges of varying difficulty!</p>
      </header>

      <div className="quiz-type-selection">
        <h2>Choose Your Quiz Type</h2>
        <div className="quiz-type-buttons">
          <button
            className={`quiz-type-btn ${quizType === 'regex' ? 'active' : ''}`}
            onClick={() => setQuizType('regex')}
          >
            Regex
          </button>
          <button
            className={`quiz-type-btn ${quizType === 'postgresql' ? 'active' : ''}`}
            onClick={() => setQuizType('postgresql')}
          >
            PostgreSQL
          </button>
        </div>
      </div>

      <div className="difficulty-selection">
        <h2>Choose Your Challenge Level</h2>

        <div className="difficulty-cards">
          <Link href={`/quiz/${quizType}/easy`} className="difficulty-card easy">
            <h3>Easy</h3>
            <p>
              {quizType === 'regex'
                ? 'Basic regex patterns and character classes'
                : 'Basic SELECT queries and simple WHERE clauses'}
            </p>
            <span className="challenge-count">5 challenges</span>
          </Link>

          <Link href={`/quiz/${quizType}/medium`} className="difficulty-card medium">
            <h3>Medium</h3>
            <p>
              {quizType === 'regex'
                ? 'Quantifiers, word boundaries, and common patterns'
                : 'JOINs, GROUP BY, and aggregate functions'}
            </p>
            <span className="challenge-count">5 challenges</span>
          </Link>

          <Link href={`/quiz/${quizType}/hard`} className="difficulty-card hard">
            <h3>Hard</h3>
            <p>
              {quizType === 'regex'
                ? 'Advanced patterns, lookaheads, and complex matching'
                : 'Subqueries, CTEs, and window functions'}
            </p>
            <span className="challenge-count">5 challenges</span>
          </Link>
        </div>
      </div>

      <div className="instructions">
        <h3>How to Play</h3>
        <ul>
          <li>Choose a quiz type above (Regex or PostgreSQL)</li>
          <li>Select a difficulty level</li>
          <li>Write {quizType === 'regex' ? 'regex patterns' : 'SQL queries'} to solve the challenges</li>
          <li>Get instant feedback and hints if needed</li>
          <li>Complete all challenges to see your score!</li>
        </ul>
      </div>
    </div>
  );
}
