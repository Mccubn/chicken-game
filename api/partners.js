import blobGameDB from '../lib/blob-db.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const { playerId, partnerId } = req.body || {};
      if (!playerId || !partnerId) {
        return res.status(400).json({ message: 'playerId and partnerId are required' });
      }
      await blobGameDB.setPartner(playerId, partnerId);
      const teams = await blobGameDB.getTeams();
      return res.status(200).json({ success: true, teams });
    }

    if (req.method === 'GET') {
      const teams = await blobGameDB.getTeams();
      return res.status(200).json({ teams });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Partners API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


