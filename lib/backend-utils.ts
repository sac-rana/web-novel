import sharp from 'sharp';
import busboy, { BusboyHeaders } from 'busboy';
import { Readable } from 'stream';
import { NextApiRequest } from 'next';
import { ImageDimensions } from './utils';

export const processImage = (imgFileStream: Readable) => {
  const tranform = sharp()
    .resize(ImageDimensions.WIDTH, ImageDimensions.HEIGHT, {
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
        fields: 0,
      },
    });
    bb.on('file', (_, file) => {
      resolve(file);
    });
    bb.on('error', err => {
      reject(err);
    });
    bb.on('finish', () => {
      reject(new Error('Busboy returned without parsing file.s'));
    });
    req.pipe(bb);
  });
};
