import mongooseConnect from "@/lib/mongoose";
import { Deal } from "@/models/Deal";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dealIds } = req.query;

  if (!dealIds) {
    return res.status(400).json({ error: 'Deal IDs are required' });
  }

  try {
    await mongooseConnect();

    // Convert comma-separated string of IDs to array
    const ids = dealIds.split(',');
    const deals = await Deal.find({ _id: { $in: ids } });
    res.status(200).json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
} 