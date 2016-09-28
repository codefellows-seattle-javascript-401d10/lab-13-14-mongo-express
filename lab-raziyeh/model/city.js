'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = Schema ({
  name: { type:'String', required:true },
  Type: { type:'String', required:true },
  state: { type:'String', required: true },
  city: { type:'string', required: true },
  students: { type:'Number', required:false },
  grade: { type:'string', required: false }
});

module.exports = mongoose.model('school', schoolSchema);