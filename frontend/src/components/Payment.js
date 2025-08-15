import React, { useEffect, useState } from 'react';

const Payment = ({ player }) => {
  const [balance, setBalance] = useState(0);
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
      
      <div style={{ textAlign: 'center' }}>
        <a 
          href="https://buy.stripe.com/fZucN7c9UfHR8wL45P1VK00"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ 
            fontSize: '1.1rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          🚀 Pay & Add to Tab
        </a>
        <p style={{ 
          margin: '1rem 0 0 0', 
          color: 'var(--text-secondary)', 
          fontSize: '0.875rem' 
        }}>
          Click above to pay through Stripe. Your balance will update automatically!
        </p>
      </div>
      
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