'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = Schema({
  name: {type: String, required: true},
  itemType: {type: String, required: true},
  price: {type: Number, required: true},
  storeID: {type: Schema.Types.ObjectId, required:true},
});

module.exports = mongoose.model('item', itemSchema);
