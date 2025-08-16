import React, { useState } from 'react';

const AdminLogin = ({ onAdminLogin }) => {
  const [adminName, setAdminName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminName.trim() === 'GameAdmin-Nick') {
      onAdminLogin({ name: adminName, role: 'admin' });
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="card tech-border" style={{ maxWidth: 500, margin: '4rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          🔐 Admin Access
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Game administration panel
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)' 
          }}>
            Admin Name
          </label>
          <input
            type="text"
            placeholder="Enter admin name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
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
          className="btn"
          style={{ width: '100%', fontSize: '1rem', padding: '1rem' }}
        >
          🚀 Access Admin Panel
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
          🔑 Admin: GameAdmin-Nick • 🎮 Game Controls • 💰 Tab Management
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
