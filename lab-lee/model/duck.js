'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const duckSchema = Schema({
  name: {type: String, required: true},
  color: {type: String, required: true},
  feathers: {type: String, required: true},
  fowlID: {type: Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('duck', duckSchema);
