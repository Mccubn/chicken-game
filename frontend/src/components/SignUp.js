import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ onSignedUp }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    try {
      setLoading(true);
      setError('');
      console.log('Attempting to join with name:', name);
      console.log('API endpoint:', '/api/join');
      
      const res = await axios.post('/api/join', { name });
      console.log('Join successful:', res.data);
      onSignedUp(res.data);
    } catch (err) {
      console.error('Join error details:', err);
      console.error('Error response:', err?.response);
      console.error('Error message:', err?.message);
      setError(err?.response?.data?.message || err?.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card tech-border" style={{ maxWidth: 500, margin: '4rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          🐔 Chicken Game
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Join the ultimate chicken hunting adventure
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            Player Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            autoFocus
          />
        </div>
        
        {error && (
          <div style={{ 
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', 
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            color: 'var(--error)',
            fontSize: '0.875rem'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading} 
          className="btn"
          style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}
        >
          {loading ? (
            <span className="loading-dots">Joining</span>
          ) : (
            '🚀 Join Game'
          )}
        </button>
      </form>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        padding: '1rem',
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
        borderRadius: '12px',
        border: '1px solid #bae6fd'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          🎮 Real-time multiplayer • 📱 Cross-platform • 🏆 Leaderboards
        </p>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1rem',
        padding: '1rem',
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        borderRadius: '12px',
        border: '1px solid #fcd34d'
      }}>
        <p style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--text-secondary)', 
          fontSize: '0.875rem' 
        }}>
          🔐 Admin Access
        </p>
        <button 
          onClick={() => window.location.href = '/admin'}
          className="btn btn-secondary"
          style={{ 
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'var(--primary)'
          }}
        >
          🚪 Admin Panel
        </button>
      </div>
    </div>
  );
};

export default SignUp;