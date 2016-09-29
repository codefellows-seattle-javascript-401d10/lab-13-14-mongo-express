'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Park = require('../model/park.js');

const parkRouter = module.exports = new Router();
const debug = require('debug')('park:park-route');

parkRouter.post('/api/park', jsonParser, function(req, res, next){
  req.body.timestamp = new Date();
  new Park(req.body).save()
  .then(park => res.json(park))
  .catch(next);
});

parkRouter.get('/api/park/:id', function(req, res, next){
  debug('hit get route');
  Park.findById(req.params.id)
  .then(park => res.json(park))
  .catch(err => next(createError(404, err.message)));
});

parkRouter.delete('/api/park/:id', function(req, res, next){
  Park.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});

parkRouter.put('/api/park/:id', jsonParser, function(req, res, next){
  Park.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(park => res.json(park))
  .catch(err => next(createError(404, err.message)));
});
