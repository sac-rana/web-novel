import '../styles/globals.scss';
import 'react-tabs/style/react-tabs.scss';

import type { AppProps } from 'next/app';
import { createContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../lib/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { Collection } from '../lib/utils';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { User } from 'firebase/auth';
import { firebaseAuthorConvertor } from '../lib/types';
import Header from '../components/header';

interface Context {
  user: User | null | undefined;
  profileInfo: any;
  loading: boolean;
}

export const UserContext = createContext<Context>({
  user: undefined,
  profileInfo: undefined,
  loading: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  const firestore = getFirestore(app);
  const [user, userLoading] = useAuthState(auth);
  const docRef = user
    ? doc(firestore, Collection.AUTHORS, user.uid).withConverter(
        firebaseAuthorConvertor,
      )
    : null;
  const [data, dataLoading] = useDocumentDataOnce(docRef, {
    idField: 'id',
  });
  const loading = userLoading || dataLoading;
  return (
    <UserContext.Provider value={{ user, profileInfo: data, loading }}>
      <Header />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
export default MyApp;
