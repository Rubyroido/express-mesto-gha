const Card = require('../models/card');
const { ERROR_CODE, NOT_FOUND, DEFAULT_ERROR } = require('../errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => { res.send(cards); })
    .catch(() => { res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' }); });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => { res.send(card); })
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

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        card.remove();
        res.status(200).send({ message: 'карточка успешно удалена' });
      } else {
        res.status(NOT_FOUND).send({ message: 'Неверный id карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Введены неверные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND).send({ message: 'Неверный id карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Введены неверные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND).send({ message: 'Неверный id карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Введены неверные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Нет ответа от сервера' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard
};
