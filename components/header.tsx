import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from '../pages/_app';
import Image from 'next/image';
import Link from 'next/link';
import { HashLoader } from 'react-spinners';

const SignIn = () => {
  signInWithPopup(auth, new GoogleAuthProvider());
};

export default function Header() {
  const { user, loading, error } = useContext(UserContext);
  if (error) throw error;
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
        {loading ? <HashLoader color='white' size={30} /> : <Nav user={user} />}
      </div>
    </header>
  );
}

const Nav = ({ user }: { user: User | null | undefined }) => {
  // if user not logged in show sign in button else profile button
  if (!user) return <button onClick={SignIn}>Sign In</button>;
  return (
    <>
      <button onClick={() => signOut(auth)}>Sign Out</button>
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
  );
};
