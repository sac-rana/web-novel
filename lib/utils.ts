export const Collection = {
  AUTHORS: 'authors',
  NOVELS: 'novels',
  EXTRAS: 'extras',
} as const;

export const ImageDimensions = {
  WIDTH: 300,
  HEIGHT: 380,
} as const;

import { User } from 'firebase/auth';
interface Novel {
  title: string;
  description: string;
  imgFile: File;
}
export const uploadNovel = async (user: User, novel: Novel) => {
  //TODO: verify data given by user
  const idToken = await user.getIdToken();
  const formData = new FormData();
  formData.append('imgFile', novel.imgFile);
  formData.append('title', novel.title);
  formData.append('description', novel.description);
  const res = await fetch('/api/novel', {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + idToken,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(res.statusText);
};

import joi from 'joi';
export const novelSchema = joi.object({
  title: joi
    .string()
    .pattern(/^[\w\-, ]+$/)
    .min(3)
    .max(100)
    .required(),
  description: joi.string(),
});

export const profileSchema = joi.string().alphanum().min(3).max(30).required();

export const chapterContentSchema = joi.string().min(50).required();
