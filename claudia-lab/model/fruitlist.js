'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; //schemas only exist in mongoose - created here and exported to mongo?

const fruitSchema = Schema({
  name: {type: String, required: true}, //string constructor- needs to be capitalized, required:true - if name is not provided throw an error
  color: String,
});

module.exports = mongoose.model('fruit', fruitSchema); //stores all fruit schemas in the collection 'fruit'
