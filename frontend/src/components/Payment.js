import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payment = ({ player }) => {
  const [balance, setBalance] = useState(0);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenses, setExpenses] = useState([]);
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
    fetchExpenses();
    const interval = setInterval(() => {
      fetchBalance();
      fetchExpenses();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!expenseAmount || expenseAmount <= 0 || !expenseDescription.trim()) {
      setError('Please enter both amount and description');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/expenses', {
        amount: parseFloat(expenseAmount),
        description: expenseDescription.trim(),
        playerName: player.name
      });
      
      // Update local state
      const newExpense = {
        id: Date.now(),
        amount: parseFloat(expenseAmount),
        description: expenseDescription.trim(),
        playerName: player.name,
        timestamp: new Date().toISOString()
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      setBalance(prev => prev - parseFloat(expenseAmount));
      
      setExpenseAmount('');
      setExpenseDescription('');
      setSuccess('Expense added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error adding expense');
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
      
      {/* Expense Tracking */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📝 Add Expense
        </h3>
        
        <form onSubmit={addExpense}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <input
              type="number"
              step="0.01"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="Amount spent"
              className="input"
            />
            <input
              type="text"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              placeholder="What was purchased?"
              className="input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !expenseAmount || !expenseDescription.trim()}
            className="btn"
            style={{ 
              width: '100%',
              background: 'linear-gradient(135deg, var(--warning), #d97706)'
            }}
          >
            {loading ? 'Adding...' : '📝 Add Expense'}
          </button>
        </form>
      </div>

      {/* Recent Expenses */}
      <div>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📋 Recent Expenses
        </h3>
        
        {expenses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            background: 'var(--surface-hover)',
            borderRadius: '12px'
          }}>
            No expenses recorded yet
          </div>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense.id} style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface-hover)',
                marginBottom: '0.5rem',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {expense.description}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    by {expense.playerName} • {new Date(expense.timestamp).toLocaleString()}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  color: 'var(--error)' 
                }}>
                  -${expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
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