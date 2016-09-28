'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  year: {type: Number, required: true},
  storeType: {type: String, required: true},
});

module.exports = mongoose.model('store', storeSchema);
