const User = require('../models/user');
const { ERROR_CODE, NOT_FOUND, DEFAULT_ERROR } = require('../errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.send({ data: user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Введены неверные данные' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(ERROR_CODE).send({ message: 'Некорректный запрос' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => { res.send(users); })
    .catch(() => { res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' }); });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true }).orFail(new Error('NotFound'))
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Введены неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' });
    });
};

const updateAvatar = (req, res) => {
  const avatar = req.body;
  User.findByIdAndUpdate(req.user._id, avatar)
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Введены неверные данные' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' });
      }
    });
};

module.exports = {
  createUser, getUser, getUsers, updateProfile, updateAvatar
};
