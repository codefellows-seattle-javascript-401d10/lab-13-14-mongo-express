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

Store.findByIdAndGetItem = function(storeID, itemID){
  return Store.findById(storeID)
  .then(store => {
    if(store.items.indexOf(itemID) === -1){
      Promise.reject();
    }
    return Item.findById(itemID);
  });
};

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

Store.findByIdAndUpdateItem = function(storeID, itemID, item){
  debug('findByIdAndUpdateItem');
  return Store.findById(storeID)
  .then(store => {
    if(store.items.indexOf(itemID) === -1){
      Promise.reject();
    }
  })
  .then( () => {
    return Item.findByIdAndUpdate(itemID, item, {new: true});
  });
};

Store.findByIdAndDeleteItem = function(storeID, itemID){
  debug('findByIdAndDeleteItem');
  return Store.findById(storeID)
  .then(store => {
    if(store.items.indexOf(itemID) === -1){
      Promise.reject();
    }
    debug('found store id');
    for(var i=0;i<store.items.length;i++){
      debug(store.items[i], 'value in store array');
      if(store.items[i].toString() === itemID){
        debug('conditional getting hit');
        store.items.splice(i, 1);
      }
    }
    return store.save();
  })
  .then(() => {
    return Item.findByIdAndRemove(itemID);
  });
};
