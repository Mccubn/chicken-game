# Chicken Game

A multiplayer location-based game where players try to find hidden chickens!

## 🚀 Deploy to Vercel

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Vercel CLI](https://vercel.com/cli) (optional, but recommended)

### Quick Deploy

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `chicken-game` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: `N`

5. **Your app will be deployed!** Vercel will provide you with a URL.

### Manual Deploy via GitHub

1. **Push your code to GitHub**

2. **Go to [vercel.com](https://vercel.com)**

3. **Click "New Project"**

4. **Import your GitHub repository**

5. **Configure the project**:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `npm run vercel-build`
   - Output Directory: `frontend/build`

6. **Deploy!**

## 🏗️ Project Structure

```
chicken-game/
├── api/                 # Vercel serverless functions
│   └── index.js        # Main API endpoint
├── frontend/           # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/            # Original backend (not used in Vercel)
├── vercel.json         # Vercel configuration
├── package.json        # Root package.json
└── README.md
```

## 🔧 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

   This will start both frontend (port 3000) and backend (port 5000).

## 📝 Important Notes

- **Real-time features**: The Vercel version uses polling instead of WebSockets for simplicity
- **State persistence**: Game state resets on each serverless function invocation. For production, consider using a database
- **File uploads**: Photo uploads are currently disabled in the Vercel version due to serverless limitations

## 🚀 Environment Variables

If you need to add environment variables (like Stripe keys), you can do so in the Vercel dashboard:

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add your variables

## 🔍 Troubleshooting

- **Build errors**: Make sure all dependencies are properly installed
- **API errors**: Check that your API routes are working in the Vercel Functions tab
- **CORS issues**: The API is configured to allow all origins for development

## 📚 Next Steps

- Add a database for persistent game state
- Implement real-time features using Vercel's Edge Functions
- Add authentication
- Set up Stripe payments
- Add photo upload functionality with cloud storage 