import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    const result = await db.collection('contactus').insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    client.close();

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving contact form:', error);
    return res.status(500).json({ message: 'Error saving message' });
  }
}