import _ from 'lodash';

export const saveNewPosts = (watchedState, posts) => {
  const newPosts = _.differenceWith(
    posts,
    watchedState.posts,
    (post1, post2) => post1.link === post2.link,
  ).reverse();

  newPosts.forEach(({ title, description, link }) => {
    watchedState.posts.push({
      id: _.uniqueId(),
      title,
      description,
      link,
    });
  });
};

export default (watchedState, { feedTitle, feedDescription, posts }) => {
  const feedId = _.uniqueId();
  watchedState.feeds.push({
    id: feedId,
    title: feedTitle,
    description: feedDescription,
  });
  saveNewPosts(watchedState, posts, feedId);
};
