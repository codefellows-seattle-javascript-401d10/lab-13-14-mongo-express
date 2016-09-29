'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('fowl:router');
const createError = require('http-errors');

const Fowl = require('../model/fowl.js');

const fowlRouter = module.exports = new Router();


fowlRouter.post('/api/fowl', jsonParser, function(req, res, next) {
  debug('hit route GET');
  req.body.timestamp = new Date();
  new Fowl(req.body).save()
  .then(fowl => res.json(fowl))
  .catch(next);
});

fowlRouter.get('/api/fowl/:id', function(req, res, next) {
  debug('hit route GET');
  Fowl.findById(req.params.id)
  .then(fowl => res.json(fowl))
  .catch(err => next(createError(404, err.message)));
});

fowlRouter.get('/api/fowl', function(req, res, next) {
  debug('hit route GETall');
  Fowl.find()
  .then(fowl => res.json(fowl))
  .catch(err => next(createError(404, err.message)));
});

fowlRouter.delete('/api/fowl/:id', function(req, res, next) {
  debug('hit route DELETE /api/fowl');
  Fowl.findByIdAndRemove(req.params.id)
  .then( () => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});

fowlRouter.put('/api/fowl/:id', jsonParser, function(req, res, next) {
  debug('hit route PUT /api/fowl/:id');
  Fowl.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(fowl => res.json(fowl))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});
