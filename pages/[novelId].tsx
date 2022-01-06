import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Collection, ImageDimensions } from '../lib/utils';
import { Novel, firebaseNovelConvertor } from '../lib/types';
import ChapterComponent from '../components/chapter';
import { useState } from 'react';
import Image from 'next/image';

export default function NovelPage({
  novel,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>();
  return (
    <div>
      {currentChapterIndex === undefined && (
        <main className='grid grid-cols-6 justify-center gap-y-4 px-3 py-4'>
          <section className='col-span-4 col-start-2'>
            <h1 className='text-center text-2xl'>{novel.title}</h1>
            <div>
              <Image
                src={novel.imgUrl}
                alt={novel.title}
                layout='responsive'
                width={ImageDimensions.WIDTH}
                height={ImageDimensions.HEIGHT}
              />
            </div>
          </section>
          <section className='col-span-6'>
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
          <section className='col-span-6'>
            <div>Chapters</div>
            {novel.chapters.length !== 0 ? (
              novel.chapters.map((chapter, i) => (
                <p
                  key={chapter.chapterNo}
                  onClick={() => setCurrentChapterIndex(i)}
                >
                  Chapter: {chapter.chapterNo}
                </p>
              ))
            ) : (
              <p>No chapter yet.</p>
            )}
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
    revalidate: 60,
  };
};
