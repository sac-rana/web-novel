import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
} from 'firebase/firestore';
import { app, auth } from './firebase';
import { AUTHORS } from './constants';

interface Novel {
  title: string;
  description: string;
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
export const uploadNovel = async (id: string, novel: Novel) => {
  //TODO: verify data given by user
  const firestore = getFirestore(app);
  const uid = auth.currentUser!.uid;
  const authorName = await getDoc(doc(firestore, AUTHORS));
  const storage = getStorage(app);
  const storageRef = ref(storage, 'novel-images');
  const snapshot = await uploadBytes(storageRef, novel.image);
  const url = await getDownloadURL(snapshot.ref);
  await addDoc(collection(firestore, 'novels', id), {
    title: novel.title,
    description: novel.description,
    image: url,
    authorName: novel.authorName,
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
  });
};
