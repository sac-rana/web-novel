import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ImageDimensions } from '../lib/utils';
import Image from 'next/image';
import { prisma } from '../lib/backend-utils';
import Link from 'next/link';

export default function NovelPage({
  novel,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { id, title, description, imgUrl, authorName, noOfChapters } = novel;
  return (
    <main className='grid grid-cols-6 justify-center gap-y-4 px-3 py-4'>
      <section className='col-span-4 col-start-2'>
        <h1 className='text-center text-2xl'>{title}</h1>
        <div>
          <Image
            src={imgUrl}
            alt={title}
            layout='responsive'
            width={ImageDimensions.WIDTH}
            height={ImageDimensions.HEIGHT}
          />
        </div>
      </section>
      <section className='col-span-6'>
        <div>
          <strong> Name: </strong>
          {title}
        </div>
        <div>
          <strong>Rating:</strong> 5
        </div>
        <div>
          <strong>Author: </strong>
          {authorName}
        </div>
        <pre>
          <strong>Description: </strong>
          {description}
        </pre>
      </section>
      <section className='col-span-6'>
        <div>Chapters</div>
        <ul>
          {noOfChapters === 0 ? (
            <p>No chapters</p>
          ) : (
            new Array(noOfChapters).fill(0).map((_, i) => (
              <Link href={`/${id}/${i + 1}`} key={i}>
                <a className='block'>Chapter {i + 1}</a>
              </Link>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const novels = await prisma.novel.findMany({
    select: {
      id: true,
    },
  });
  const paths = novels.map(novel => ({
    params: { titleSlug: novel.id },
  }));
  return { paths, fallback: false };
};

interface Novel {
  id: string;
  title: string;
  description: string;
  imgUrl: string;
  noOfChapters: number;
  authorName: string;
}

export const getStaticProps: GetStaticProps<{ novel: Novel }> = async ({
  params,
}) => {
  const titleSlug = params!.titleSlug as string;
  const [novel]: Novel[] =
    await prisma.$queryRaw`SELECT novels.id, novels.title, novels.img_url AS "imgUrl", novels.description, cardinality(novels.chapters) AS "noOfChapters", profiles.name AS "authorName" from novels JOIN profiles ON novels.author_id=profiles.id  where novels.id=${titleSlug}`;
  if (!novel) throw new Error(`Novel with ID ${titleSlug} does not exist!`);
  return {
    props: {
      novel,
    },
    revalidate: 60,
  };
};
