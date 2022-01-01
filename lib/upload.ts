import {
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firestore, storage } from './firebase';
import { Collection } from './utils';
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
  const formData = new FormData();
  formData.append('imageFile', novel.image);
  const res = await fetch('/api/uploadImage', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    if (res.status === 500) {
      const { error } = await res.json();
      throw error;
    }
    return;
  }
  const { urlOfImage } = await res.json();
  const docRef = doc(firestore, Collection.NOVELS, slugifiedTitle);
  await setDoc(docRef, {
    title: novel.title,
    description: novel.description,
    imgUrl: urlOfImage,
    authorId: novel.authorId,
    authorName: novel.authorName,
    chapters: [],
    createdAt: serverTimestamp(),
    lastModified: serverTimestamp(),
  });
  await updateNovelList(slugifiedTitle);
};

export const uploadImage = async (image: Buffer, mimeType?: string) => {
  const storageRef = ref(storage, randomBytes(16).toString('hex'));
  const snapshot = await uploadBytes(storageRef, image, {
    contentType: mimeType,
  });
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

const updateNovelList = async (slug: string) => {
  const docRef = doc(firestore, Collection.EXTRAS, 'novel');
  await updateDoc(docRef, {
    novelIds: arrayUnion(slug),
  });
};
