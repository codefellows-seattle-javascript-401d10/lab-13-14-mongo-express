'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug');
const createError = require('http-errors');

const List = require('../model/list.js');

const listRouter = module.exports = new Router();

listRouter.post('/api/list', jsonParser, function(req, res, next){
  debug('running POST route');
  req.body.timestamp = new Date();
  new List(req.body).save()
  .then(list => res.json(list))
  .catch(next);
});

listRouter.get('/api/list/:id', function(req, res, next){
  debug('running GET route');
  List.findById(req.params.id)
  .then(list => {
    res.json(list);
  })
  .catch(err => {
    next(createError(404, err.message));
  });
});


listRouter.delete('/api/list/:id', function(req, res, next){
  debug('running DELETE route');
  List.findByIdAndRemove(req.params.id)
  .then( () => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});


listRouter.put('/api/list/:id', jsonParser, function(req, res, next){
  debug('running put route');
  List.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( (list) => res.json(list))
  .catch(err => next(createError(404, err.message)));
});
