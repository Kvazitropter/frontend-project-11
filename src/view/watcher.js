import onChange from 'on-change';
import _ from 'lodash';

const createCard = (name, container) => {
  const card = document.createElement('div');
  card.setAttribute('class', 'card border-0');
  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.setAttribute('class', 'card-title h4');
  cardTitle.textContent = name;
  cardBody.append(cardTitle);
  card.append(cardBody);
  const listGroup = document.createElement('ul');
  listGroup.setAttribute('class', 'list-group border-0 rounded-0');
  card.append(listGroup);
  container.append(card);
};

const handleStateChange = (state, {
  rssForm, urlInput, feedbackMessage, submitBtn,
}) => {
  if (state === 'idle') {
    rssForm.reset();
    urlInput.focus();
    submitBtn.removeAttribute('disabled');
  } else if (state === 'failed') {
    feedbackMessage.classList.replace('text-success', 'text-danger');
    submitBtn.removeAttribute('disabled');
  } else if (state === 'getting') {
    submitBtn.setAttribute('disabled', '');
  }
};

const handleValidation = (validationState, { urlInput, feedbackMessage }) => {
  if (validationState === 'valid') {
    urlInput.classList.remove('is-invalid');
    feedbackMessage.classList.replace('text-danger', 'text-success');
  } else {
    urlInput.classList.add('is-invalid');
    feedbackMessage.classList.replace('text-success', 'text-danger');
  }
};

const addFeed = ({ args: [feed] }, { feedsContainer }, i18nextInstance, prevFeeds) => {
  if (_.isEmpty(prevFeeds)) {
    createCard(i18nextInstance.t('feeds'), feedsContainer);
  }

  const { title, description } = feed;
  const feedsUl = feedsContainer.querySelector('.list-group');
  const feedLi = document.createElement('li');
  feedLi.setAttribute('class', 'list-group-item border-0 border-end-0');
  const header = document.createElement('h3');
  header.setAttribute('class', 'h6 m-0');
  header.textContent = title;
  feedLi.append(header);
  const descriptionEl = document.createElement('p');
  descriptionEl.setAttribute('class', 'm-0 small text-black-50');
  descriptionEl.textContent = description;
  feedLi.append(descriptionEl);
  feedsUl.prepend(feedLi);
};

const addPost = ({ args: [post] }, { postsContainer }, i18nextInstance, prevPosts) => {
  if (_.isEmpty(prevPosts)) {
    createCard(i18nextInstance.t('posts'), postsContainer);
  }

  const { id, title, link } = post;
  const postsUl = postsContainer.querySelector('.list-group');
  const postLi = document.createElement('li');
  postLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  const linkEl = document.createElement('a');
  linkEl.setAttribute('class', 'fw-bold');
  linkEl.setAttribute('target', '_blank');
  linkEl.setAttribute('rel', 'noopener norefferrer');
  linkEl.setAttribute('href', link);
  linkEl.setAttribute('data-id', id);
  linkEl.textContent = title;
  postLi.append(linkEl);
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('class', 'btn btn-outline-primary btn-sm');
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  btn.setAttribute('data-id', id);
  btn.textContent = i18nextInstance.t('viewBtn');
  postLi.append(btn);
  postsUl.prepend(postLi);
};

export default (state, elements, i18nextInstance) => onChange(
  state,
  (path, value, prevValue, applyData) => {
    switch (path) {
      case 'rssForm.state':
        handleStateChange(value, elements);
        break;
      case 'rssForm.validationState':
        handleValidation(value, elements);
        break;
      case 'rssForm.feedback':
        elements.feedbackMessage.replaceChildren(i18nextInstance.t(`feedback.${value}`));
        break;
      case 'links':
        break;
      case 'feeds':
        addFeed(applyData, elements, i18nextInstance, prevValue);
        break;
      case 'posts':
        addPost(applyData, elements, i18nextInstance, prevValue);
        break;
      default:
        throw new Error('unknown state path');
    }
  },
);
