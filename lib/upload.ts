import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import {
  getFirestore,
  addDoc,
  collection,
  FieldValue,
} from 'firebase/firestore';
import { randomBytes } from 'crypto';
import { app } from './firebase';

export const uploadData = async (
  data: { [index: string]: string | FieldValue },
  table: string,
) => {
  const firestore = getFirestore(app);
  await addDoc(collection(firestore, table), data);
};

export const uploadImage = async (image: File) => {
  const storage = getStorage(app);
  const imageId = randomBytes(16).toString('hex');
  const storageRef = ref(storage, imageId);
  const snapshot = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};
