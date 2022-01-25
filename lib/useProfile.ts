import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { MyProfile } from './types';

export default function useProfile(
  user: User | null | undefined,
): [MyProfile | null, boolean] {
  const [loading, setLoading] = useState(true);
  const [MyProfile, setMyNovels] = useState<MyProfile | null>(null);
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + idToken,
        },
      });
      if (!res.ok) throw new Error('Error getting profile data');
      if (res.status === 204) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setMyNovels(data);
      setLoading(false);
    };
    fetchData();
  }, [user]);
  return [MyProfile, loading];
}
