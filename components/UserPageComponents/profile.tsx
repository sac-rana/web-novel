import { useContext } from 'react';
import { ProfileContext } from '../../pages/user';

export default function Profile() {
  const { profile } = useContext(ProfileContext);
  return (
    <div className='p-2 text-lg'>
      <h1>{profile.name}</h1>
    </div>
  );
}
