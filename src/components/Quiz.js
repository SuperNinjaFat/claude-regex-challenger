import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { regexChallenges, postgresqlChallenges } from '../data/challenges';

function Quiz() {
  const { quizType, difficulty } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);

  const allChallenges = quizType === 'regex' ? regexChallenges : postgresqlChallenges;
  const challenges = allChallenges[difficulty] || [];
  const challenge = challenges[currentQuestion];

  useEffect(() => {
    if (!challenge) {
      navigate('/results', { state: { score, total: challenges.length, difficulty, answers } });
    }
  }, [challenge, navigate, score, challenges.length, difficulty, answers]);

  const testRegex = (pattern, testString) => {
    try {
      const regex = new RegExp(pattern, 'g');
      return regex.test(testString);
    } catch (error) {
      return false;
    }
  };

  const getMatches = (pattern, testString) => {
    try {
      const regex = new RegExp(pattern, 'g');
      return testString.match(regex) || [];
    } catch (error) {
      return [];
    }
  };

  const normalizeSql = (sql) => {
    return sql
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/\s*;\s*$/, '')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*=\s*/g, '=')
      .replace(/\s*>\s*/g, '>')
      .replace(/\s*<\s*/g, '<');
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      setFeedback(quizType === 'regex' ? 'Please enter a regex pattern' : 'Please enter a SQL query');
      setIsCorrect(false);
      return;
    }

    let isAnswerCorrect;

    if (quizType === 'regex') {
      const userMatches = getMatches(userAnswer, challenge.testString);
      const correctMatches = getMatches(challenge.correctAnswer, challenge.testString);

      isAnswerCorrect = userMatches.length > 0 &&
                       userMatches.length === correctMatches.length &&
                       userMatches.every(match => correctMatches.includes(match));

      if (!isAnswerCorrect) {
        setFeedback(`Incorrect. Your pattern matched: ${userMatches.join(', ') || 'nothing'}`);
      }
    } else {
      // PostgreSQL quiz - normalize and compare SQL queries
      const normalizedUserAnswer = normalizeSql(userAnswer);
      const normalizedCorrectAnswer = normalizeSql(challenge.correctAnswer);

      isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

      if (!isAnswerCorrect) {
        setFeedback(`Incorrect. Try again! Expected something like: ${challenge.correctAnswer}`);
      }
    }

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setFeedback('Correct! Well done!');
      setScore(score + 1);
    }

    setAnswers([...answers, {
      question: challenge.question,
      userAnswer,
      correctAnswer: challenge.correctAnswer,
      correct: isAnswerCorrect
    }]);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setUserAnswer('');
    setFeedback('');
    setShowHint(false);
    setIsCorrect(null);
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <h2>{quizType === 'regex' ? 'Regex' : 'PostgreSQL'} Quiz - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
        <div className="progress">
          Question {currentQuestion + 1} of {challenges.length}
        </div>
        <div className="score">Score: {score}/{challenges.length}</div>
      </div>

      <div className="question-card">
        <h3>{challenge.question}</h3>
        <p className="description">{challenge.description}</p>

        <div className="test-string">
          <label>{quizType === 'regex' ? 'Test String:' : 'Tables:'}</label>
          <code>"{challenge.testString}"</code>
        </div>

        <div className="answer-input">
          <label htmlFor="regex-input">{quizType === 'regex' ? 'Your Regex Pattern:' : 'Your SQL Query:'}</label>
          {quizType === 'regex' ? (
            <div className="input-wrapper">
              <span className="regex-delim">/</span>
              <input
                id="regex-input"
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your regex pattern here..."
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
              <span className="regex-delim">/g</span>
            </div>
          ) : (
            <textarea
              id="sql-input"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your SQL query here..."
              rows="4"
              onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && checkAnswer()}
            />
          )}
        </div>

        {feedback && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {feedback}
          </div>
        )}

        <div className="quiz-actions">
          <button onClick={checkAnswer} disabled={!userAnswer.trim()}>
            Check Answer
          </button>
          
          <button onClick={() => setShowHint(!showHint)} className="hint-btn">
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>

          {isCorrect !== null && (
            <button onClick={nextQuestion} className="next-btn">
              {currentQuestion + 1 === challenges.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </div>

        {showHint && (
          <div className="hints">
            <h4>Hints:</h4>
            <ul>
              {challenge.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {userAnswer && quizType === 'regex' && (
          <div className="live-test">
            <h4>Live Test:</h4>
            <p>Your pattern matches: <strong>{getMatches(userAnswer, challenge.testString).join(', ') || 'nothing'}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;