import React, { useState, useRef, useEffect } from 'react';

const Chat = ({ messages, sendMessage }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, var(--surface), var(--surface-hover))'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: 'var(--text-primary)', 
          fontSize: '1.25rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💬 Game Chat
        </h3>
        <p style={{ 
          margin: '0.25rem 0 0 0', 
          color: 'var(--text-secondary)', 
          fontSize: '0.875rem' 
        }}>
          Coordinate with your team
        </p>
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1.5rem',
        background: 'var(--surface)'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-muted)', 
            padding: '2rem',
            fontStyle: 'italic'
          }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ 
              marginBottom: '1rem',
              padding: '1rem',
              background: msg.system ? 'linear-gradient(135deg, #f0f9ff, #e0f2fe)' : 'var(--surface-hover)',
              borderRadius: '12px',
              border: msg.system ? '1px solid #bae6fd' : '1px solid var(--border)'
            }}>
              {msg.system ? (
                <div style={{ 
                  color: 'var(--accent)', 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🎯 {msg.text}
                </div>
              ) : (
                <div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem'
                  }}>
                    {msg.player || msg.senderName}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      
      <form onSubmit={handleSubmit} style={{ 
        padding: '1.5rem', 
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input"
            placeholder="Type your message..."
            style={{ flex: 1, margin: 0 }}
          />
          <button 
            type="submit" 
            className="btn"
            style={{ 
              background: 'linear-gradient(135deg, var(--accent), #0891b2)',
              whiteSpace: 'nowrap'
            }}
          >
            📤 Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;