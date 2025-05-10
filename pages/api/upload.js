// for pfp upload
import multiparty from 'multiparty';
import fs from 'fs-extra';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const form = new multiparty.Form();
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // Ensure upload directory exists
  await fs.ensureDir(uploadDir);

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    const file = files.profilePic?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${file.originalFilename}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      await fs.move(file.path, filePath);
      res.status(200).json({ url: `/uploads/${fileName}` });
    } catch (error) {
      console.error('File move error:', error);
      res.status(500).json({ error: 'File processing failed' });
    }
  });
}