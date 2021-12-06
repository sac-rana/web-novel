import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '../lib/firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Profile() {
  const [user] = useAuthState(auth);
  const [authorName, setAuthorName] = useState('');
  const router = useRouter();
  const handleSubmit = async () => {
    if (!user) return;
    const firestore = getFirestore(app);
    await addDoc(collection(firestore, 'authors', user.uid), {
      authorName,
    });
    router.push('/user');
  };
  return (
    <>
      {user ? (
        <div>
          <label htmlFor='authorName'>Author Name: </label>
          <input type='text' name='authorName' id='authorName' />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <div>Login first</div>
      )}
    </>
  );
}
