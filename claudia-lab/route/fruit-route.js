'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('fruit:server');
const createError = require('http-errors');

//APP MODULES
const FruitList = require('../model/fruitlist.js');

// MODULE CONSTANTS
const fruitlistRouter = module.exports = new Router();

fruitlistRouter.post('/api/fruitlist', jsonParser, function(req, res, next) {
  debug('hit route POST /api/fruitlist');
  new FruitList(req.body).save() //save before writing to database
  //.save returns a Promise.
  .then(fruitlist => res.json(fruitlist)) //returns a list to us
  .catch(next);
});

fruitlistRouter.get('/api/fruitlist/:id', function(req, res, next){
  debug('hit route GET /api/fruitlist');
  FruitList.findById(req.params.id)
  .then(fruitlist => res.json(fruitlist))
  .catch(err => next(createError(404, err.message)));
});

fruitlistRouter.put('/api/fruitlist/:id', jsonParser, function(req, res, next){
  debug('hit route UPDATE /api/fruitlist');
  FruitList.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(fruitlist => res.json(fruitlist))
  .catch(err => next(createError(404, err.message)));
});

fruitlistRouter.delete('/api/fruitlist/:id', function(req, res, next){
  debug('hit route DELETE /api/fruitlist');
  FruitList.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
