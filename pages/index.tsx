import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import NovelCard from '../components/novel-card';
import { prisma } from '../lib/backend-utils';

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  novels,
}) => {
  return (
    <div>
      <Head>
        <title>PWA Novel App</title>
      </Head>
      <main className='grid grid-cols-2 gap-2 p-2'>
        {novels.map(({ id, title, titleSlug, imgUrl }) => (
          <NovelCard
            key={id}
            title={title}
            titleSlug={titleSlug}
            imgUrl={imgUrl}
          />
        ))}
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  novels: { id: string; title: string; titleSlug: string; imgUrl: string }[];
}> = async () => {
  const novels = await prisma.novel.findMany({
    select: {
      id: true,
      title: true,
      titleSlug: true,
      imgUrl: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 10,
  });
  return {
    props: {
      novels,
    },
    revalidate: 60,
  };
};

export default Home;
