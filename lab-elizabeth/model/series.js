'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const librarySchema = Schema({
  timestamp: {type: Date, required: true},
  branch: {type: String, required: true},
  address: {type: String, required: false},
  hours: {type: String, required: false},
});

module.exports = mongoose.model('library', librarySchema);
