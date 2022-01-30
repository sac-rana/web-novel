import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/backend-utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { id, chapterNo } = req.query;
    let chapter: { content: string };
    try {
      [chapter] = await prisma.$queryRaw`SELECT chapters[${parseInt(
        chapterNo as string,
      )}] AS content from novels`;
    } catch (err) {
      return res.status(500).send(err);
    }
    if (!chapter) {
      console.log(`ID=${id}, chapterNo=${chapterNo}`);
      return res.status(404).send('This chapter does not exist');
    }
    return res.send(chapter.content);
  }
  const { id, chapterContent } = req.body;
  await prisma.novel.update({
    where: {
      id,
    },
    data: {
      chapters: {
        push: chapterContent,
      },
    },
  });
  res.status(200).send('Chapter added');
}
