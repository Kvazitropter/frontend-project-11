import { uniqueId } from 'lodash';

const saveNewFeed = (watchedState, feed, id) => {
  watchedState.feeds.push({ id, content: feed });
};

export const saveNewPosts = (watchedState, state, posts, feedId) => {
  const newUIStates = [];
  const newPostsWithId = [];
  posts.forEach(({ title, description, link }) => {
    const postId = uniqueId();
    newUIStates.push({ postId, read: false });
    newPostsWithId.push({
      feedId,
      id: postId,
      title,
      description,
      link,
    });
  });

  watchedState.posts.push(...newPostsWithId);
  state.uiState.postLinks.push(...newUIStates);
};

export const saveData = (watchedState, state, parsedData) => {
  const { newFeed, newPosts } = parsedData;
  const feedId = uniqueId();

  saveNewFeed(watchedState, newFeed, feedId);
  saveNewPosts(watchedState, state, newPosts, feedId);
};
