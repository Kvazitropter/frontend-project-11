import { setLocale } from 'yup';
import i18next from 'i18next';
// import _ from 'lodash';
import watcher from './view/watcher.js';
import resources from './locales/index.js';
import locale from './locales/locale.js';
import validateUrl from './handlers/validateUrl.js';
import fetchData from './handlers/fetchData.js';
import parseData from './handlers/parseData.js';
import saveData from './handlers/saveData.js';

export default () => {
  const elements = {
    rssForm: document.querySelector('.rss-form'),
    urlInput: document.querySelector('#url-input'),
    feedbackMessage: document.querySelector('.feedback'),
    submitBtn: document.querySelector('.rss-form [type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
  };

  const state = {
    rssForm: {
      state: null,
      validationState: null,
      feedback: null,
    },
    links: new Set(),
    feeds: [],
    posts: [],
    uiState: {
      viewedPostLinks: new Set(),
      modal: {
        postId: null,
      },
    },
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    const watchedState = watcher(state, elements, i18nextInstance);
    setLocale(locale);

    elements.rssForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(elements.rssForm);
      const input = formData.get('url');
      validateUrl(input, watchedState.links)
        .then((url) => {
          watchedState.rssForm.validationState = 'valid';
          watchedState.rssForm.state = 'getting';
          fetchData(url)
            .then((data) => {
              try {
                saveData(watchedState, parseData(data));
                watchedState.links.add(url);
                watchedState.rssForm.state = 'idle';
                watchedState.rssForm.feedback = 'success';
              } catch (error) {
                console.error(error);
                watchedState.rssForm.state = 'invalid';
                watchedState.rssForm.feedback = 'noRss';
              }
            })
            .catch(() => {
              watchedState.rssForm.feedback = 'network';
            });
        })
        .catch((err) => {
          console.error(err);
          watchedState.rssForm.validationState = 'invalid';
          watchedState.rssForm.feedback = err.message;
        });
    });
  });
};
