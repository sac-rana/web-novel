import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';
import { randomBytes } from 'crypto';
import { app } from './db';

interface Novel {
  title: string;
  description: string;
  authorName: string;
  image: File;
}

// interface Novel {
//   title: string;
//   genres: string[];
//   description: string;
//   authorName: string;
//   image: File;
//   createdAt: FieldValue;
//   lastModified: FieldValue;
// }

//TODO: take auth object as input in function to set authorName
export const uploadNovel = async (novel: Novel) => {
  //TODO: verify data given by user
  const storage = getStorage(app);
  const imageId = randomBytes(16).toString('hex');
  const storageRef = ref(storage, imageId);
  const snapshot = await uploadBytes(storageRef, novel.image);
  const url = await getDownloadURL(snapshot.ref);
  const firestore = getFirestore(app);
  await addDoc(collection(firestore, 'novels'), {
    title: novel.title,
    description: novel.description,
    image: url,
    authorName: novel.authorName,
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
  });
};
