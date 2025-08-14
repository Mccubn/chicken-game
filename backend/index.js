const express = require('express');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const { Server } = require('socket.io');

// If using Stripe, uncomment and set your secret key
// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// In-memory state
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

// Photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  },
});
const upload = multer({ storage });

app.post('/api/photos', upload.single('file'), (req, res) => {
  const { barName, lat, lng } = req.body;
  const fileUrl = `/uploads/${req.file.filename}`;
  const photo = { barName, lat: parseFloat(lat), lng: parseFloat(lng), url: fileUrl };
  photos.push(photo);
  io.emit('photo', photo);
  res.json({ success: true });
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

// WebSockets
io.on('connection', (socket) => {
  let currentPlayer = null;
  socket.on('join', ({ player }) => {
    currentPlayer = player;
    socket.join('game');
    io.emit('players', players);
    // send role individually
    socket.emit('role', { role: player.role });
  });

  socket.on('message', ({ text }) => {
    if (!currentPlayer) return;
    const msg = { senderId: currentPlayer.id, senderName: currentPlayer.name, text };
    io.emit('message', msg);
  });

  socket.on('found', () => {
    if (!currentPlayer) return;
    // Determine which chicken was found randomly
    const chickens = players.filter((p) => p.role === 'chicken');
    if (chickens.length) {
      const chicken = chickens[Math.floor(Math.random() * chickens.length)];
      io.emit('found', { finderName: currentPlayer.name, chickenName: chicken.name });
    }
  });

  socket.on('disconnect', () => {
    // optionally handle player leaving
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});