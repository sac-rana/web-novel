import { FormEventHandler, useContext, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Profile from '../components/profile';
import CreateNovel from '../components/create-novel';
import MyNovels from '../components/my-novels';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Collection } from '../lib/constants';
import { UserContext } from './_app';
import styles from '../styles/user.module.scss';
import { firestore } from '../lib/firebase';

export default function User() {
  const { user, profileInfo, loading } = useContext(UserContext);
  const [authorName, setAuthorName] = useState('');
  if (loading) return <h1>Loading...</h1>;
  if (!user) return <h1>401 Not Authenticated</h1>;

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    await setDoc(doc(firestore, Collection.AUTHORS, user.uid), {
      authorName,
    });
    document.location.reload();
  };

  if (!profileInfo)
    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          Please create a Author Name which will be displayed with your novel.
        </div>
        <section>
          <label htmlFor='authorName'>Author Name: </label>
          <input
            type='text'
            name='authorName'
            id='authorName'
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
          />
          <button type='submit'>Submit</button>
        </section>
      </form>
    );

  return (
    <div>
      <main>
        <Tabs>
          <TabList>
            <Tab>
              <p>My Novels</p>
            </Tab>
            <Tab default={true}>
              <p>Create Novel</p>
            </Tab>
            <Tab>
              <p>Profile</p>
            </Tab>
          </TabList>
          <TabPanel>
            <MyNovels />
          </TabPanel>
          <TabPanel>
            <CreateNovel />
          </TabPanel>
          <TabPanel>
            <Profile />
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
}
