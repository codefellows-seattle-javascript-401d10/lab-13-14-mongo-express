'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = Schema({
  name: {type: String, required: true},
  color: {type: String, required: true},
  feathers: {type: String, required: true},
  listID: {type: Schema.Types.ObjectId, required: true},
});

mongoose.exports = mongoose.model('note', noteSchema);
