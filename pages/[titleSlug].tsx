import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ImageDimensions } from '../lib/utils';
import ChapterComponent from '../components/chapter';
import { useState } from 'react';
import Image from 'next/image';
import { prisma } from '../lib/backend-utils';
// TODO: fix this page

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
  const novels = await prisma.novel.findMany({
    select: {
      titleSlug: true,
    },
  });
  const paths = novels.map(novel => ({
    params: { titleSlug: novel.titleSlug },
  }));
  return { paths, fallback: false };
};

interface Novel {
  id: string;
  title: string;
  titleSlug: string;
  description: string;
  imgUrl: string;
  authorId: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const titleSlug = params!.titleSlug as string;
  // const novel = await prisma.novel.findUnique({
  //   where: {
  //     titleSlug,
  //   },
  // });
  const novel =
    await prisma.$queryRaw`select (id, title, title_slug, description, img_url, author_id)`;
  if (!novel) throw new Error(`Novel with ID ${titleSlug} does not exist!`);
  return {
    props: {
      novel: JSON.parse(JSON.stringify(novel)),
    },
    revalidate: 60,
  };
};
