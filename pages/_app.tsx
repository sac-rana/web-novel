import type { AppProps } from 'next/app';
import { createContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';
import Header from '../components/header';
import '../styles/global.css';

interface Context {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}

// UserContext to maintain global user logged in state
export const UserContext = createContext<Context>({} as Context);

function MyApp({ Component, pageProps }: AppProps) {
  // checking whether user is logged in or not
  const [user, loading, error] = useAuthState(auth);
  return (
    <UserContext.Provider value={{ user, loading, error }}>
      <Header />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
