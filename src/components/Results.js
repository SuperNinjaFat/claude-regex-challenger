import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const { score, total, difficulty, quizType, answers, questionStatus } = location.state || {};

  if (!location.state) {
    return (
      <div className="results">
        <h2>No quiz data found</h2>
        <Link to="/" className="home-link">Return to Home</Link>
      </div>
    );
  }

  // Calculate total attempts (including re-submissions)
  const totalAttempts = answers ? answers.length : total;
  // Score is based on questions answered correctly on first attempt
  const percentage = Math.round((score / total) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A', message: 'Excellent!' };
    if (percentage >= 80) return { grade: 'B', message: 'Good job!' };
    if (percentage >= 70) return { grade: 'C', message: 'Not bad!' };
    if (percentage >= 60) return { grade: 'D', message: 'Keep practicing!' };
    return { grade: 'F', message: 'More practice needed!' };
  };

  const { grade, message } = getGrade();

  return (
    <div className="results">
      <div className="results-header">
        <h2>Quiz Complete!</h2>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}/{total}</span>
            <span className="percentage">{percentage}%</span>
          </div>
          <div className="grade">
            <span className="grade-letter">{grade}</span>
            <span className="grade-message">{message}</span>
          </div>
        </div>
        <p className="difficulty-completed">
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Completed
          {totalAttempts > total && <span> ({total} questions, {totalAttempts} total attempts)</span>}
        </p>
      </div>

      <div className="detailed-results">
        <h3>Question Review</h3>
        <div className="answers-review">
          {answers.map((answer, index) => (
            <div key={index} className={`answer-item ${answer.correct ? 'correct' : 'incorrect'}`}>
              <div className="question-number">
                Q{answer.questionNumber}
                {answer.attemptNumber > 1 && <span className="attempt-badge">Attempt {answer.attemptNumber}</span>}
              </div>
              <div className="answer-content">
                <h4>{answer.question}</h4>
                <div className="answer-comparison">
                  <div className="user-answer">
                    <label>Your answer:</label>
                    <code>/{answer.userAnswer}/</code>
                  </div>
                  <div className="correct-answer">
                    <label>Correct answer:</label>
                    <code>/{answer.correctAnswer}/</code>
                  </div>
                </div>
                <div className="result-indicator">
                  {answer.correct ? '✓ Correct' : '✗ Incorrect'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="results-actions">
        <Link to="/" className="home-link">
          Return to Home
        </Link>

        <div className="retry-options">
          <Link to={`/quiz/${quizType}/${difficulty}`} className="retry-link">
            Retry {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Link>

          {difficulty === 'easy' && (
            <Link to={`/quiz/${quizType}/medium`} className="next-level-link">
              Try Medium Level
            </Link>
          )}

          {difficulty === 'medium' && (
            <Link to={`/quiz/${quizType}/hard`} className="next-level-link">
              Try Hard Level
            </Link>
          )}
        </div>
      </div>

      <div className="learning-resources">
        <h3>Want to Learn More?</h3>
        <p>Check out these resources to improve your regex skills:</p>
        <ul>
          <li><a href="https://regexr.com/" target="_blank" rel="noopener noreferrer">RegExr - Interactive regex tester</a></li>
          <li><a href="https://regex101.com/" target="_blank" rel="noopener noreferrer">Regex101 - Online regex debugger</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank" rel="noopener noreferrer">MDN Regular Expressions Guide</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Results;