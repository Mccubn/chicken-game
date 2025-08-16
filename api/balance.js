import blobGameDB from '../lib/blob-db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const balance = await blobGameDB.getBalance();
    res.status(200).json({ balance });
    
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 