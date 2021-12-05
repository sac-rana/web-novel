import styles from './styles/header.module.scss';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  return (
    <>
      <div className={styles.header}>
        <div onClick={() => router.push('/')}>Novel WEBAPP</div>
        <div
          onClick={() => router.push('/add-novel')}
          className={styles.createNovelButton}
        >
          Create Novel
        </div>
      </div>
    </>
  );
}
