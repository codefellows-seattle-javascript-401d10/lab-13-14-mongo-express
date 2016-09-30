'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema({
  order_date: { type: Date, required: true },
  price: { type: Number, required: true },
  customerID: { type:Schema.Types.ObjectId},
});

module.exports = mongoose.model('order', orderSchema);


