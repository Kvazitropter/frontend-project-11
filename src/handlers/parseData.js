export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;

  const links = [];
  const items = doc.querySelectorAll('item');
  items.forEach((item) => {
    const name = item.querySelector('title').textContent;
    const desc = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    links.push({
      title: name,
      description: desc,
      link,
    });
  });

  return {
    newFeed: { title, description },
    newPosts: links,
  };
};
