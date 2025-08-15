import gameDB from '../../lib/db.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const players = gameDB.getAllPlayers();
    res.status(200).json(players);
    
  } catch (error) {
    console.error('Players error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 