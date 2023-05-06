const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const {
  ERROR_NOT_FOUND,
} = require('./validation/errorConstants');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { PORT, DB_CONNECT = 'mongodb://127.0.0.1:27017/mestodb' } = require('./config');

const app = express();

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

mongoose.connect(DB_CONNECT, {
  useNewUrlParser: true,
});

app.use(express.json());

// миддлвэр, добавляющий пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

app.use('/cards', cards);
app.use('/users', users);
app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND)
    .send({ message: 'Страница не найдена.' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
