'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('store:route');
const createError = require('http-errors');

const Store = require('../model/store.js');

const storeRouter = module.exports = new Router();

storeRouter.get('/api/store/:id', function(req, res, next){
  debug('storeRouter GET');
  Store.findById(req.params.id)
  .populate('items')
  .then( store => res.json(store))
  .catch(err => next(createError(404, err.message)));
});

storeRouter.post('/api/store', jsonParser, function(req, res, next){
  debug('storeRouter POST');
  req.body.timestamp = new Date();
  new Store(req.body).save()
  .then( store => res.json(store))
  .catch(next);
});

storeRouter.put('/api/store/:id', jsonParser, function(req, res, next){
  debug('storeRouter PUT');
  Store.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( store => res.json(store))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

storeRouter.delete('/api/store/:id', function(req, res, next){
  debug('storeRouter DELETE');
  Store.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
