import axios from 'axios';

export default async (url) => {
  const allOriginsUrl = new URL('/get', 'https://allorigins.hexlet.app');
  allOriginsUrl.searchParams.append('url', url);
  allOriginsUrl.searchParams.append('disableCache', 'true');

  return axios.get(allOriginsUrl)
    .then((response) => response.data.contents)
    .catch((error) => {
      throw error;
    });
};
