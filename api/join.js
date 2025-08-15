import gameDB from '../../lib/db.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name required' });
    }

    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const player = { 
      id, 
      name: name.trim(), 
      role: 'player',
      joinedAt: new Date().toISOString()
    };
    
    gameDB.addPlayer(player);
    gameDB.assignChickens();
    
    // Return the player data
    res.status(200).json(player);
    
  } catch (error) {
    console.error('Join error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 