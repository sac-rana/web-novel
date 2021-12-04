// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Busboy, { BusboyHeaders } from 'busboy';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';
import { randomBytes } from 'crypto';
import { app } from '../../lib/db';

interface Novel {
  name: string;
  genres: string[];
  description: string;
  authorName: string;
  image: string;
  createdAt: FieldValue;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const storage = getStorage(app);
  const busboy = new Busboy({ headers: req.headers as BusboyHeaders });
  const data: {
    [index: string]: string | FieldValue;
  } = {};
  let finished = false;
  busboy.on('file', (_fieldName, file, _fileName, _encoding, mimeType) => {
    let dataArray = new Uint8Array();

    file.on('data', (data: Buffer) => {
      dataArray = Uint8Array.from([...dataArray, ...data]);
    });

    file.on('end', async () => {
      const imageId = randomBytes(16).toString('hex');
      const storageRef = ref(storage, imageId);
      try {
        const snapshot = await uploadBytes(storageRef, dataArray, {
          contentType: mimeType,
        });
        const url = await getDownloadURL(snapshot.ref);
        data.image = url;
        if (finished) {
          const firestore = getFirestore(app);
          data.createdAt = serverTimestamp();
          await addDoc(collection(firestore, 'novels'), data);
          return res.status(200).send('Upload successful');
        }
      } catch (err) {
        //TODO: Add better error handling
        return res.status(400).send('Error uploading data');
      }
    });
  });

  busboy.on('field', (field, val) => {
    data[field] = val;
  });

  busboy.on('finish', () => {
    console.log('Parsing finished');
    finished = true;
  });

  req.pipe(busboy);
}
