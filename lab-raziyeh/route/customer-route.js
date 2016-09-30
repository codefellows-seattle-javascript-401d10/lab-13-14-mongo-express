'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Customer = require('../model/customer.js');
const pageMiddleware = require('../lib/page-middleware.js');

const customerRouter = module.exports = new Router();
const debug = require('debug')('customer:route');

customerRouter.get('/api/customer/:id', function(req, res, next){
  debug('api/customer GET request');
  Customer.findById(req.params.id)
  .then(customer => res.json(customer))
  .catch(err => next(createError(404, err.message)));
});


customerRouter.get('/api/customer', pageMiddleware, function(req, res, next){
  let offset = req.query.offset;
  let pageSize = req.query.pagesize;
  let page =  req.query.page;
  
  let skip = offset + pageSize * page ;
  Customer.find().skip(skip).limit(pageSize)
  .then( lists => res.json(lists))
  .catch(next);
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
