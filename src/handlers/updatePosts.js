import fetchData from './fetchData.js';
import parseData from './parseData.js';
import { saveNewPosts } from './saveData.js';

const updatePosts = (url, watchedState, timeout) => {
  setTimeout(() => {
    fetchData(url)
      .then((data) => {
        saveNewPosts(watchedState, parseData(data).posts);
        updatePosts(url, watchedState, timeout);
      })
      .catch((error) => console.error(error));
  }, timeout);
};

export default updatePosts;
