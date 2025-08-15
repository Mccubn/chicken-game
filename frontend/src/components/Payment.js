import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payment = ({ player }) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBalance = async () => {
    try {
      const res = await axios.get('/api/balance');
      setBalance(res.data.balance);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Enter a valid amount');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await axios.post('/api/deposit', { amount: amt });
      if (res.data.url) {
        // redirect user to Stripe checkout
        window.location.href = res.data.url;
      } else {
        setSuccess('Deposit successful');
        fetchBalance();
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      borderTop: '1px solid var(--border)', 
      padding: '1.5rem',
      background: 'var(--surface)'
    }}>
      <div style={{ 
        padding: '1rem',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: '12px',
        border: '1px solid #bbf7d0',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💰 Shared Tab
        </h3>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: 'var(--success)',
          textAlign: 'center'
        }}>
          ${balance.toFixed(2)}
        </div>
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          color: 'var(--text-secondary)', 
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          Team balance for shared expenses
        </p>
      </div>
      
      <form onSubmit={handleDeposit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}>
            Deposit Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="input"
            style={{ margin: 0 }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="btn"
          style={{ 
            width: '100%',
            background: 'linear-gradient(135deg, var(--success), #059669)'
          }}
        >
          {loading ? (
            <span className="loading-dots">Processing</span>
          ) : (
            '💳 Add to Tab'
          )}
        </button>
      </form>
      
      {error && (
        <div style={{ 
          background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', 
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '0.75rem',
          marginTop: '1rem',
          color: 'var(--error)',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '0.75rem',
          marginTop: '1rem',
          color: 'var(--success)',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          ✅ {success}
        </div>
      )}
    </div>
  );
};

export default Payment;