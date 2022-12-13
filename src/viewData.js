import { uniqueId } from 'lodash';

const feedsDiv = document.querySelector('.feeds');
const postsDiv = document.querySelector('.posts');

const createCard = (name, container) => {
  const card = document.createElement('div');
  card.setAttribute('class', 'card border-0');
  card.innerHTML = `<div class="card-body">\n<h2 class="card-title h4">${name}<h2>\n</div>`;
  const ulEl = document.createElement('ul');
  ulEl.setAttribute('class', 'list-group border-0 rounded-0');
  card.append(ulEl);
  container.append(card);
  return container.querySelector('.list-group');
};

const createFeedsLi = (title, description) => {
  const h3El = document.createElement('h3');
  h3El.setAttribute('class', 'h6 m-0');
  h3El.textContent = title;
  const pEl = document.createElement('p');
  pEl.setAttribute('class', 'm-0 small text-black-50');
  pEl.textContent = description;

  const liEl = document.createElement('li');
  liEl.setAttribute('class', 'list-group-elem border-0 border-end-0');
  liEl.append(h3El);
  liEl.append(pEl);
  return liEl;
};

const createPostsLiEls = (links) => links.map(({ link, name }) => {
  const liEl = document.createElement('li');
  const linkId = uniqueId();
  liEl.setAttribute(
    'class',
    'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
  );
  const aStr = `<a class="fw-bold" href="${link}" target="_blank" data-id="${linkId}" rel="noopener norefferer">${name}</a>`;
  const btnStr = `<button class="btn btn-outline-primary btn-sm" type="button" data-id="${linkId}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
  liEl.innerHTML = `${aStr}\n${btnStr}`;
  return liEl;
});

export default (feed, allPosts) => {
  const feedsCardUl = document.querySelector('.feeds .list-group')
    ?? createCard('Фиды', feedsDiv);
  const postsCardUl = document.querySelector('.posts .list-group')
    ?? createCard('Посты', postsDiv);

  const { id, content } = feed;
  const { title, description } = content;
  const [{ links }] = allPosts.filter(({ feedId }) => feedId === id);

  const feedLiEl = createFeedsLi(title, description);
  feedsCardUl.prepend(feedLiEl);

  const postsLiEls = createPostsLiEls(links);
  postsLiEls.forEach((el) => postsCardUl.prepend(el));
};
