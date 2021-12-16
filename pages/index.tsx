import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import NovelCard from '../components/novel-card';
import Header from '../components/header';
import {
  getFirestore,
  getDocs,
  collection,
  query,
  limit,
  orderBy,
} from 'firebase/firestore';
import { app } from '../lib/firebase';

interface Novel {
  id: string;
  title: string;
  image: string;
}

const Home: NextPage<{
  novels: Novel[];
}> = ({ novels }) => {
  console.log(novels);
  return (
    <div className={styles.container}>
      <Head>
        <title>PWA Novel App</title>
      </Head>

      <Header />

      <main>
        {novels.map(({ id, title, image }) => (
          <NovelCard key={id} title={title} image={image} />
        ))}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const firestore = getFirestore(app);
  const q = query(
    collection(firestore, 'rooms'),
    orderBy('lastModified', 'desc'),
    limit(10),
  );
  const querySnapshot = await getDocs(q);
  const novels = querySnapshot.docs.map(doc => doc.data());
  return {
    props: {
      novels,
    },
  };
};

export default Home;
