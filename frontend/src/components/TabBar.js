import React from 'react';

const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'map',
      label: 'Map',
      icon: '🗺️',
      description: 'Game Area'
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: '💰',
      description: 'Shared Tab'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      description: 'Player Info'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 1000,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0.75rem 0'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              minWidth: '60px',
              opacity: activeTab === tab.id ? 1 : 0.6
            }}
            className={activeTab === tab.id ? 'active-tab' : ''}
          >
            <div style={{
              fontSize: '1.5rem',
              filter: activeTab === tab.id ? 'none' : 'grayscale(0.3)'
            }}>
              {tab.icon}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: activeTab === tab.id ? '600' : '500',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {tab.label}
            </div>
            {activeTab === tab.id && (
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--primary)',
                marginTop: '0.25rem'
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar; 