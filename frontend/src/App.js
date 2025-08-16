import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import GamePage from './components/GamePage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

// Simple wrapper to persist player info in localStorage
const App = () => {
  const [player, setPlayer] = useState(() => {
    const stored = localStorage.getItem('player');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (player) {
      localStorage.setItem('player', JSON.stringify(player));
    }
  }, [player]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('admin', JSON.stringify(admin));
    }
  }, [admin]);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <Routes>
        <Route
          path="/"
          element={
            admin ? <Navigate to="/admin" replace /> :
            player ? <Navigate to="/game" replace /> : 
            <SignUp onSignedUp={setPlayer} />
          }
        />
        <Route
          path="/admin"
          element={
            admin ? <AdminPanel admin={admin} onLogout={() => setAdmin(null)} /> :
            <AdminLogin onAdminLogin={setAdmin} />
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