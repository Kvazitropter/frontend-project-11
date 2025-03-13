import axios from 'axios';

export default async (url) => {
  const allOriginsUrl = new URL('/get', 'https://allorigins.hexlet.app');
  allOriginsUrl.searchParams.append('url', url);

  return axios.get(allOriginsUrl)
    .then((response) => response.data.contents)
    .catch((e) => {
      throw new Error(e.message);
    });
};
