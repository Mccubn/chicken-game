import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import GamePage from './components/GamePage';

// Simple wrapper to persist player info in localStorage
const App = () => {
  const [player, setPlayer] = useState(() => {
    const stored = localStorage.getItem('player');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (player) {
      localStorage.setItem('player', JSON.stringify(player));
    }
  }, [player]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <Routes>
        <Route
          path="/"
          element={
            player ? <Navigate to="/game" replace /> : <SignUp onSignedUp={setPlayer} />
          }
        />
        <Route
          path="/game"
          element={player ? <GamePage player={player} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;