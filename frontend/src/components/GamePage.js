import React, { useEffect, useState } from 'react';
import GameMap from './GameMap';
import Chat from './Chat';
import Payment from './Payment';

const GamePage = ({ player }) => {
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [role, setRole] = useState(player.role);

  // Fetch initial data
  useEffect(() => {
    fetchPlayers();
    fetchPhotos();
    
    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(() => {
      fetchPlayers();
      fetchPhotos();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
      
      // Find current player and update role
      const currentPlayer = data.find(p => p.id === player.id);
      if (currentPlayer) {
        setRole(currentPlayer.role);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const sendMessage = (text) => {
    if (text.trim()) {
      const newMessage = {
        id: Date.now(),
        text,
        player: player.name,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const uploadPhoto = async (formData) => {
    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        // Refresh photos after upload
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const markFound = () => {
    // Add a system message when chicken is found
    const foundMessage = {
      id: Date.now(),
      system: true,
      text: `${player.name} found a chicken!`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, foundMessage]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: '1rem', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          Logged in as <strong>{player.name}</strong>
          {role === 'chicken' && <span style={{ marginLeft: 8, color: 'orange' }}>(Chicken)</span>}
        </div>
        <button onClick={markFound} style={{ padding: '0.5rem 1rem' }}>Found Chicken</button>
      </header>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 2, minHeight: 0 }}>
          <GameMap photos={photos} role={role} uploadPhoto={uploadPhoto} />
        </div>
        <div style={{ flex: 1, borderLeft: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
          <Chat messages={messages} sendMessage={sendMessage} />
          <Payment player={player} />
        </div>
      </div>
    </div>
  );
};

export default GamePage;