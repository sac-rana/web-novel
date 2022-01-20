import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { prisma, admin } from '../../lib/backend-utils';
import { profileSchema } from '../../lib/validation';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.status(401).send('Unauthorized');
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  return new Promise<void>(async (resolve, _) => {
    try {
      const decodedToken = await getAuth(admin).verifyIdToken(idToken);
      if (req.method === 'GET') {
        const profile = await prisma.profile.findUnique({
          where: {
            uid: decodedToken.uid,
          },
          include: {
            novels: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        if (!profile) return res.send({ profileExist: false });
        res.json({ profileExist: true, profile });
      } else {
        const { value: authorName, error } = profileSchema.validate(
          req.body.authorName,
        );
        if (error) return res.status(400).send(error.message);
        await prisma.profile.create({
          data: {
            uid: decodedToken.uid,
            name: authorName,
            email: decodedToken.email!,
          },
        });
        res.status(201).send('Profile created');
      }
    } catch (err) {
      res.status(500).send('server error');
    } finally {
      resolve();
    }
  });
}
