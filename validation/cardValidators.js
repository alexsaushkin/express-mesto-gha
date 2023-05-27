const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP } = require('./constants');

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_REGEXP),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().required(),
  }),
});

module.exports = { validateCard, validateCardId };
