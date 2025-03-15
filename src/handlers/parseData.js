export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  const parseError = parsedData.querySelector('parsererror');

  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;
    throw error;
  }

  const feedTitle = parsedData.querySelector('rss channel title').textContent;
  const feedDescription = parsedData.querySelector('rss channel description').textContent;
  const items = parsedData.querySelectorAll('rss channel item');
  const posts = [...items].map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description');
    const link = item.querySelector('link').textContent;
    return {
      title: postTitle,
      description: postDescription,
      link,
    };
  });

  return {
    feedTitle,
    feedDescription,
    posts,
  };
};
