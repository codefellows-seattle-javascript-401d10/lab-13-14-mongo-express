'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = Schema({
  name: {type: String, required: true},
  breed: {type: String, required: true},
  cafeId: {type: Schema.Types.ObjectId, required: true},
  timestamp: {type: Date, required: true},
});

module.exports = mongoose.model('cat', catSchema); //export as Cat?
