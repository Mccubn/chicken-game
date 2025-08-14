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
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            {msg.system ? (
              <em>{msg.text}</em>
            ) : (
              <>
                <strong>{msg.senderName}: </strong>
                <span>{msg.text}</span>
              </>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '0.5rem', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
          placeholder="Type a message..."
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>Send</button>
      </form>
    </div>
  );
};

export default Chat;