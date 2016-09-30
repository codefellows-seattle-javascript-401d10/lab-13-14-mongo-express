'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Customer = require('../model/customer.js');
const Order = require('../model/order.js');

const debug = require('debug')('order:route');
const orderRouter = module.exports = new Router();

orderRouter.get('/api/order/:id', function(req, res, next) {
  debug('/api/order GET request');
  Order.findById(req.params.id)
  .then(order => res.json(order))
  .catch(err => next(createError(404, err.message)));
});

orderRouter.post('/api/customer/:customerID/order', jsonParser, function(req, res, next){
  debug('POST api/customer/:customerID/order ');
  Customer.findByIdAndAddOrder(req.params.customerID, req.body)
  .then( order => res.json(order))
  .catch(next);
});

orderRouter.delete('/api/order/:id', function(req, res, next) {
  debug('/api/order DELETE request');
  Order.findById(req.params.id)
  .then( () => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
