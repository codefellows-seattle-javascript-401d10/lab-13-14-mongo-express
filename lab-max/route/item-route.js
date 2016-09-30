'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('store:item-route');
const createError = require('http-errors');

const Store = require('../model/store.js');
const Item = require('../model/item.js');

const itemRouter = module.exports = new Router();

itemRouter.post('/api/store/:storeID/item', jsonParser, function(req, res, next){
  debug('itemRouter POST');
  Store.findByIdAndAddItem(req.params.storeID, req.body)
  .then( item => res.json(item))
  .catch(next);
});

itemRouter.get('/api/store/:storeID/item/:id', function(req, res, next){
  debug('itemRouter GET');
  Store.findByIdAndGetItem(req.params.storeID, req.params.id)
  .then(item => res.json(item))
  .catch(err => next(createError(404, err.message)));
});

itemRouter.put('/api/store/:storeID/item/:id', jsonParser, function(req, res, next){
  debug('itemRouter PUT');
  Store.findByIdAndUpdateItem(req.params.storeID, req.params.id, req.body)
  .then(item => res.json(item))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

itemRouter.delete('/api/store/:storeID/item/:id', function(req, res, next){
  debug('itemRouter DELETE');
  Store.findByIdAndDeleteItem(req.params.storeID, req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
