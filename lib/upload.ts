import {
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firestore, storage } from './firebase';
import { Collection } from './constants';
import slugify from 'slugify';
import { randomBytes } from 'crypto';

interface Novel {
  title: string;
  description: string;
  image: File;
  authorId: string;
  authorName: string;
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

// interface Chapter {
//   chapterNo: string;
//   chapterContent: string;
// }

export const uploadNovel = async (novel: Novel) => {
  //TODO: verify data given by user
  const slugifiedTitle = slugify(novel.title, {
    lower: true,
  });
  const url = await uploadImage(novel.image);
  const docRef = doc(firestore, Collection.NOVELS, slugifiedTitle);
  await setDoc(docRef, {
    title: novel.title,
    description: novel.description,
    imgUrl: url,
    authorId: novel.authorId,
    authorName: novel.authorName,
    chapters: [],
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
  });
  await updateNovelList(slugifiedTitle);
};

const uploadImage = async (image: File) => {
  const storageRef = ref(storage, randomBytes(16).toString('hex'));
  const snapshot = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

const updateNovelList = async (slug: string) => {
  const docRef = doc(firestore, Collection.EXTRAS, 'novel');
  await updateDoc(docRef, {
    novelIds: arrayUnion(slug),
  });
};
