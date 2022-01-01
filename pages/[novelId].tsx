import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import styles from '../styles/novel-page.module.scss';
import { Collection } from '../lib/utils';
import { Novel, firebaseNovelConvertor } from '../lib/types';
import ChapterComponent from '../components/chapter';
import { useState } from 'react';

export default function NovelPage({
  novel,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>();
  return (
    <div className={styles.container}>
      {currentChapterIndex === undefined && (
        <main>
          <section>
            <div className={styles.novelTitle}>{novel.title}</div>
            <div className={styles.novelImg}>
              <img src={novel.imgUrl} alt={novel.title} />
            </div>
          </section>
          <section className={styles.infoCard}>
            <div>
              <strong> Name: </strong>
              {novel.title}
            </div>
            <div>
              <strong>Rating:</strong> 5
            </div>
            <div>
              <strong>Author: </strong>
              {novel.authorName}
            </div>
            <pre>
              <strong>Description: </strong>
              {novel.description}
            </pre>
          </section>
          <section className={styles.chapterNav}>
            <div>Chapters</div>
            {novel.chapters.map((chapter, i) => (
              <p
                key={chapter.chapterNo}
                onClick={() => setCurrentChapterIndex(i)}
              >
                Chapter: {chapter.chapterNo}
              </p>
            ))}
          </section>
        </main>
      )}
      {currentChapterIndex !== undefined && (
        <ChapterComponent
          currentChapterIndex={currentChapterIndex}
          chapter={novel.chapters[currentChapterIndex]}
          maxChapters={novel.chapters.length}
          setCurrentChapterIndex={setCurrentChapterIndex}
        />
      )}
      <footer className={styles.footer}></footer>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const docRef = doc(firestore, Collection.EXTRAS, 'novel');
  const novelIds: string[] = (await getDoc(docRef)).data()!.novelIds;
  const paths = novelIds.map(novelId => ({
    params: { novelId },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ novel: Novel }> = async ({
  params,
}) => {
  const id = params!.novelId as string;
  const docRef = doc(firestore, Collection.NOVELS, id).withConverter(
    firebaseNovelConvertor,
  );
  const docSnapshot = await getDoc(docRef);
  const data = docSnapshot.data();
  if (!data) {
    return {
      notFound: true,
    };
  }
  const novel = {
    id: docSnapshot.id,
    ...data,
  };
  return {
    props: {
      novel: JSON.parse(JSON.stringify(novel)),
    },
  };
};
