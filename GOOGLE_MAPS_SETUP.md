# 🗺️ Google Maps API Setup Guide

## 🎯 **What You Need:**

1. **Google Cloud Console Account** (free)
2. **Google Maps API Key** with enabled services
3. **Places API** enabled
4. **Directions API** enabled
5. **Maps JavaScript API** enabled

## 🚀 **Step-by-Step Setup:**

### **1. Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing (required for API usage)

### **2. Enable Required APIs**
In your project, go to **APIs & Services → Library** and enable:

- ✅ **Maps JavaScript API** - Core maps functionality
- ✅ **Places API** - Search for bars and businesses
- ✅ **Directions API** - Get walking directions
- ✅ **Geocoding API** - Convert addresses to coordinates

### **3. Create API Key**
1. Go to **APIs & Services → Credentials**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy your new API key

### **4. Restrict API Key (Recommended)**
1. Click on your API key
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add your domain: `*.vercel.app`
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Select only the APIs you enabled above

### **5. Set Environment Variable**
In your Vercel project dashboard:

1. Go to **Settings → Environment Variables**
2. Add new variable:
   ```
   Name: REACT_APP_GOOGLE_MAPS_API_KEY
   Value: YOUR_ACTUAL_API_KEY_HERE
   ```
3. Redeploy your app

## 🔧 **Local Development:**

For local testing, create a `.env.local` file in your `frontend` folder:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 📱 **Features Now Available:**

### **🔍 Bar Search:**
- Automatically finds bars in the South Broadway area
- Shows real bar names, addresses, and ratings
- Displays opening hours and photos when available

### **📍 Location Services:**
- Get your current location with GPS
- Shows your position on the map with a blue dot
- Automatically centers map on your location

### **🚶‍♂️ Walking Directions:**
- Click any bar to get walking directions
- Shows estimated time and distance
- Displays route on the map with blue line

### **🍺 Enhanced Bar Info:**
- Real bar names and addresses
- Google ratings and reviews
- Opening hours status
- Photo upload functionality

## 🧪 **Testing:**

### **Test Bar Search:**
1. Click **"🔍 Find Bars"** button
2. Map should populate with real bars in the area
3. Bars will have real names and addresses

### **Test Directions:**
1. Click **"📍 My Location"** to get your position
2. Click on any bar marker
3. Walking directions should appear on the map
4. Bar info card shows distance and time

### **Test Photo Upload:**
1. Click on a bar (if you're not a chicken)
2. Click **"📁 Upload Photo"**
3. Select an image file
4. Photo should appear on the map

## 🔍 **Troubleshooting:**

### **"Google Maps API error"**
- Check if API key is set correctly
- Verify all required APIs are enabled
- Check API key restrictions

### **"Places API error"**
- Ensure Places API is enabled
- Check billing is enabled
- Verify API key has Places API access

### **"Directions not working"**
- Ensure Directions API is enabled
- Check if user location permission is granted
- Verify API key has Directions API access

### **"No bars showing"**
- Check browser console for errors
- Verify Places API is working
- Check if location search is working

## 💰 **Costs:**

- **Maps JavaScript API**: $7 per 1,000 map loads
- **Places API**: $17 per 1,000 requests
- **Directions API**: $5 per 1,000 requests
- **Free tier**: $200 monthly credit (usually sufficient for testing)

## 🎉 **You're Ready!**

After completing this setup:
1. **Your app will show real bars** from Google Places
2. **Users can get walking directions** to any bar
3. **Enhanced bar information** with ratings and addresses
4. **Professional mapping experience** for your chicken game!

## 🔗 **Useful Links:**

- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Docs](https://developers.google.com/maps/documentation/directions)

Need help? Check Google's documentation or their support forums! 🚀 