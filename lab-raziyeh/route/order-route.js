'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser');
const createError = require('http-errors');

//const Customer = require('../model/customer.js');
const Order = require('../model/order.js');

const debug = require('debug')('order:route');
const orderRouter = module.exports = new Router();

orderRouter.get('/api/order/:id', function(req, res, next) {
  debug('/api/order GET request');
  Order.findById(req.params.id)
  .then(order => res.json(order))
  .catch(err => next(createError(404, err.message)));
});

