import onChange from 'on-change';

const handleStateChange = (value, elements) => {
  if (value === 'idle') {
    elements.rssForm.reset();
    elements.urlInput.classList.remove('is-invalid');
    elements.urlInput.focus();
    elements.feedbackMessage.classList.remove('text-danger');
    elements.feedbackMessage.classList.add('text-success');
    elements.submitBtn.removeAttribute('disabled');
  } else if (value === 'invalid') {
    elements.urlInput.classList.add('is-invalid');
    elements.feedbackMessage.classList.add('text-danger');
    elements.submitBtn.removeAttribute('disabled');
  } else if (value === 'sending') {
    elements.submitBtn.setAttribute('disabled', '');
  }
};

const handleFeedbackMessage = (value, { feedbackMessage }, i18nextInstance) => {
  if (!value) {
    feedbackMessage.replaceChildren(i18nextInstance.t('success'));
  } else {
    feedbackMessage.replaceChildren(i18nextInstance.t(`errors.${value}`));
  }
};

export default (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'rssForm.state':
      handleStateChange(value, elements);
      break;
    case 'rssForm.error':
      handleFeedbackMessage(value, elements, i18nextInstance);
      break;
    case 'uiState.links':
      break;
    default:
      throw new Error('unknown state path');
  }
});
