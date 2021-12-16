import { GetStaticPaths, GetStaticProps } from 'next';
import {
  getFirestore,
  getDocs,
  getDoc,
  collection,
  doc,
} from 'firebase/firestore';
import { app } from '../lib/firebase';
import styles from '../styles/NovelPage.module.scss';
import Header from '../components/header';
import { useState } from 'react';
import Image from 'next/image';

export default function Novel({ novel }: { novel: any }) {
  const [chapList, setChapList] = useState(true);
  const [lastChapList, setLastChapList] = useState(false);
  const [authorNovelList, setAuthorNovelList] = useState(false);
  return (
    <div className={styles.container}>
      <Header />
      <main>
        <div>
          <div className={styles.novelTitle}>{novel.title}</div>
          <div className={styles.novelImg}>
            <Image src={novel.image} alt={novel.title} />
          </div>
          <div className={styles.infoCard}>
            <div>
              <b> Name: </b>dl fjdklf d
            </div>
            <div>
              <b>Rating:</b> 5
            </div>
            <div>
              <b>Author: </b>
              {novel.authorName}
            </div>
            <div>
              <p>
                <b>Description: </b>
                {novel.description}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.chapterNav}>
          <div
            onClick={() => {
              setChapList(true);
              setLastChapList(false);
              setAuthorNovelList(false);
            }}
            className={styles[chapList + 'cl']}
          >
            Chapter List
          </div>
          <div
            onClick={() => {
              setChapList(false);
              setLastChapList(true);
              setAuthorNovelList(false);
            }}
            className={styles[lastChapList + 'cl']}
          >
            Latest Chapter
          </div>
          <div
            onClick={() => {
              setChapList(false);
              setLastChapList(false);
              setAuthorNovelList(true);
            }}
            className={styles[authorNovelList + 'cl']}
          >
            Authors other Novels
          </div>
        </div>
        {/* <div className={styles.chapterNavContent}>
          {chapList ? (
            <ul>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
              <li>Chapter 1</li>
            </ul>
          ) : lastChapList ? (
            <ul>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
              <li>chapter 1202</li>
            </ul>
          ) : (
            <ul>
              <li>NOvel names</li>
              <li>NOvel names</li>
              <li>NOvel names</li>
            </ul>
          )}
        </div> */}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const title = params!.title as string;
  const firestore = getFirestore(app);
  const novel = await getDoc(doc(firestore, 'novels', title));
  return {
    props: {
      novel: novel.data(),
    },
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const firestore = getFirestore(app);
//   const snapshot = await getDocs(collection(firestore, 'novels'));
//   const paths = snapshot.docs.map(doc => ({
//     params: { id: doc.id },
//   }));
//   return { paths, fallback: false };
// };
