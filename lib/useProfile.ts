import { Profile } from '@prisma/client';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

type CustomProfile = Profile & {
  novels: { id: string; title: string }[];
};

export default function useProfile(
  user: User | null | undefined,
): [CustomProfile | null, boolean] {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomProfile | null>(null);
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
      setProfile(data);
      setLoading(false);
    };
    fetchData();
  }, [user]);
  return [profile, loading];
}
