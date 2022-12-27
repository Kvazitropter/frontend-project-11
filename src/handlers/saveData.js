import { uniqueId } from 'lodash';

export default (watchedState, state, parsedData) => {
  const { newFeed, newPosts } = parsedData;
  const feedId = uniqueId();

  const newUIStates = [];
  const newPostsWithId = [];
  newPosts.forEach(({ title, description, link }) => {
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

  watchedState.feeds.push({ id: feedId, content: newFeed });
  watchedState.posts.push(...newPostsWithId);
  state.uiState.postLinks.push(...newUIStates);
};
