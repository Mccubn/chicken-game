import React, { useEffect, useState } from 'react';
import GameMap from './GameMap';
import Chat from './Chat';
import Payment from './Payment';
import Profile from './Profile';
import TabBar from './TabBar';

const GamePage = ({ player }) => {
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [role, setRole] = useState(player.role);
  const [activeTab, setActiveTab] = useState('map');

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
      <header className="header" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {player.name}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {role === 'chicken' ? '🐔 Chicken Hunter' : '👤 Player'}
            </div>
          </div>
        </div>
        
        <button 
          onClick={markFound} 
          className="btn"
          style={{ 
            background: 'linear-gradient(135deg, var(--success), #059669)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🎯 Found Chicken
        </button>
      </header>
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        background: 'var(--surface-hover)',
        paddingBottom: '80px' // Space for tab bar
      }}>
        {activeTab === 'map' && (
          <div style={{ flex: 1, minHeight: 0, padding: '1rem' }}>
            <GameMap photos={photos} role={role} uploadPhoto={uploadPhoto} />
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div style={{ flex: 1, minHeight: 0 }}>
            <Chat messages={messages} sendMessage={sendMessage} />
          </div>
        )}
        
        {activeTab === 'payment' && (
          <div style={{ flex: 1, minHeight: 0 }}>
            <Payment player={player} />
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div style={{ flex: 1, minHeight: 0 }}>
            <Profile player={player} role={role} players={players} />
          </div>
        )}
      </div>
      
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default GamePage;