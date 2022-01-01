import { NextApiRequest, NextApiResponse } from 'next';
import { processImage, parseImage } from '../../lib/image';
import { uploadImage } from '../../lib/upload';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const imgFileStream = await parseImage(req);
    const processedImage = await processImage(imgFileStream);
    const url = await uploadImage(processedImage, 'image/webp');
    res.status(200).json({ urlOfImage: url });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
