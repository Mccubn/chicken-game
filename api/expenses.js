import blobGameDB from '../lib/blob-db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all expenses
      const expenses = await blobGameDB.getAllExpenses();
      res.status(200).json(expenses);
    } else if (req.method === 'POST') {
      // Add new expense
      const { amount, description, playerName } = req.body;
      
      if (!amount || !description || !playerName) {
        return res.status(400).json({ 
          message: 'Missing required fields: amount, description, playerName' 
        });
      }

      const expense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        description,
        playerName,
        timestamp: new Date().toISOString()
      };

      await blobGameDB.addExpense(expense);
      res.status(201).json(expense);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Expenses API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
