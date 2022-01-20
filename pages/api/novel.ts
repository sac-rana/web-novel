import { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';
import { parseRequest } from '../../lib/backend-utils';
import { getAuth } from 'firebase-admin/auth';
import { prisma, admin } from '../../lib/backend-utils';
import { novelDBSchema } from '../../lib/validation';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return res.status(401).send('Unauthorized');
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  return new Promise(async (resolve, _) => {
    try {
      const decodedIdToken = await getAuth(admin).verifyIdToken(idToken);
      const novel = await parseRequest(req);
      const { value, error } = novelDBSchema.validate(novel);
      const slugifiedTitle = slugify(value.title, {
        lower: true,
      });
      if (error) return res.status(400).send(error.message);
      // TODO: verify if author profile is created first
      await prisma.novel.create({
        data: {
          title: value.title,
          titleSlug: slugifiedTitle,
          description: value.description,
          imgUrl: value.imgUrl,
          authorId: decodedIdToken.uid,
        },
      });
      res.status(200);
    } catch (err) {
      res.status(500).send(err);
    }
  });
}
