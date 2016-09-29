'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = Schema ({
  name: { type:String, required:true },
  Type: { type:String, required:true },
  state: { type:String, required: true },
  city: { type:String, required: true },
  students: { type: Number, required:true },
  grade: { type: String, required: true }
});

module.exports = mongoose.model('school', schoolSchema);