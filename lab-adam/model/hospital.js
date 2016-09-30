'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = Schema({
  name: {type: String, required: true},
  specialties: {type: String, required: true},
  programRank: {type: Number, required: true},
  cityID: {type: Schema.Types.ObjectId, required: true},
});

const Hospital = module.exports = mongoose.model('hospital', hospitalSchema);
