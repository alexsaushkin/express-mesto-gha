const User = require('../models/users');
const {
  ERROR_INCORRECT,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  MESSAGE_DEFAULT,
} = require('../validation/errorConstants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT).send({ message: 'Неправильные данные.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT).send({ message: 'Неправильные данные.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден.' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT).send({ message: 'Неправильные данные.' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: MESSAGE_DEFAULT });
    });
};
