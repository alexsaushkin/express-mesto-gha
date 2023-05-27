const ERROR_INCORRECT = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const MESSAGE_DEFAULT = 'На сервере произошла ошибка';

const URL_REGEXP = /^(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/im;

module.exports = {
  ERROR_INCORRECT,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  MESSAGE_DEFAULT,
  URL_REGEXP,
};
