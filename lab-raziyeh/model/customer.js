'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = Schema ({
  name: { type:String, required:true },
  family: { type:String, required:true },
  email: { type:String, required: true },
  phone: { type:String, required: true },
  address: { type: String, required:true },
  city: { type: String, required: true }
});

module.exports = mongoose.model('customer', customerSchema);