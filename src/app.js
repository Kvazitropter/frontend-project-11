import onChange from 'on-change';
import i18next from 'i18next';
import getData from './handlers/getData';
import parseData from './handlers/parseData';
import saveData from './handlers/saveData';
import updatePosts from './handlers/updatePosts';
import isValidUrl from './validator/isValidUrl.js';
import ru from '../locales/lng.js';
import { viewFeed, viewPosts } from './viewer/viewData.js';
import viewLink from './viewer/viewLink';

const rssForm = document.querySelector('.rss-form');
const input = rssForm.querySelector('#url-input');
const submitBtn = rssForm.querySelector('.btn');
const feedback = document.querySelector('.feedback');

export default () => {
  const state = {
    rssForm: {
      value: '',
      posted: [],
      state: 'filling',
      validation: null,
      message: '',
    },
    feeds: [],
    posts: [],
    uiState: {
      postLinks: [],
    },
  };

  const i18nextInst = i18next.createInstance();
  i18nextInst.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = onChange(state, (path, value, _previousValue, applyData) => {
    switch (path) {
      case 'rssForm.state':
        switch (value) {
          case 'filling':
            submitBtn.disabled = false;
            state.rssForm.validation = null;
            rssForm.reset();
            break;
          case 'getting':
            submitBtn.disabled = true;
            break;
          case 'proceed':
            feedback.classList.replace('text-danger', 'text-success');
            watchedState.rssForm.message = 'feedb_success';
            watchedState.rssForm.state = 'filling';
            break;
          case 'failed':
            submitBtn.disabled = false;
            feedback.classList.replace('text-success', 'text-danger');
            watchedState.rssForm.message = 'feedb_fail';
            break;
          default:
            break;
        }
        break;
      case 'rssForm.validation':
        if (value) {
          input.classList.remove('is-invalid');
          watchedState.rssForm.state = 'getting';
        } else {
          input.classList.add('is-invalid');
          feedback.classList.replace('text-success', 'text-danger');
        }
        break;
      case 'rssForm.message':
        feedback.textContent = i18nextInst.t(value);
        break;
      case 'rssForm.posted':
        setTimeout(
          updatePosts,
          5000,
          watchedState,
          state.posts,
          applyData.args[0],
        );
        break;
      case 'feeds':
        viewFeed(applyData.args[0]);
        break;
      case 'posts':
        viewPosts(applyData.args, watchedState.uiState);
        break;
      default:
        viewLink(path.slice(0, -5), state);
        break;
    }
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value, posted } = state.rssForm;
    isValidUrl(value, posted)
      .then(() => {
        watchedState.rssForm.validation = true;
        getData(value)
          .then((data) => {
            saveData(watchedState, state, parseData(data));
            watchedState.rssForm.state = 'proceed';
            watchedState.rssForm.posted.push(value);
          })
          .catch(() => {
            watchedState.rssForm.state = 'failed';
          });
      })
      .catch((er) => {
        watchedState.rssForm.validation = false;
        watchedState.rssForm.message = er.message;
      });
  });

  input.addEventListener('input', (e) => {
    state.rssForm.value = e.target.value;
  });
};
