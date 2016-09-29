'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Customer = require('../model/customer.js');

const customerRouter = module.exports = new Router();
const debug = require('debug')('customer:route');

customerRouter.get('/api/customer/:id', function(req, res, next){
  debug('api/customer GET request');
  Customer.findById(req.params.id)
  .then(customer => res.json(customer))
  .catch(err => next(createError(404, err.message)));
});

customerRouter.get('/api/customer/', function(req, res, next){
  debug('api/customer GET request without id');
  Customer.find()
  .then(customer => res.json(customer))
  .catch(err => next(createError(404, err.message)));
});

customerRouter.post('/api/customer', jsonParser, function(req, res, next){
  debug('api/customer POST request');
  new Customer(req.body).save()
  .then(customer => res.json(customer))
  .catch(next);
});

customerRouter.put('/api/customer/:id', jsonParser, function(req, res, next){
  debug('api/customer PUT request');
  Customer.findByIdAndUpdate(req.params.id,req.body, {new: true})
  .then(customer => res.json(customer))
  .catch(err => {
    if(err.name === 'ValidarionError') return next(err);
    next(createError(404, err.message));
  });
});


customerRouter.delete('/api/customer/:id', function(req, res, next){
  debug('api/customer DELETE request');
  Customer.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
