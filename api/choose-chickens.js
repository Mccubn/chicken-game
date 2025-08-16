import blobGameDB from '../lib/blob-db.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const result = await blobGameDB.chooseChickensTeam();
      return res.status(200).json(result);
    }
    if (req.method === 'GET') {
      const announcement = await blobGameDB.getAnnouncement();
      return res.status(200).json({ announcement });
    }
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Choose chickens API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


