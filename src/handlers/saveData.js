export default (state, parsedData) => {
  const [newFeed, newPosts] = parsedData;
  state.feeds.push(newFeed);
  state.posts.push(...newPosts);
};
