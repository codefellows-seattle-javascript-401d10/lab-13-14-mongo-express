'use strict';

const createError = require('http-errors');
const debug = require('debug')('cat:cafe');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cat = require('./cat');

const cafeSchema = Schema({
  name: {type: String, required: true},
  address: {type: String, require: true},
  cats: [{type: Schema.Types.ObjectId, ref: 'cat'}],
  timestamp: {type: Date, require: true},
});

const Cafe = module.exports = mongoose.model('cafe', cafeSchema);

Cafe.findByIdAndAddCat = function(id, cat) {
  debug('Hit Cafe.findByIdAndAddNote');
  return Cafe.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(cafe => {
    cat.cafeId = cafe._id;
    this.tempCafe = cafe;
    return new Cat(cat).save();
  })
  .then(cat => {
    this.tempCafe.cats.push(cat._id);
    this.tempCat = cat;
    return this.tempCafe.save();
  })
  .then(() => {
    return this.tempCat;
  });
};

Cafe.findByIdAndRemoveCat = function(cafeId, catId) {
  debug('Hit Cafe.findByIdAndRemoveCat');
  return Cafe.findById(cafeId)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(cafe => {
    console.log('cafe before', cafe);
    console.log('cafe.cats before ', cafe.cats);
    let arrayIndex = cafe.cats.indexOf(catId);
    cafe.cats.splice(arrayIndex, 1);
    console.log('cafe.cats after', cafe.cats);
    console.log('cafe after', cafe);
    return Cat.findByIdAndRemove(catId);
  });
};
