import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { prisma, admin } from '../../lib/backend-utils';
import { profileSchema } from '../../lib/utils';
import { assert } from 'joi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.status(400).send('Bad request');
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await getAuth(admin).verifyIdToken(idToken);
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }
  if (req.method === 'GET') {
    try {
      const profile =
        await prisma.$queryRaw`SELECT id, title, cardinality(chapters) AS no_of_chapters from novels where author_id=${decodedToken.uid}`;
      if (!profile) return res.status(204).send('Profile does not exist');
      return res.json(profile);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
  }

  const { authorName } = req.body;
  try {
    assert(authorName, profileSchema);
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
  try {
    await prisma.profile.create({
      data: {
        uid: decodedToken.uid,
        name: authorName,
        email: decodedToken.email!,
      },
    });
    res.status(201).send('Profile created');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
}
