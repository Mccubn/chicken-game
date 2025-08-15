import gameDB from '../../lib/db.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const photos = gameDB.getAllPhotos();
      res.status(200).json(photos);
    } catch (error) {
      console.error('Photos GET error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { barName, lat, lng } = req.body;
      
      if (!barName || !lat || !lng) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // For now, create a mock photo since we can't handle file uploads in serverless
      // TODO: integrate with cloud storage (AWS S3, Cloudinary, etc.)
      const photo = {
        id: Date.now().toString(),
        barName,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        url: `https://via.placeholder.com/150/3b82f6/ffffff?text=${encodeURIComponent(barName)}`,
        uploadedAt: new Date().toISOString()
      };
      
      gameDB.addPhoto(photo);
      res.status(200).json({ success: true, photo });
      
    } catch (error) {
      console.error('Photos POST error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  res.status(405).json({ message: 'Method not allowed' });
} 