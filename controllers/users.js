const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const findUser = (req, res, userId, next) => {
  User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) {
        next(new NotFoundError({ message: 'Пользователь не найден' }));
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const id = req.params.userId;
  findUser(req, res, id, next);
};

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;
  findUser(req, res, id, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправильные данные.'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Данный email уже зарегистрирован.'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
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
        next(new NotFoundError('Пользователь не найден.'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправильные данные.'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
        next(new NotFoundError('Пользователь не найден.'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неправильные данные.'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          'super-strong-secret',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch(next);
};
