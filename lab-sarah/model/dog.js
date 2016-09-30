'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dogSchema = Schema({
  //no two dogs can have same name, add property of unique: true to line below
  name: {type: String, required: true},
  color: {type: String, required: true},
  //tells mongoose that this park type is going to be have a mongo id with every
  parkID: {type: Schema.Types.ObjectId, required: true},
});

//export the dogSchema and call it 'dog'
module.exports = mongoose.model('dog', dogSchema);
