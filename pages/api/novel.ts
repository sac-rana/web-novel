import { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';
import { parseRequest } from '../../lib/backend-utils';
import { getAuth } from 'firebase-admin/auth';
import { prisma, admin } from '../../lib/backend-utils';

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
    console.log('No authorization headers');
    return res.status(401).send('Unauthorized');
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  return new Promise<void>(async (resolve, _) => {
    let decodedIdToken;
    try {
      decodedIdToken = await getAuth(admin).verifyIdToken(idToken);
    } catch (err) {
      console.log(err);
      return res.status(401).send(err);
    }
    let novel;
    try {
      novel = await parseRequest(req);
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
    const slugifiedTitle = slugify(novel.title, {
      lower: true,
    });
    try {
      await prisma.novel.create({
        data: {
          title: novel.title,
          titleSlug: slugifiedTitle,
          description: novel.description,
          imgUrl: novel.imgUrl,
          chapters: [],
          authorId: decodedIdToken.uid,
        },
      });
      res.status(200).send('Novel created');
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
    resolve();
  });
}
