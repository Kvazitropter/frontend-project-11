import { string } from 'yup';
import i18next from 'i18next';
import watcher from './watcher.js';
import resources from './locales/index.js';

const validateUrl = async (url, existingUrls) => {
  const schema = string().url('invalidUrl').required().notOneOf(existingUrls, 'repeatedUrl');
  return schema.validate(url);
};

export default () => {
  const elements = {
    rssForm: document.querySelector('.rss-form'),
    urlInput: document.querySelector('#url-input'),
    feedbackMessage: document.querySelector('.feedback'),
    submitBtn: document.querySelector('.rss-form [type="submit"]'),
  };

  const state = {
    rssForm: {
      state: 'filling',
      error: null,
    },
    posts: [],
    feeds: [],
    uiState: {
      links: new Set([]),
    },
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    const watchedState = watcher(state, elements, i18nextInstance);

    elements.rssForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elements.rssForm);
      const input = formData.get('url');
      validateUrl(input, state.uiState.links)
        .then((url) => {
          watchedState.rssForm.state = 'sending';
          // сделать запрос по ссылке и обработать
          // если успешно
          watchedState.uiState.links.add(url);
          watchedState.rssForm.state = 'idle';
          watchedState.rssForm.error = null;
        })
        .catch((err) => {
          watchedState.rssForm.state = 'invalid';
          watchedState.rssForm.error = err.message;
        });
    });
  });
};
