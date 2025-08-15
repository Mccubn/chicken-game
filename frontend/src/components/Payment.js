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
      const res = await axios.post('/api/deposit', { 
        amount: amt,
        playerId: player.id 
      });
      
      if (res.data.url) {
        // Redirect user to Stripe checkout
        window.location.href = res.data.url;
      } else {
        setError('No checkout URL received');
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
        
        {/* Manual Balance Update */}
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '1rem',
            color: 'var(--text-primary)'
          }}>
            🔄 Manual Update
          </h4>
          <p style={{ 
            margin: '0 0 0.75rem 0', 
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            After paying via Stripe, manually update the balance here
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              step="0.01"
              placeholder="Amount paid"
              className="input"
              style={{ flex: 1, margin: 0, fontSize: '0.8rem', padding: '0.5rem' }}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button 
              onClick={handleDeposit}
              disabled={loading || !amount}
              className="btn"
              style={{ 
                fontSize: '0.8rem',
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, var(--accent), #0891b2)'
              }}
            >
              Update
            </button>
          </div>
        </div>
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
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn"
            style={{ 
              flex: 1,
              background: 'linear-gradient(135deg, var(--success), #059669)'
            }}
          >
            {loading ? (
              <span className="loading-dots">Processing</span>
            ) : (
              '💳 Add to Tab'
            )}
          </button>
          
          <a 
            href="https://buy.stripe.com/fZucN7c9UfHR8wL45P1VK00"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ 
              flex: 1,
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            🚀 Quick Pay
          </a>
        </div>
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