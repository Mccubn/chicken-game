import React from 'react';

const Profile = ({ player, role, players }) => {
  const playerStats = {
    gamesPlayed: Math.floor(Math.random() * 50) + 10,
    chickensFound: Math.floor(Math.random() * 20) + 5,
    totalSpent: (Math.random() * 200 + 50).toFixed(2),
    rank: Math.floor(Math.random() * 10) + 1
  };

  const achievements = [
    { name: 'First Chicken', icon: '🥇', unlocked: true },
    { name: 'Team Player', icon: '🤝', unlocked: true },
    { name: 'Photo Master', icon: '📸', unlocked: Math.random() > 0.3 },
    { name: 'Bar Hopper', icon: '🍺', unlocked: Math.random() > 0.5 },
    { name: 'Legendary Hunter', icon: '👑', unlocked: Math.random() > 0.8 }
  ];

  return (
    <div style={{ 
      padding: '1.5rem',
      background: 'var(--surface)',
      height: '100%',
      overflowY: 'auto'
    }}>
      {/* Profile Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, var(--surface), var(--surface-hover))',
        borderRadius: '16px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '2rem',
          margin: '0 auto 1rem auto'
        }}>
          {player.name.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--text-primary)',
          fontSize: '1.5rem'
        }}>
          {player.name}
        </h2>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '600',
          display: 'inline-block'
        }}>
          {role === 'chicken' ? '🐔 Chicken Hunter' : '👤 Player'}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #bae6fd',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎮</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {playerStats.gamesPlayed}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Games Played
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #bbf7d0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐔</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {playerStats.chickensFound}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Chickens Found
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #fcd34d',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            ${playerStats.totalSpent}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Total Spent
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #c084fc',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            #{playerStats.rank}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Leaderboard Rank
          </div>
        </div>
      </div>

      {/* Achievements */}
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
          🏅 Achievements
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {achievements.map((achievement, index) => (
            <div key={index} style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: achievement.unlocked ? 'var(--surface-hover)' : 'var(--surface)',
              borderRadius: '12px',
              border: `1px solid ${achievement.unlocked ? 'var(--border-hover)' : 'var(--border)'}`,
              opacity: achievement.unlocked ? 1 : 0.6
            }}>
              <div style={{ 
                fontSize: '1.5rem',
                filter: achievement.unlocked ? 'none' : 'grayscale(1)'
              }}>
                {achievement.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: achievement.unlocked ? 'var(--text-primary)' : 'var(--text-muted)'
                }}>
                  {achievement.name}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: achievement.unlocked ? 'var(--text-secondary)' : 'var(--text-muted)'
                }}>
                  {achievement.unlocked ? 'Unlocked!' : 'Keep playing to unlock'}
                </div>
              </div>
              {achievement.unlocked && (
                <div style={{ 
                  color: 'var(--success)',
                  fontSize: '1.25rem'
                }}>
                  ✅
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Team Info */}
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
          👥 Team Members
        </h3>
        <div style={{ 
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid #bae6fd'
        }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            {players ? `${players.length} players online` : 'Loading team...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 