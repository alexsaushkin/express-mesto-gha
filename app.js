const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const process = require('process');
const {
  ERROR_DEFAULT,
  MESSAGE_DEFAULT,
} = require('./utils/constants');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const {
  validateLogin,
  validateCreate,
} = require('./validation/userValidators');
const { PORT, DB_CONNECT = 'mongodb://127.0.0.1:27017/mestodb' } = require('./config');

const app = express();

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

mongoose.connect(DB_CONNECT, {
  useNewUrlParser: true,
});

app.use(express.json());

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreate, createUser);

app.use(auth);

app.use('/cards', cards);
app.use('/users', users);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT, message = MESSAGE_DEFAULT } = err;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
