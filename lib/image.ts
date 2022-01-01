import sharp from 'sharp';
import busboy, { BusboyHeaders } from 'busboy';
import { Readable } from 'stream';
import { NextApiRequest } from 'next';
export const processImage = (imgFileStream: Readable) => {
  const tranform = sharp()
    .resize(300, 400, {
      fit: 'contain',
    })
    .webp();
  return imgFileStream.pipe(tranform).toBuffer();
};

export const parseImage = (req: NextApiRequest): Promise<Readable> => {
  return new Promise((resolve, reject) => {
    const bb = busboy({
      headers: req.headers as BusboyHeaders,
      limits: {
        files: 1,
      },
    });
    bb.on('file', (_, file) => {
      resolve(file);
    });
    bb.on('error', err => {
      reject(err);
    });
    req.pipe(bb);
  });
};
