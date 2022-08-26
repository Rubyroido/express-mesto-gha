const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/', cardsRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '6300d271b6cac26962d93981'
  };
  next();
});

app.listen(PORT);
