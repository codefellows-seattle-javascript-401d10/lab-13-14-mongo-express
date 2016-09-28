'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = Schema({
  name: {type: String, required: true},
  about: {type: String, required: true},
  projects: {type: String, required: true},
  work: {type: String, required: true},
  timestamp: {type: Date, required: true},
});

module.exports = mongoose.model('portfolio', portfolioSchema);
