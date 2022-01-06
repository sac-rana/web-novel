import { useContext } from 'react';
import { UserContext } from '../pages/_app';

export default function Profile() {
  const { profileInfo } = useContext(UserContext);
  return (
    <div className='p-2 text-lg'>
      <h1>{profileInfo!.authorName}</h1>
    </div>
  );
}
