'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cafeSchema = Schema({
  name: {type: String, required: true},
  address: {type: String, require: true},
  timestamp: {type: Date, require: true},
});

module.exports = mongoose.model('cafe', cafeSchema);
