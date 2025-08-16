// Database utility for Azure Blob Storage
// This provides persistent storage for the game data

class BlobGameDatabase {
  constructor() {
    this.containerName = 'chicken-game-blob';
    this.baseUrl = process.env.BLOB_STORAGE_URL || 'https://chicken-game-blob.blob.core.windows.net';
    this.sasToken = process.env.BLOB_SAS_TOKEN;
    
    // Fallback to in-memory if blob storage not configured
    this.useBlobStorage = !!(this.baseUrl && this.sasToken);
    
    // In-memory fallback
    this.players = new Map();
    this.photos = new Map();
    this.balance = 0;
    this.expenses = [];
    this.chickensAssigned = false;
  }

  // Helper method to get blob URL
  getBlobUrl(blobName) {
    return `${this.baseUrl}/${this.containerName}/${blobName}?${this.sasToken}`;
  }

  // Helper method to fetch blob data
  async fetchBlob(blobName) {
    try {
      const response = await fetch(this.getBlobUrl(blobName));
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Error fetching blob ${blobName}:`, error);
    }
    return null;
  }

  // Helper method to update blob data
  async updateBlob(blobName, data) {
    try {
      const response = await fetch(this.getBlobUrl(blobName), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-ms-blob-type': 'BlockBlob'
        },
        body: JSON.stringify(data)
      });
      return response.ok;
    } catch (error) {
      console.error(`Error updating blob ${blobName}:`, error);
      return false;
    }
  }

  // Load data from blob storage
  async loadFromBlob() {
    if (!this.useBlobStorage) return;

    try {
      const [playersData, photosData, gameData] = await Promise.all([
        this.fetchBlob('players.json'),
        this.fetchBlob('photos.json'),
        this.fetchBlob('game.json')
      ]);

      if (playersData) {
        this.players = new Map(Object.entries(playersData));
      }
      if (photosData) {
        this.photos = new Map(Object.entries(photosData));
      }
      if (gameData) {
        this.balance = gameData.balance || 0;
        this.expenses = gameData.expenses || [];
        this.chickensAssigned = gameData.chickensAssigned || false;
      }
    } catch (error) {
      console.error('Error loading from blob storage:', error);
    }
  }

  // Save data to blob storage
  async saveToBlob() {
    if (!this.useBlobStorage) return;

    try {
      await Promise.all([
        this.updateBlob('players.json', Object.fromEntries(this.players)),
        this.updateBlob('photos.json', Object.fromEntries(this.photos)),
        this.updateBlob('game.json', {
          balance: this.balance,
          expenses: this.expenses,
          chickensAssigned: this.chickensAssigned
        })
      ]);
    } catch (error) {
      console.error('Error saving to blob storage:', error);
    }
  }

  // Player methods
  async addPlayer(player) {
    this.players.set(player.id, player);
    await this.saveToBlob();
    return player;
  }

  async getPlayer(id) {
    await this.loadFromBlob();
    return this.players.get(id);
  }

  async getAllPlayers() {
    await this.loadFromBlob();
    return Array.from(this.players.values());
  }

  async updatePlayerRole(id, role) {
    const player = this.players.get(id);
    if (player) {
      player.role = role;
      this.players.set(id, player);
      await this.saveToBlob();
    }
    return player;
  }

  // Photo methods
  async addPhoto(photo) {
    this.photos.set(photo.id, photo);
    await this.saveToBlob();
    return photo;
  }

  async getAllPhotos() {
    await this.loadFromBlob();
    return Array.from(this.photos.values());
  }

  // Balance methods
  async getBalance() {
    await this.loadFromBlob();
    return this.balance;
  }

  async updateBalance(amount) {
    this.balance += amount;
    await this.saveToBlob();
    return this.balance;
  }

  // Chicken assignment
  async assignChickens() {
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
    await this.saveToBlob();
    return true;
  }

  // Reset for new game
  async resetGame() {
    this.players.clear();
    this.photos.clear();
    this.balance = 0;
    this.expenses = [];
    this.chickensAssigned = false;
    await this.saveToBlob();
  }

  // Tab management
  async setTabTotal(amount) {
    this.balance = amount;
    await this.saveToBlob();
  }

  // Expense management
  async addExpense(expense) {
    this.expenses.push(expense);
    this.balance -= expense.amount;
    await this.saveToBlob();
  }

  async getAllExpenses() {
    await this.loadFromBlob();
    return this.expenses;
  }
}

// Create a singleton instance
const blobGameDB = new BlobGameDatabase();

export default blobGameDB;
