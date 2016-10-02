'use strtict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('fowl:duckrouter');
const createError = require('http-errors');

const Fowl = require('../model/fowl.js');
const Duck = require('../model/duck.js');

const duckRouter = module.exports = new Router();

duckRouter.post('/api/fowl/:fowlID/duck', jsonParser, function(req, res, next) {
  debug('hit POST for api/fowl/:fowlID/duck');
  Fowl.findByIdAndAddDuck(req.params.fowlID, req.body)
  .then( duck => res.json(duck))
  .catch( err => next(createError(404, err.message)));
});

duckRouter.get('/api/duck/:id', function(req, res, next) {
  debug('hit GET for api/duck/:id');
  return Duck.findById(req.params.id)
  .then(duck => res.json(duck))
  .catch(err => next(createError(404, err.message)));
});

duckRouter.delete('/api/duck/:id', function(req, res, next) {
  debug('hit DELETE for api/duck/:id');
  Fowl.findByIdAndDeleteDuck(req.params.id)
  .then( () => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});

duckRouter.put('/api/duck/:id', jsonParser, function(req, res, next) {
  debug('hit route PUT /api/fowl/:id');
  Duck.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(duck => res.json(duck))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});
