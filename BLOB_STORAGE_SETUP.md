# Blob Storage Setup Guide

## Environment Variables Needed

Add these to your Vercel environment variables:

### Required Variables:
- `BLOB_STORAGE_URL`: Your Azure Blob Storage account URL
  - Format: `https://YOUR_STORAGE_ACCOUNT.blob.core.windows.net`
  - Example: `https://chicken-game-blob.blob.core.windows.net`

- `BLOB_SAS_TOKEN`: Your Shared Access Signature token
  - This should include the full query string starting with `?sv=...`
  - Make sure it has read/write permissions for the container

### How to Get These Values:

1. **Go to Azure Portal** → Your Storage Account → Blob Service → Containers
2. **Select your container** (`chicken-game-blob`)
3. **Generate SAS token**:
   - Click "Generate SAS" 
   - Set permissions: Read, Write, Delete
   - Set expiry (recommend 1 year)
   - Copy the full token (including the `?`)

### Vercel Setup:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add both variables
4. Redeploy your app

### Fallback Behavior:
If blob storage isn't configured, the app will automatically fall back to in-memory storage (temporary, resets on each deployment).

## Testing:
After setup, the admin panel should be able to:
- Set tab totals that persist
- Add expenses that persist
- Reset the game
- All data should survive app restarts
