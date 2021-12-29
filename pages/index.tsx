import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/home.module.scss';
import NovelCard from '../components/novel-card';
import { getDocs, collection, query, limit, orderBy } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { Collection } from '../lib/constants';
import { firebaseNovelConvertor } from '../lib/types';

interface Novel {
  id: string;
  title: string;
  imgUrl: string;
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  novels,
}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>PWA Novel App</title>
      </Head>

      <main>
        {novels.map(({ id, title, imgUrl }) => (
          <NovelCard key={id} id={id} title={title} imgUrl={imgUrl} />
        ))}
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ novels: Novel[] }> = async () => {
  const q = query(
    collection(firestore, Collection.NOVELS),
    orderBy('lastModified', 'desc'),
    limit(10),
  ).withConverter(firebaseNovelConvertor);
  const querySnapshot = await getDocs(q);
  const novels = querySnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data()!.title,
    imgUrl: doc.data()!.imgUrl,
  }));
  return {
    props: {
      novels: JSON.parse(JSON.stringify(novels)),
    },
    revalidate: 60,
  };
};

export default Home;
