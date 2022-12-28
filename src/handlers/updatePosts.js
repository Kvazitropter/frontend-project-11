import _ from 'lodash';
import getData from './getData.js';
import parseData from './parseData';
import { saveNewPosts } from './saveData.js';

const updatePosts = (watchedState, state, source, feedId) => {
  const currPosts = state.posts.map(({ title, description, link }) => ({
    title,
    description,
    link,
  }));
  getData(source)
    .then((data) => {
      const { newPosts } = parseData(data);
      const newLinks = _.differenceWith(newPosts, currPosts, _.isEqual);
      saveNewPosts(watchedState, state, newLinks, feedId);
      setTimeout(updatePosts, 5000, watchedState, state, source, feedId);
    });
};

export default updatePosts;
