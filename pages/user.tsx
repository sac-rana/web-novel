import Header from '../components/header';
import { FormEventHandler, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Profile from '../components/profile';
import { useAuthState } from 'react-firebase-hooks/auth';
import CreateNovel from '../components/create-novel';
import { app, auth } from '../lib/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { AUTHORS } from '../lib/constants';

export default function User() {
  const [user, userLoading, userError] = useAuthState(auth);
  const firestore = getFirestore(app);
  const docRef = user ? doc(firestore, AUTHORS, user.uid) : null;
  const [data, dataLoading, dataError] = useDocumentDataOnce(docRef, {
    idField: 'id',
  });
  const [authorName, setAuthorName] = useState('');
  if (userLoading || dataLoading) return <h1>Loading...</h1>;
  if (!user) return <h1>401 Not Authenticated</h1>;

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    const firestore = getFirestore();
    await setDoc(doc(firestore, AUTHORS, user.uid), {
      authorName,
    });
    document.location.reload();
  };

  if (!data)
    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor='authorName'>Author Name: </label>
        <input
          type='text'
          name='authorName'
          id='authorName'
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
    );

  return (
    <div>
      <Header />
      <main>
        <Tabs>
          <TabList>
            <Tab>
              <p>My Novels</p>
            </Tab>
            <Tab>
              <p>Create Novel</p>
            </Tab>
            <Tab>
              <p>Profile</p>
            </Tab>
          </TabList>
          <TabPanel>
            <h1>Novels</h1>
          </TabPanel>
          <TabPanel>
            <CreateNovel />
          </TabPanel>
          <TabPanel>
            <Profile profileInfo={data} />
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
}
