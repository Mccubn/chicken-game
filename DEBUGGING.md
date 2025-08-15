# 🔍 Debugging Guide: "Invalid Login" Issue

## 🚨 **Current Problem:**
You're getting "Invalid login" when trying to join the game.

## 🔧 **Step-by-Step Debugging:**

### **1. Check Browser Console (Most Important!)**
1. Open your deployed app in the browser
2. Right-click → "Inspect" → "Console" tab
3. Try to join the game
4. Look for error messages and copy them here

### **2. Check Network Tab**
1. In browser dev tools, go to "Network" tab
2. Try to join the game
3. Look for the `/api/join` request
4. Check:
   - Request URL
   - Request payload
   - Response status
   - Response body

### **3. Test API Endpoints Directly**
Try these URLs in your browser to see if the API is working:

#### **Test Endpoint:**
```
https://your-app-name.vercel.app/api/test
```
**Expected Response:**
```json
{
  "message": "API is working!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "status": "success"
}
```

#### **Join Endpoint (POST only):**
```
https://your-app-name.vercel.app/api/join
```
**Note:** This is a POST endpoint, so it won't work in browser directly.

### **4. Check Vercel Function Logs**
1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Look for any error logs
5. Check if the functions are being called

### **5. Common Issues & Solutions:**

#### **Issue: "Function not found"**
- **Cause:** API routes not properly deployed
- **Solution:** Check if `/api` folder is in your repository root

#### **Issue: "CORS error"**
- **Cause:** Browser blocking cross-origin requests
- **Solution:** CORS headers are now added to all endpoints

#### **Issue: "500 Internal Server Error"**
- **Cause:** Server-side error in the function
- **Solution:** Check Vercel function logs for specific errors

#### **Issue: "404 Not Found"**
- **Cause:** API endpoint doesn't exist
- **Solution:** Verify the endpoint URL is correct

### **6. Quick Fixes to Try:**

#### **Fix 1: Clear Browser Cache**
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache and cookies

#### **Fix 2: Check URL Format**
Make sure your app URL is correct:
```
✅ Correct: https://your-app-name.vercel.app
❌ Wrong: http://your-app-name.vercel.app (missing https)
❌ Wrong: https://your-app-name.vercel.app/ (extra slash)
```

#### **Fix 3: Verify API Structure**
Your repository should have this structure:
```
chicken-game/
├── api/
│   ├── join.js
│   ├── players.js
│   ├── balance.js
│   ├── deposit.js
│   ├── photos.js
│   ├── stripe-webhook.js
│   └── test.js
├── frontend/
│   └── src/
└── vercel.json
```

### **7. Debug Commands:**

#### **Test API from Command Line:**
```bash
# Test endpoint
curl https://your-app-name.vercel.app/api/test

# Join endpoint (POST)
curl -X POST https://your-app-name.vercel.app/api/join \
  -H "Content-Type: application/json" \
  -d '{"name":"TestPlayer"}'
```

### **8. What to Share for Help:**

When asking for help, include:
1. **Your app URL**
2. **Browser console errors** (copy/paste)
3. **Network tab details** (screenshot)
4. **Vercel function logs** (if any)
5. **Repository structure** (confirm `/api` folder exists)

### **9. Expected Behavior:**

When working correctly:
1. User types name and clicks "Join Game"
2. Frontend sends POST to `/api/join`
3. API returns player object with ID and role
4. User is redirected to game page
5. No errors in console

### **10. Next Steps:**

1. **Follow the debugging steps above**
2. **Test the `/api/test` endpoint** first
3. **Check browser console** for specific errors
4. **Share the error details** so we can fix it

## 🆘 **Still Stuck?**

If you're still having issues after following this guide:
1. Share the exact error message from browser console
2. Share your app URL
3. Share any Vercel function logs
4. We'll get this working together! 🚀 