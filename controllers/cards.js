const Card = require('../models/cards');
const {
  ERROR_INCORRECT,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  MESSAGE_DEFAULT,
} = require('../validation/errorConstants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: MESSAGE_DEFAULT }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT).send({ message: 'Неправильные данные.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};

module.exports.addLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT).send({ message: 'Неправильные данные.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};

module.exports.removeLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT).send({ message: 'Неправильные данные.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};
