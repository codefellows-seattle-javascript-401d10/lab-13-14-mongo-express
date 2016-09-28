'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cat:cafeRouter');
const Cafe = require('../model/cafe');

const cafeRouter = module.exports = new Router();

cafeRouter.post('/api/cafe', jsonParser, function(req, res, next){
  debug('Hit POST route');
  req.body.timestamp = new Date();
  new Cafe(req.body).save()
  .then(cafe => res.json(cafe))
  .catch(err => next(createError(400, err.message)));
});

cafeRouter.get('/api/cafe/', function(req, res, next){
  debug('Hit GET route WITH NO ID');
  Cafe.find({})
  .then(array => res.json(array))
  .catch(err => next(createError(404, err.message)));
});

cafeRouter.get('/api/cafe/:id', function(req, res, next){
  debug('Hit GET route');
  Cafe.findById(req.params.id)
  .then(cafe => res.json(cafe))
  .catch(err => next(createError(404, err.message)));
  return;
});

cafeRouter.delete('/api/cafe/:id', function(req, res, next){
  debug('Hit DELETE route');
  Cafe.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});

cafeRouter.put('/api/cafe/:id', jsonParser, function(req, res, next) {
  debug('Hit route PUT /api/cat');
  debug('req.body', req.body);
  let newBody = req.body;
  Cafe.findByIdAndUpdate(req.params.id, newBody, {new: true})
  .then(cafe => res.json(cafe))
  .catch(err => next(createError(404, err.message)));
});


module.exports = cafeRouter;
