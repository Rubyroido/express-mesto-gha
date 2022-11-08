const mongoose = require('mongoose');

const { Schema } = mongoose;

const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (url) => { return isURL(url); },
      message: 'Некорректная ссылка'
    }
  },
  owner: {
    required: true,
    type: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  likes: {
    type: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardSchema);
