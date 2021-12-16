import '../styles/globals.css';
import 'react-tabs/style/react-tabs.scss';

import type { AppProps } from 'next/app';
import { createContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../lib/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { AUTHORS } from '../lib/constants';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { User } from 'firebase/auth';

interface Context {
  user: User | null | undefined;
  profileInfo:
    | {
        id: string;
        authorName: string;
      }
    | undefined;
}

export const UserContext = createContext<Context | null>(null);

function MyApp({ Component, pageProps }: AppProps) {
  const firestore = getFirestore(app);
  const [user] = useAuthState(auth);
  const docRef = user ? doc(firestore, AUTHORS, user.uid) : null;
  const [data] = useDocumentDataOnce(docRef, {
    idField: 'id',
  });
  return (
    <UserContext.Provider value={{ user, profileInfo: data }}>
      <Component {...pageProps} />;
    </UserContext.Provider>
  );
}
export default MyApp;
