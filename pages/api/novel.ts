import { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';
import { parseRequest } from '../../lib/backend-utils';
import { getAuth } from 'firebase-admin/auth';
import { prisma, admin } from '../../lib/backend-utils';
import { nanoid } from 'nanoid';

export const config = {
  api: {
    bodyParser: false, // because multipart formdata is being recieved
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // check if authorization headers exist
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('No authorization headers');
    return res.status(401).send('Unauthorized');
  }

  // verify the user
  const idToken = req.headers.authorization.split('Bearer ')[1];
  let decodedIdToken;
  try {
    decodedIdToken = await getAuth(admin).verifyIdToken(idToken);
  } catch (err) {
    console.log(err);
    return res.status(401).send(err);
  }

  // parse the novel sent
  let novel;
  try {
    novel = await parseRequest(req);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }

  // add novel to database
  try {
    await prisma.novel.create({
      data: {
        id: getId(novel.title),
        title: novel.title,
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
}

// function to generate unique slug or id for each novel based on the title of novel
function getId(title: string) {
  const slugifiedTitle = slugify(title, {
    lower: true,
  });
  return slugifiedTitle + '_' + nanoid(12);
}
