import { string } from 'yup';

export default async (url, existingUrls) => {
  const schema = string().url().required().notOneOf(existingUrls);
  return schema.validate(url);
};
