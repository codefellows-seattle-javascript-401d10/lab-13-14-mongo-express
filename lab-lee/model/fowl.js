'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const debug = require('debug')('fowl:fowl');

const Duck = require('./duck.js');

const fowlSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  ducks: [{type: Schema.Types.ObjectId, ref: 'duck'}],
});

const Fowl = module.exports = mongoose.model('fowl', fowlSchema);

Fowl.findByIdAndAddDuck = function(id, duck) {
  return Fowl.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(fowl => {
    duck.fowlID = fowl._id;
    this.tempFowl = fowl;
    return new Duck(duck).save();
  })
  .then( duck => {
    this.tempFowl.ducks.push(duck._id);
    this.tempDuck = duck;
    return this.tempFowl.save();
  })
  .then( () =>{
    return this.tempDuck;
  });
};

Fowl.findByIdAndDeleteDuck = function(id) {
  return Duck.findById(id)
  .then(duck => {
    this.tempDuck = duck;
    return Duck.remove(this.tempDuck);
  })
  .then(() => {
    return Fowl.findById(this.tempDuck.fowlID);
  })
  .catch(err => Promise.reject(err))
  .then(fowl => {
    for (var i = 0; i < fowl.ducks.length; i++) {
      if (fowl.ducks[i].toString() === id.toString() ) {
        return fowl.ducks.splice(i, 1);
      }
    }
    return Fowl.findByIdAndUpdate(this.tempDuck.fowlID, fowl);
  });
};
