import styles from '../styles/Chapter.module.scss';
import Header from '../../components/header';
import type { GetServerSideProps, NextPage } from 'next';
import {getFirestore, collection, getDoc} from 'firebase/firestore';

const Chapter: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({query}) => {

  return {
    props: {}
  }
}
