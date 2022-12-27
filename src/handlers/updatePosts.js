import _ from 'lodash';
import getData from './getData.js';
import parseData from './parseData';

const updatePosts = (watchedState, posts, source) => {
  const currPosts = posts.map(({ title, description, link }) => ({ title, description, link }));
  getData(source)
    .then((data) => {
      const { newPosts } = parseData(data);
      const newLinks = _.differenceWith(newPosts, currPosts, _.isEqual);
      watchedState.posts.push(...newLinks);
      setTimeout(updatePosts, 5000, watchedState, posts, source);
    });
};

export default updatePosts;
