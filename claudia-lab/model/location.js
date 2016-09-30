'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = Schema({
  name: {type: String, required: true},
  content:{type: String, required: true},
  fruitID: {type: Schema.Types.ObjectId, required: true}, //type is a mongo id
});
// name and content are required
// each location contains an ID to reference the list (fruit)

module.exports = mongoose.model('location', locationSchema);
