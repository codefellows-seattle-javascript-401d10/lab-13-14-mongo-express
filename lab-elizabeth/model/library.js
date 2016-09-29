'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const seriesSchema = Schema({
  timestamp: {type: Date, required: true},
  authors: {type: String, required: true},
  books: {type: String, required: true},
  description: {type: String, required: true},
});

module.exports = mongoose.model('series', seriesSchema);
