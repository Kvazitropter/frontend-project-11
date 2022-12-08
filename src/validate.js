import { string } from "yup";

export default (url, postedUrls) => {
  const schema = string().url().notOneOf(postedUrls);
  return schema.validate(url);
};
