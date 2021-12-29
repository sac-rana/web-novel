import styles from './styles/header.module.scss';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from '../pages/_app';

export default function Header() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const SignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };
  return (
    <div className={styles.header}>
      <button onClick={() => router.push('/')}>Novel WebApp</button>
      {user ? (
        <div className={styles.login_logout}>
          <button onClick={() => signOut(auth)}>Logout</button>
          <button className={styles.user} onClick={() => router.push('/user')}>
            <img src={user.photoURL!} alt='User Profile' />
          </button>
        </div>
      ) : (
        <button onClick={SignIn}>SignIn</button>
      )}
    </div>
  );
}
