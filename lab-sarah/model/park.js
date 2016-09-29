'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
});

module.exports = mongoose.model('park', parkSchema);
