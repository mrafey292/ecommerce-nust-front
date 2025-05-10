import mongooseConnect from "@/lib/mongoose";
import { Review } from "@/models/Review";
import multiparty from 'multiparty';
import fs from 'fs-extra';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default bodyParser for file uploads
  },
};

export default async function handler(req, res) {
  await mongooseConnect();

  try {
    if (req.method === 'POST') {
      // Handle review submission
      const formData = await new Promise((resolve, reject) => {
        const form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      const { name, email, rating, notes } = formData.fields;
      const profilePicFile = formData.files?.profilePic?.[0];

      // Validate required fields
      if (!name?.[0]?.trim() || !email?.[0]?.trim() || !rating?.[0]) {
        return res.status(400).json({ 
          success: false,
          error: 'Name, email, and rating are required fields'
        });
      }

      // Handle file upload if present
      let profilePicPath = '';
      if (profilePicFile) {
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.ensureDir(uploadDir);
        const fileName = `${Date.now()}-${profilePicFile.originalFilename}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.move(profilePicFile.path, filePath);
        profilePicPath = `/uploads/${fileName}`;
      }

      // Create and save review
      const reviewDoc = await Review.create({
        name: name[0].trim(),
        email: email[0].trim(),
        rating: Number(rating[0]),
        notes: notes?.[0]?.trim() || '',
        profilePic: profilePicPath,
        status: 'approved'
      });

      return res.status(201).json({
        success: true,
        data: reviewDoc
      });

    } else if (req.method === 'GET') {
      // Handle fetching reviews
      const reviews = await Review.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .limit(50);
      
      return res.status(200).json({
        success: true,
        data: reviews
      });

    } else {
      // Handle unsupported methods
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}