import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ admin, onLogout }) => {
  const [tabTotal, setTabTotal] = useState(0);
  const [newTabAmount, setNewTabAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTabTotal();
    fetchExpenses();
  }, []);

  const fetchTabTotal = async () => {
    try {
      const res = await axios.get('/api/balance');
      setTabTotal(res.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const setTabAmount = async (e) => {
    e.preventDefault();
    if (!newTabAmount || newTabAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/set-tab', { amount: parseFloat(newTabAmount) });
      // Update local state with the response from server
      setTabTotal(response.data.balance);
      setNewTabAmount('');
      setMessage('Tab total updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating tab total:', error);
      setMessage('Error updating tab total');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!expenseAmount || expenseAmount <= 0 || !expenseDescription.trim()) {
      setMessage('Please enter both amount and description');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/expenses', {
        amount: parseFloat(expenseAmount),
        description: expenseDescription.trim(),
        playerName: admin.name
      });
      
      // Update local state
      const newExpense = {
        id: Date.now(),
        amount: parseFloat(expenseAmount),
        description: expenseDescription.trim(),
        playerName: admin.name,
        timestamp: new Date().toISOString()
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      setTabTotal(prev => prev - parseFloat(expenseAmount));
      
      setExpenseAmount('');
      setExpenseDescription('');
      setMessage('Expense added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding expense');
    } finally {
      setLoading(false);
    }
  };

  const resetGame = async () => {
    if (!window.confirm('Are you sure you want to reset the game? This will clear all data.')) {
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/reset-game');
      setTabTotal(0);
      setExpenses([]);
      setMessage('Game reset successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error resetting game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '2rem',
      background: 'var(--surface)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        borderRadius: '16px',
        color: 'white'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>🔐 Admin Panel</h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Welcome, {admin.name} • Game Controls
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="btn btn-secondary"
          style={{ 
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white'
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Tab Management */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💰 Tab Management
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {/* Current Tab Display */}
          <div style={{ 
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            borderRadius: '12px',
            border: '1px solid #bbf7d0',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Current Tab Total
            </h3>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: 'var(--success)',
              marginBottom: '1rem'
            }}>
              ${tabTotal.toFixed(2)}
            </div>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem' 
            }}>
              Available for team expenses
            </p>
          </div>

          {/* Set Tab Amount */}
          <div style={{ 
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
            borderRadius: '12px',
            border: '1px solid #bae6fd'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Set New Tab Amount
            </h3>
            <form onSubmit={setTabAmount}>
              <input
                type="number"
                step="0.01"
                value={newTabAmount}
                onChange={(e) => setNewTabAmount(e.target.value)}
                placeholder="Enter new tab amount"
                className="input"
                style={{ marginBottom: '1rem' }}
              />
              <button 
                type="submit" 
                disabled={loading || !newTabAmount}
                className="btn"
                style={{ 
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))'
                }}
              >
                {loading ? 'Updating...' : '💰 Set Tab Amount'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Expense Tracking */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📝 Expense Tracking
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {/* Add Expense Form */}
          <div style={{ 
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            borderRadius: '12px',
            border: '1px solid #fcd34d'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Add New Expense
            </h3>
            <form onSubmit={addExpense}>
              <input
                type="number"
                step="0.01"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Amount spent"
                className="input"
                style={{ marginBottom: '1rem' }}
              />
              <input
                type="text"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="What was purchased?"
                className="input"
                style={{ marginBottom: '1rem' }}
              />
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

          {/* Expense Summary */}
          <div style={{ 
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
            borderRadius: '12px',
            border: '1px solid #c084fc'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Expense Summary
            </h3>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {expenses.length}
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Total expenses recorded
            </p>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📋 Recent Expenses
        </h2>
        
        {expenses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
            No expenses recorded yet
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {expenses.map((expense) => (
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

      {/* Game Controls */}
      <div className="card">
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎮 Game Controls
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={resetGame}
            disabled={loading}
            className="btn"
            style={{ 
              background: 'linear-gradient(135deg, var(--error), #dc2626)',
              padding: '1rem 2rem'
            }}
          >
            {loading ? 'Resetting...' : '🔄 Reset Game'}
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
            style={{ padding: '1rem 2rem' }}
          >
            🔄 Refresh Page
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{ 
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          padding: '1rem 1.5rem',
          background: message.includes('Error') ? 'var(--error)' : 'var(--success)',
          color: 'white',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
