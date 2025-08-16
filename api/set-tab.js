import gameDB from '../lib/db.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;
    
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: 'Invalid amount. Must be a positive number.' });
    }

    // Set the tab total in the database
    gameDB.setTabTotal(amount);
    
    res.status(200).json({ 
      message: 'Tab total updated successfully',
      balance: gameDB.getBalance()
    });
    
  } catch (error) {
    console.error('Set tab error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

