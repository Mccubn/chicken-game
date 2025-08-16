// Database utility for Vercel KV (Redis)
// This will provide persistent storage for the game data

// For now, we'll use a simple in-memory store that persists during the session
// TODO: Replace with Vercel KV when you're ready to add persistent storage

class GameDatabase {
  constructor() {
    this.players = new Map();
    this.photos = new Map();
    this.balance = 0;
    this.expenses = [];
    this.chickensAssigned = false;
  }

  // Player methods
  addPlayer(player) {
    this.players.set(player.id, player);
    return player;
  }

  getPlayer(id) {
    return this.players.get(id);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  updatePlayerRole(id, role) {
    const player = this.players.get(id);
    if (player) {
      player.role = role;
      this.players.set(id, player);
    }
    return player;
  }

  // Photo methods
  addPhoto(photo) {
    this.photos.set(photo.id, photo);
    return photo;
  }

  getAllPhotos() {
    return Array.from(this.photos.values());
  }

  // Balance methods
  getBalance() {
    return this.balance;
  }

  updateBalance(amount) {
    this.balance += amount;
    return this.balance;
  }

  // Chicken assignment
  assignChickens() {
    if (this.chickensAssigned || this.players.size < 2) return false;
    
    const playerArray = Array.from(this.players.values());
    const indices = playerArray.map((_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    const chickenIndices = indices.slice(0, 2);
    chickenIndices.forEach((i) => {
      const player = playerArray[i];
      this.updatePlayerRole(player.id, 'chicken');
    });
    
    this.chickensAssigned = true;
    return true;
  }

  // Reset for new game
  resetGame() {
    this.players.clear();
    this.photos.clear();
    this.balance = 0;
    this.expenses = [];
    this.chickensAssigned = false;
  }

  // Tab management
  setTabTotal(amount) {
    this.balance = amount;
  }

  // Expense management
  addExpense(expense) {
    this.expenses.push(expense);
    this.balance -= expense.amount;
  }

  getAllExpenses() {
    return this.expenses;
  }
}

// Create a singleton instance
const gameDB = new GameDatabase();

export default gameDB; 