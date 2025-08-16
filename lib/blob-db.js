// Database utility using Vercel Blob (no explicit keys needed on Vercel)
// Stores JSON documents in Vercel Blob and keeps an in-memory cache for speed

import { put, list } from '@vercel/blob';

class BlobGameDatabase {
  constructor() {
    // In-memory cache (also used as fallback if blob operations fail)
    this.players = new Map();
    this.photos = new Map();
    this.balance = 0;
    this.expenses = [];
    this.chickensAssigned = false;

    this.playersBlob = 'players.json';
    this.photosBlob = 'photos.json';
    this.gameBlob = 'game.json';
  }

  // Find a blob URL by name
  async findBlobUrlByName(name) {
    const { blobs } = await list();
    const match = blobs.find(b => b.pathname === name || b.url.endsWith(`/${name}`));
    return match ? match.url : null;
  }

  async readJson(name) {
    try {
      const url = await this.findBlobUrlByName(name);
      if (!url) return null;
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error(`Error reading blob ${name}:`, error);
      return null;
    }
  }

  async writeJson(name, data) {
    try {
      await put(name, JSON.stringify(data), {
        contentType: 'application/json',
        addRandomSuffix: false,
        access: 'public'
      });
      return true;
    } catch (error) {
      console.error(`Error writing blob ${name}:`, error);
      return false;
    }
  }

  // Load data from blobs into memory
  async loadFromBlob() {
    try {
      const [playersData, photosData, gameData] = await Promise.all([
        this.readJson(this.playersBlob),
        this.readJson(this.photosBlob),
        this.readJson(this.gameBlob)
      ]);

      if (playersData && typeof playersData === 'object') {
        this.players = new Map(Object.entries(playersData));
      }
      if (photosData && typeof photosData === 'object') {
        this.photos = new Map(Object.entries(photosData));
      }
      if (gameData && typeof gameData === 'object') {
        this.balance = Number(gameData.balance || 0);
        this.expenses = Array.isArray(gameData.expenses) ? gameData.expenses : [];
        this.chickensAssigned = Boolean(gameData.chickensAssigned);
      }
    } catch (error) {
      console.error('Error loading from Vercel Blob:', error);
    }
  }

  // Save memory state to blobs
  async saveToBlob() {
    try {
      await Promise.all([
        this.writeJson(this.playersBlob, Object.fromEntries(this.players)),
        this.writeJson(this.photosBlob, Object.fromEntries(this.photos)),
        this.writeJson(this.gameBlob, {
          balance: this.balance,
          expenses: this.expenses,
          chickensAssigned: this.chickensAssigned
        })
      ]);
    } catch (error) {
      console.error('Error saving to Vercel Blob:', error);
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
