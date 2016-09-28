'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fowlSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
});

module.exports = mongoose.model('fowl', fowlSchema);
