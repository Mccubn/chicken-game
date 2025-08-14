const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Server } = require('socket.io');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory state (Note: this will reset on each function invocation)
// For production, you'd want to use a database
let players = [];
let photos = [];
let balance = 0;
let chickensAssigned = false;

// Helper to assign two chickens randomly
function assignChickens() {
  if (chickensAssigned || players.length < 2) return;
  const indices = players.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const chickenIndices = indices.slice(0, 2);
  chickenIndices.forEach((i) => {
    players[i].role = 'chicken';
  });
  chickensAssigned = true;
}

// API: join game
app.post('/api/join', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const player = { id, name, role: 'player' };
  players.push(player);
  assignChickens();
  res.json(player);
});

// Balance endpoints
app.get('/api/balance', (req, res) => {
  res.json({ balance });
});

app.post('/api/deposit', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  // TODO: integrate with Stripe to create a payment session
  // For now, just increment balance directly
  balance += parseFloat(amount);
  res.json({ success: true });
});

// Get players
app.get('/api/players', (req, res) => {
  res.json(players);
});

// Get photos
app.get('/api/photos', (req, res) => {
  res.json(photos);
});

// Reset game (for testing)
app.post('/api/reset', (req, res) => {
  players = [];
  photos = [];
  balance = 0;
  chickensAssigned = false;
  res.json({ success: true });
});

// Export for Vercel
module.exports = app; 