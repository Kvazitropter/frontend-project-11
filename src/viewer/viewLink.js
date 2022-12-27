import _ from 'lodash';

export default (pathToPostUiState, state) => {
  const arrPath = [...pathToPostUiState.split('.'), 'postId'];
  const id = _.get(state, arrPath);
  const link = document.querySelector(`[data-id="${id}"]`);
  link.classList.replace('fw-bold', 'fw-normal');
  link.classList.add('link-secondary');
};
