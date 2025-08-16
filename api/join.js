import blobGameDB from '../lib/blob-db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
    
    await blobGameDB.addPlayer(player);
    await blobGameDB.assignChickens();
    
    console.log('Player joined successfully:', player);
    
    // Return the player data
    res.status(200).json(player);
    
  } catch (error) {
    console.error('Join error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 