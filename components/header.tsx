import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from '../pages/_app';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const SignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };
  return (
    <header className='bg-primary text-primary-text h-12 px-2 container flex items-center justify-between'>
      <Link href={'/'}>
        <a>
          <div id='logo' className='text-lg'>
            Novel WebApp
          </div>
        </a>
      </Link>
      <div className='flex space-x-8 mt-0 text-base font-medium'>
        {user ? (
          <>
            <button onClick={() => signOut(auth)}>SignOut</button>
            <Link href={'/user'}>
              <a className='block w-10 h-10 max-h-full'>
                <Image
                  src={user.photoURL!}
                  alt='User Profile'
                  layout='responsive'
                  width={10}
                  height={10}
                />
              </a>
            </Link>
          </>
        ) : (
          <button onClick={SignIn}>SignIn</button>
        )}
      </div>
    </header>
  );
}
