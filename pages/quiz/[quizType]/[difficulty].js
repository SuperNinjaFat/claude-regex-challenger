'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { regexChallenges, postgresqlChallenges } from '../../../src/data/challenges';

// Utility function to compare SQL results
const compareResults = (result1, result2) => {
  if (result1.length !== result2.length) return false;

  // Compare results in order (important for ORDER BY queries)
  // But also check if they're equal when sorted (for queries without ORDER BY)
  const directMatch = JSON.stringify(result1) === JSON.stringify(result2);

  if (directMatch) return true;

  // If direct match fails, try sorted comparison (for unordered queries)
  const sortedResult1 = JSON.stringify([...result1].sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  ));
  const sortedResult2 = JSON.stringify([...result2].sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  ));

  return sortedResult1 === sortedResult2;
};

export default function Quiz() {
  const router = useRouter();
  const { quizType, difficulty } = router.query;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [questionStatus, setQuestionStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const allChallenges = quizType === 'regex' ? regexChallenges : postgresqlChallenges;
  const challenges = allChallenges && allChallenges[difficulty] ? allChallenges[difficulty] : [];
  const challenge = challenges[currentQuestion];

  useEffect(() => {
    if (!challenge && challenges.length > 0 && currentQuestion >= challenges.length) {
      // Store results in sessionStorage
      const resultsData = {
        score,
        total: challenges.length,
        difficulty,
        quizType,
        answers,
        questionStatus
      };
      sessionStorage.setItem('quizResults', JSON.stringify(resultsData));
      router.push('/results');
    }
  }, [challenge, currentQuestion, challenges.length, score, difficulty, quizType, answers, questionStatus, router]);

  const getMatches = (pattern, testString) => {
    try {
      const regex = new RegExp(pattern, 'g');
      return testString.match(regex) || [];
    } catch (error) {
      return [];
    }
  };

  // Execute SQL query with 1 second debounce (for PostgreSQL quizzes)
  useEffect(() => {
    if (quizType === 'postgresql' && userAnswer.trim() && challenge) {
      // Set loading state immediately
      setIsLoading(true);

      // Debounce the API call - wait 1 second after user stops typing
      const timeoutId = setTimeout(() => {
        fetch('/api/execute-sql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            setupSQL: challenge.setupSQL,
            userQuery: userAnswer
          })
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setSqlResult(result.data);
            setSqlError(null);
          } else {
            setSqlResult(null);
            setSqlError(result.error);
          }
          setIsLoading(false);
        })
        .catch(error => {
          setSqlError(error.message);
          setSqlResult(null);
          setIsLoading(false);
        });
      }, 1000); // 1 second delay

      // Cleanup function to cancel the timeout if user keeps typing
      return () => {
        clearTimeout(timeoutId);
        setIsLoading(false);
      };
    } else {
      setSqlResult(null);
      setSqlError(null);
      setIsLoading(false);
    }
  }, [userAnswer, quizType, challenge]);

  const checkAnswer = async () => {
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
      // PostgreSQL quiz - execute both queries and compare results via API
      try {
        setIsLoading(true);

        const [userResult, correctResult] = await Promise.all([
          fetch('/api/execute-sql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              setupSQL: challenge.setupSQL,
              userQuery: userAnswer
            })
          }).then(res => res.json()),
          fetch('/api/execute-sql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              setupSQL: challenge.setupSQL,
              userQuery: challenge.correctAnswer
            })
          }).then(res => res.json())
        ]);

        setIsLoading(false);

        if (!userResult.success) {
          setFeedback(`SQL Error: ${userResult.error}`);
          isAnswerCorrect = false;
        } else if (!correctResult.success) {
          setFeedback('Internal error: Could not execute expected query');
          isAnswerCorrect = false;
        } else {
          // Compare the results
          isAnswerCorrect = compareResults(userResult.data, correctResult.data);

          if (!isAnswerCorrect) {
            setFeedback(`Incorrect. Your query returned different results. Expected ${correctResult.data.length} rows, got ${userResult.data.length} rows.`);
          }
        }
      } catch (error) {
        setIsLoading(false);
        setFeedback(`Error: ${error.message}`);
        isAnswerCorrect = false;
      }
    }

    setIsCorrect(isAnswerCorrect);

    const questionNum = currentQuestion + 1;
    const attemptNumber = answers.filter(a => a.questionNumber === questionNum).length + 1;
    const isFirstAttempt = attemptNumber === 1;

    if (isAnswerCorrect) {
      setFeedback('Correct! Well done!');
      // Only increment score if this is the first attempt for this question
      if (isFirstAttempt && !questionStatus[questionNum]) {
        setScore(score + 1);
      }
      // Mark this question as having been answered correctly at some point
      setQuestionStatus({...questionStatus, [questionNum]: true});
    } else {
      // If this is the first incorrect attempt, mark question as failed
      if (isFirstAttempt) {
        setQuestionStatus({...questionStatus, [questionNum]: false});
      }
    }

    // Track each submission as a separate attempt
    setAnswers([...answers, {
      question: challenge.question,
      questionNumber: questionNum,
      userAnswer,
      correctAnswer: challenge.correctAnswer,
      correct: isAnswerCorrect,
      attemptNumber
    }]);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setUserAnswer('');
    setFeedback('');
    setShowHint(false);
    setIsCorrect(null);
    setSqlResult(null);
    setSqlError(null);
  };

  // Show loading while router query is being populated
  if (!router.isReady || !challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <h2>{quizType === 'regex' ? 'Regex' : 'PostgreSQL'} Quiz - {difficulty && difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
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
          <button onClick={checkAnswer} disabled={!userAnswer.trim() || isLoading}>
            {isLoading ? 'Checking...' : 'Check Answer'}
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

        {userAnswer && quizType === 'postgresql' && (
          <div className="live-test sql-analysis">
            <h4>Query Execution:</h4>

            {isLoading ? (
              <div>Loading...</div>
            ) : sqlError ? (
              <div className="analysis-section errors">
                <strong>Error:</strong>
                <div className="sql-error">{sqlError}</div>
              </div>
            ) : sqlResult ? (
              <>
                <div className="analysis-section">
                  <strong>Status:</strong>
                  <span className="status-badge valid">
                    ✓ Query executed successfully
                  </span>
                </div>

                <div className="analysis-section">
                  <strong>Results ({sqlResult.length} rows):</strong>
                  <div className="sql-results-table">
                    {sqlResult.length === 0 ? (
                      <p className="no-results">No rows returned</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            {Object.keys(sqlResult[0]).map((col, idx) => (
                              <th key={idx}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlResult.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {Object.values(row).map((val, colIdx) => (
                                <td key={colIdx}>
                                  {val === null ? <em>NULL</em> : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
