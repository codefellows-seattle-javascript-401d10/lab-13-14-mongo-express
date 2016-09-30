'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');

const Duck = require('./duck.js');

const fowlSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  ducks: [{type: Schema.Types.ObjectId, refs: 'duck'}],
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
