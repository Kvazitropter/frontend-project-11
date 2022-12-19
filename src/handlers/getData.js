import axios from 'axios';

export default (linkStr) => {
  const url = new URL('/get', 'https://allorigins.hexlet.app');
  url.searchParams.append('url', linkStr);
  url.searchParams.append('disableCache', 'true');
  return axios.get(url)
    .then((response) => response.data.contents);
};
