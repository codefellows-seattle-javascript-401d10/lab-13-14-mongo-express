'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('series:book');

const Schema = mongoose.Schema;

const bookSchema = Schema({
  published: {type: String, required: false},
  author: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  seriesID: {type: Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('book', bookSchema);
