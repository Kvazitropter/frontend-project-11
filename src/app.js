import onChange from 'on-change';
import i18next from 'i18next';
import { getData, parseData, saveData } from './handleData.js';
import isValidUrl from './isValidUrl.js';
import ru from './lng.js';
import viewData from './viewData.js';

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
    const inputValue = state.rssForm.value;
    switch (path) {
      case 'rssForm.validation':
        if (value) {
          input.classList.remove('is-invalid');
          watchedState.rssForm.state = 'getting';
        } else {
          input.classList.add('is-invalid');
          feedback.classList.replace('text-success', 'text-danger');
        }
        break;
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
            state.rssForm.posted.push(inputValue);
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
      case 'rssForm.message':
        feedback.textContent = i18nextInst.t(value);
        break;
      case 'feeds':
        viewData(applyData.args[0], state.posts);
        break;
      default:
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
            saveData(watchedState, parseData(data));
            watchedState.rssForm.state = 'proceed';
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
