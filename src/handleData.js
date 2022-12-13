import { uniqueId } from 'lodash';
import axios from 'axios';

export const getData = (linkStr) => {
  const url = new URL(`https://allorigins.hexlet.app/raw?url=${linkStr}`);
  return axios.get(url)
    .then((response) => response.data);
};

export const parseData = (data) => {
  const parser = new DOMParser();
  const html = parser.parseFromString(data, 'text/html');

  const title = html.querySelector('title').textContent;
  const description = html.querySelector('description').textContent;
  const id = uniqueId();

  const links = [];
  const items = html.querySelectorAll('item');
  items.forEach((item) => {
    const name = item.querySelector('title').textContent;
    const link = item.querySelector('link').nextSibling.textContent.trim();
    links.push({ link, name });
  });

  return [{ id, content: { title, description } }, { feedId: id, links }];
};

export const saveData = (state, parsedData) => {
  const [newFeed, newPosts] = parsedData;
  state.posts.push(newPosts);
  state.feeds.push(newFeed);
};
