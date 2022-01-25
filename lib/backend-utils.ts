import sharp from 'sharp';
import busboy, { BusboyHeaders } from '@fastify/busboy';
import { Readable } from 'stream';
import { NextApiRequest } from 'next';
import { ImageDimensions } from './utils';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';
import { assert } from 'joi';
import { novelSchema } from './utils';

export const processImage = (imgFileStream: Readable) => {
  const tranform = sharp()
    .resize(ImageDimensions.WIDTH, ImageDimensions.HEIGHT, {
      fit: 'contain',
    })
    .webp();
  return imgFileStream.pipe(tranform).toBuffer();
};

export const parseRequest = (req: NextApiRequest) => {
  return new Promise<{ title: string; description: string; imgUrl: string }>(
    (resolve, reject) => {
      const novel: { [keys: string]: string } = {};
      const bb = busboy({
        headers: req.headers as BusboyHeaders,
        limits: {
          files: 1,
        },
      });
      bb.on('file', async (_, file) => {
        const img = await processImage(file);
        assert(
          { title: novel.title, description: novel.description },
          novelSchema,
        );
        novel.imgUrl = await uploadImageToFirebase(img);
        resolve(novel as any);
      });
      bb.on('field', (fieldname, value) => {
        novel[fieldname] = value;
      });
      bb.on('error', err => {
        reject(err);
      });
      req.pipe(bb);
    },
  );
};

export const uploadImageToFirebase = async (image: Buffer) => {
  const storageRef = ref(storage, randomBytes(16).toString('hex'));
  const snapshot = await uploadBytes(storageRef, image, {
    contentType: 'image/webp',
  });
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

declare global {
  var admin: App | undefined;
}

import { initializeApp, cert, App } from 'firebase-admin/app';
export const admin =
  global.admin ||
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    }),
  });
global.admin = admin;
