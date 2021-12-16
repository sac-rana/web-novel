import styles from './styles/header.module.scss';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const SignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };
  return (
    <div className={styles.header}>
      <div onClick={() => router.push('/')}>Novel WEBAPP</div>
      {user ? (
        <input
          className={styles.user}
          type='image'
          src={user.photoURL!}
          alt='user'
          onClick={() => router.push('/user')}
        />
      ) : (
        <button onClick={SignIn}>SignIn</button>
      )}
    </div>
  );
}
