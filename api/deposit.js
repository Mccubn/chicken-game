import gameDB from '../../lib/db.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // For now, just increment balance directly
    // TODO: integrate with Stripe to create a payment session
    const newBalance = gameDB.updateBalance(parseFloat(amount));
    
    res.status(200).json({ success: true, balance: newBalance });
    
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 