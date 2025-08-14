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
    <div style={{ borderTop: '1px solid #ccc', padding: '1rem' }}>
      <h3>Shared Tab</h3>
      <p>Current balance: ${balance.toFixed(2)}</p>
      <form onSubmit={handleDeposit}>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          style={{ marginRight: '0.5rem', padding: '0.3rem' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Processing...' : 'Add to tab'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default Payment;