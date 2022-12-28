import { string, setLocale } from 'yup';

setLocale({
  string: {
    url: 'feedback.invalid',
  },
  mixed: {
    required: 'feedback.empty',
    notOneOf: 'feedback.repeat',
  },
});

export default (url, postedUrls) => {
  const schema = string().url().required().notOneOf(postedUrls);
  return schema.validate(url);
};
