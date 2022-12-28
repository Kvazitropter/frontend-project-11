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
  liEl.setAttribute('class', 'list-group-item border-0 border-end-0');
  liEl.append(h3El);
  liEl.append(pEl);
  return liEl;
};

const modalTitle = document.querySelector('.modal-title');
const modalDesc = document.querySelector('.modal-body');
const modalBtnReadFull = document.querySelector('.full-article');

const viewModal = (title, description, link) => {
  modalTitle.textContent = title;
  modalDesc.textContent = description;
  modalBtnReadFull.setAttribute('href', link);
};

const createPostsLiEls = (links, uiState, btnText) => links.map(({
  id, title, description, link,
}) => {
  const liEl = document.createElement('li');
  liEl.setAttribute(
    'class',
    'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
  );
  const aStr = `<a class="fw-bold" href="${link}" target="_blank" data-id="${id}" rel="noopener norefferer"></a>`;
  const btnStr = `<button class="btn btn-outline-primary btn-sm" type="button" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">${btnText}</button>`;
  liEl.innerHTML = `${aStr}\n${btnStr}`;

  const aEl = liEl.firstElementChild;
  aEl.textContent = title;
  const btn = liEl.lastElementChild;

  btn.addEventListener('click', () => {
    const [postUIState] = uiState.postLinks.filter(({ postId }) => postId === id);
    postUIState.read = true;
    viewModal(title, description, link);
  });

  aEl.addEventListener('click', () => {
    const [postUIState] = uiState.postLinks.filter(({ postId }) => postId === id);
    postUIState.read = true;
  });

  return liEl;
}).reverse();

export const viewFeed = (feed) => {
  const feedsCardUl = document.querySelector('.feeds .list-group')
    ?? createCard('Фиды', feedsDiv);
  const { content } = feed;
  const { title, description } = content;
  const feedLiEl = createFeedsLi(title, description);
  feedsCardUl.prepend(feedLiEl);
};

export const viewPosts = (posts, uiState, viewBtnText) => {
  const postsCardUl = document.querySelector('.posts .list-group')
    ?? createCard('Посты', postsDiv);
  const postsLiEls = createPostsLiEls(posts, uiState, viewBtnText);
  postsLiEls.forEach((el) => postsCardUl.prepend(el));
};
