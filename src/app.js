import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import isValidUrl from './validate';
import ru from './lng.js';

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
      error: '',
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

  const watchedState = onChange(state, (path, value) => {
    const inputValue = state.rssForm.value;
    if (path === 'rssForm.validation') {
      if (value) {
        if (input.classList.contains('is-invalid')) {
          input.classList.remove('is-invalid');
        }
        watchedState.rssForm.state = 'posting';
      } else {
        input.classList.add('is-invalid');
      }
    } else if (path === 'rssForm.state') {
      if (value === 'posting') {
        submitBtn.disabled = true;
        const url = new URL(inputValue);
        console.log(url);
        axios
          .get(url)
          .then((response) => {
            console.log(response);
          })
          .catch(() => {
            watchedState.rssForm.error = i18nextInst.t('feedb_fail');
          });
        feedback.textContent = i18nextInst.t('feedb_success');
        state.rssForm.posted.push(inputValue);
        watchedState.rssForm.state = 'filling';
      } else {
        rssForm.reset();
        submitBtn.disabled = false;
        state.rssForm.validation = null;
      }
    } else if (path === 'rssForm.error') {
      feedback.textContent = value;
    }
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value, posted } = state.rssForm;
    isValidUrl(value, posted)
      .then(() => {
        watchedState.rssForm.validation = true;
      })
      .catch((er) => {
        watchedState.rssForm.validation = false;
        watchedState.rssForm.error = i18nextInst.t(er.message);
      });
  });

  input.addEventListener('input', (e) => {
    state.rssForm.value = e.target.value;
  });
};
