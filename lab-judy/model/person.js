'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = Schema({
  lastName: {type: String, required: true},
  location: {type: String, required: true},
  listID: {type: Schema.Types.ObjectId, required: true}
});
module.exports = mongoose.model('person', personSchema);
