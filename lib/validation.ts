import joi from 'joi';

export const novelSchema = joi.object({
  title: joi.string().alphanum().min(5).max(100).required(),
  description: joi.string(),
  imgFile: joi.binary().required(),
});

export const novelDBSchema = joi.object({
  title: joi.string().alphanum().min(5).max(100).required(),
  description: joi.string(),
  imgFile: joi.string().required(),
});

export const profileSchema = joi.string().alphanum().min(3).max(30).required();

export const chapterContentSchema = joi.string().min(50).required();
