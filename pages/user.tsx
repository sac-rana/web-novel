import { createContext, FormEventHandler, useContext, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ProfileTab from '../components/profile';
import CreateNovelTab from '../components/create-novel';
import MyNovelsTab from '../components/my-novels';
import { UserContext } from './_app';
import 'react-tabs/style/react-tabs.css';
import useProfile from '../lib/useProfile';
import { Profile } from '@prisma/client';
import { HashLoader } from 'react-spinners';
import { profileSchema } from '../lib/utils';
import { User } from 'firebase/auth';

interface Context {
  profile: Profile & { novels: { id: string; title: string }[] };
  loading: boolean;
}

export const ProfileContext = createContext<Context>({} as Context);

export default function User() {
  const { user } = useContext(UserContext);
  const [profile, profileLoading] = useProfile(user);
  if (!user) return <h1>401 Not Authenticated</h1>;

  if (profileLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <HashLoader color='teal' size={70} />
      </div>
    );
  }

  if (!profile) return <Form user={user} />;

  return (
    <ProfileContext.Provider value={{ profile, loading: profileLoading }}>
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
              <MyNovelsTab />
            </TabPanel>
            <TabPanel>
              <CreateNovelTab />
            </TabPanel>
            <TabPanel>
              <ProfileTab />
            </TabPanel>
          </Tabs>
        </main>
      </div>
    </ProfileContext.Provider>
  );
}

const Form = ({ user }: { user: User }) => {
  const [authorName, setAuthorName] = useState('');
  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    const idToken = await user.getIdToken();
    const { value, error } = profileSchema.validate(authorName);
    if (error) throw error;
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + idToken,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        authorName: value,
      }),
    });
    if (!res.ok) throw new Error('Profile not created');
    document.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className='p-2'>
      <div>
        Please create a Author Name which will be displayed with your novel.
      </div>
      <section>
        <div className='mb-4 flex flex-col'>
          <label htmlFor='authorName' className='mb-2'>
            Author Name
          </label>
          <input
            type='text'
            name='authorName'
            id='authorName'
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
          />
        </div>
        <div className='flex justify-center'>
          <button className='w-full p-2 my-3 text-2xl bg-primary text-primary-text'>
            Submit
          </button>
        </div>
      </section>
    </form>
  );
};
