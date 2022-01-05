import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from '../pages/_app';
import Image from 'next/image';

export default function Header() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const SignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };
  return (
    <div>
      <button onClick={() => router.push('/')}>Novel WebApp</button>
      {user ? (
        <div>
          <button onClick={() => signOut(auth)}>Logout</button>
          <button onClick={() => router.push('/user')}>
            <Image src={user.photoURL!} alt='User Profile' layout='fill' />
          </button>
        </div>
      ) : (
        <button onClick={SignIn}>SignIn</button>
      )}
    </div>
  );
}
