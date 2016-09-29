'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('item:route');
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
  Store.findById(req.params.storeID)
  .then(store => {
    if(store.items.indexOf(req.params.id) === -1){
      Promise.reject();
    }
    return Item.findById(req.params.id);
  })
  .then(item => res.json(item))
  .catch(err => next(createError(404, err.message)));
});

itemRouter.put('/api/store/:storeID/item/:id', jsonParser, function(req, res, next){
  debug('itemRouter PUT');
  Store.findById(req.params.storeID)
  .then(store => {
    if(store.items.indexOf(req.params.id) === -1){
      Promise.reject();
    }
  })
  .then( () => {
    return Item.findByIdAndUpdate(req.params.id, req.body, {new: true});
  })
  .then(item => res.json(item))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

itemRouter.delete('/api/store/:storeID/item/:id', function(req, res, next){
  debug('itemRouter DELETE');
  Store.findById(req.params.storeID)
  .then(store => {
    if(store.items.indexOf(req.params.id) === -1){
      Promise.reject();
    }
    store.items.forEach(function(item){
      if(req.params.id === item){
        store.items.splice(item, 1);
      }
    });
  })
  .then(() => {
    Item.findByIdAndRemove(req.params.id);
  })
  .then(() => res.status(204).send())
  .catch(next);
});
