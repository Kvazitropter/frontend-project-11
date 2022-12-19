import { uniqueId } from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const id = uniqueId();

  const links = [];
  const items = doc.querySelectorAll('item');
  items.forEach((item) => {
    const name = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    links.push({ feedId: id, link, name });
  });

  return [{ id, content: { title, description } }, links];
};
