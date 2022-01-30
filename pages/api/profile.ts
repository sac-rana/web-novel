import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { prisma, admin } from '../../lib/backend-utils';
import { profileSchema } from '../../lib/utils';
import { assert } from 'joi';
import { MyProfile } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyProfile | string>,
) {
  // check if authorization headers exist
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.status(400).send('Bad request');
  }

  // verify the user
  const idToken = req.headers.authorization.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await getAuth(admin).verifyIdToken(idToken);
  } catch (err) {
    return res.status(401).send('Unauthorized');
  }

  // if user is asking to get profile info
  if (req.method === 'GET') {
    try {
      const profile = await prisma.profile.findUnique({
        select: {
          name: true,
        },
        where: {
          id: decodedToken.uid,
        },
      });
      // profile does not exist
      if (!profile)
        return res.status(403).send('You have not created your profile');

      // send profile data
      const authorNovels =
        (await prisma.$queryRaw`SELECT id, title, cardinality(chapters) AS "noOfChapters" from novels where author_id=${decodedToken.uid}`) ||
        [];
      return res.json({
        authorName: profile.name,
        novels: authorNovels as any,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server error');
    }
  }

  // if user is creating a profile
  const { authorName } = req.body;
  try {
    assert(authorName, profileSchema); // checking if user sent valid name
  } catch (err) {
    return res.status(400).send((err as Error).message);
  }
  // create profile
  try {
    await prisma.profile.create({
      data: {
        id: decodedToken.uid,
        name: authorName,
        email: decodedToken.email!,
      },
    });
    return res.status(201).send('Profile created');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
}
