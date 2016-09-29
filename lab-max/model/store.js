'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const debug = require('debug')('store:store');

const Item = require('./item.js');

const storeSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  year: {type: Number, required: true},
  storeType: {type: String, required: true},
  items: [{type: Schema.Types.ObjectId, ref: 'item'}],
});

const Store = module.exports = mongoose.model('store', storeSchema);

Store.findByIdAndAddItem = function(id, item){
  debug('findByIdAndAddItem');
  return Store.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(store => {
    item.storeID = store._id;
    this.tempStore = store;
    return new Item(item).save();
  })
  .then( item => {
    this.tempStore.items.push(item._id);
    this.tempItem = item;
    return this.tempStore.save();
  })
  .then( () => {
    return this.tempItem;
  });
};
