import { setLocale } from 'yup';
import i18next from 'i18next';
import watcher from './view/watcher.js';
import resources from './locales/index.js';
import locale from './locales/locale.js';
import validateUrl from './handlers/validateUrl.js';
import fetchData from './handlers/fetchData.js';
import parseData from './handlers/parseData.js';
import saveData from './handlers/saveData.js';
import updatePosts from './handlers/updatePosts.js';

const getErrorMessage = (e) => {
  if (e.isAxiosError) {
    return 'error.network';
  } if (e.isParsingError) {
    return 'error.noRss';
  }
  return 'error.unknown';
};

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

  const timeout = 5000;

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
      const inputUrl = formData.get('url');
      validateUrl(inputUrl, watchedState.links)
        .then((url) => {
          watchedState.rssForm.validationState = 'valid';
          watchedState.rssForm.state = 'getting';
          return fetchData(url)
            .then((data) => {
              saveData(watchedState, parseData(data));
              watchedState.links.add(inputUrl);
              watchedState.rssForm.state = 'idle';
              watchedState.rssForm.feedback = 'loading.success';
            })
            .then(() => {
              updatePosts(inputUrl, watchedState, timeout);
            })
            .catch((err) => {
              watchedState.rssForm.state = 'failed';
              watchedState.rssForm.feedback = getErrorMessage(err);
            });
        })
        .catch((error) => {
          watchedState.rssForm.validationState = 'invalid';
          watchedState.rssForm.feedback = error.message;
        });
    });
  });
};
