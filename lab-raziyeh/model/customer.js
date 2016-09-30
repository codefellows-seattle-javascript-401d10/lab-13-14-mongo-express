'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const Order = require('./order.js');

const customerSchema = Schema ({
  name: { type:String, required:true },
  family: { type:String, required:true },
  email: { type:String, required: true },
  phone: { type:String, required: true },
  address: { type: String, required:true },
  city: { type: String, required: true },
  orders:[{ type: Schema.Types.ObjectId, ref: 'order'}],
});

const Customer = module.exports = mongoose.model('customer', customerSchema);


Customer.findByIdAndAddOrder = function(id, order){
  return Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    order.CutomerID = customer._id;
    this.tempCustomer = customer;
    return new Order(order).save();
  })
  .then( order => {
    this.tempCustomer.orders.push(order._id);
    this.tempOrder = order;
    return this.tempCustomer.save();
  })
  .then( () => {
    return this.tempOrder;
  });
};