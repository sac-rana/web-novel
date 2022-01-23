import { createContext, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ProfileTab from '../components/UserPageComponents/profile';
import CreateNovelTab from '../components/UserPageComponents/create-novel';
import MyNovelsTab from '../components/UserPageComponents/my-novels';
import ProfileForm from '../components/UserPageComponents/profile-form';
import { UserContext } from './_app';
import 'react-tabs/style/react-tabs.css';
import useProfile from '../lib/useProfile';
import { Profile } from '@prisma/client';
import { HashLoader } from 'react-spinners';

interface Context {
  profile: Profile & { novels: { id: string; title: string }[] };
  loading: boolean;
}

export const ProfileContext = createContext<Context>({} as Context);

export default function UserPage() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [profile, profileLoading] = useProfile(user);
  if (userLoading) {
    return (
      <div className='flex justify-center items-center h-[400px]'>
        <HashLoader color='teal' size={70} />
      </div>
    );
  }

  if (!user) return <h1>401 Not Authenticated</h1>;

  if (profileLoading) {
    return (
      <div className='flex justify-center items-center h-[400px]'>
        <HashLoader color='teal' size={70} />
      </div>
    );
  }

  if (!profile) return <ProfileForm user={user} />;

  return (
    <ProfileContext.Provider value={{ profile, loading: profileLoading }}>
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
    </ProfileContext.Provider>
  );
}
