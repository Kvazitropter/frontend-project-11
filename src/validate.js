import { string, setLocale } from "yup";

setLocale({
  string: {
    url: "feedb_invalid",
  },
  mixed: {
    notOneOf: "feedb_repeat",
  },
});

export default (url, postedUrls) => {
  const schema = string().url().notOneOf(postedUrls);
  return schema.validate(url);
};
