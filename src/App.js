import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:quizType/:difficulty" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;