import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ImageDimensions } from '../lib/utils';
import Image from 'next/image';
import { prisma } from '../lib/backend-utils';

export default function NovelPage({
  novel,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { title, description, img_url, author_name, no_of_chapters } = novel;
  return (
    <main className='grid grid-cols-6 justify-center gap-y-4 px-3 py-4'>
      <section className='col-span-4 col-start-2'>
        <h1 className='text-center text-2xl'>{title}</h1>
        <div>
          <Image
            src={img_url}
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
          {author_name}
        </div>
        <pre>
          <strong>Description: </strong>
          {description}
        </pre>
      </section>
      <section className='col-span-6'>
        <div>Chapters</div>
        <ul>
          {no_of_chapters === 0 ? (
            <p>No chapters</p>
          ) : (
            new Array(no_of_chapters).map((_, i) => (
              <li key={i}>Chapter {i}</li>
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
      titleSlug: true,
    },
  });
  const paths = novels.map(novel => ({
    params: { titleSlug: novel.titleSlug },
  }));
  return { paths, fallback: false };
};

interface Novel {
  title: string;
  description: string;
  img_url: string;
  no_of_chapters: number;
  author_name: string;
}

export const getStaticProps: GetStaticProps<{ novel: Novel }> = async ({
  params,
}) => {
  const titleSlug = params!.titleSlug as string;
  const [novel]: Novel[] =
    await prisma.$queryRaw`SELECT novels.title, novels.img_url, novels.description, cardinality(novels.chapters) AS no_of_chapters, profiles.name AS author_name from novels JOIN profiles ON novels.author_id=profiles.uid  where novels.title_slug=${titleSlug}`;
  if (!novel) throw new Error(`Novel with ID ${titleSlug} does not exist!`);
  return {
    props: {
      novel,
    },
    revalidate: 60,
  };
};
