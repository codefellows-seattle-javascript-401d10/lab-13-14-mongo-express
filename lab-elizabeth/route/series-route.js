'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser');
const createError = require('http-errors');
const debug = require('debug')('series:series-router');

const Series = require('../model/series');

const seriesRouter = module.exports = new Router();

seriesRouter.delete('api/series/:id', function(req, res, next){
  debug('running route DELETE api/series/:id');
  Series.findByIdandRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});

seriesRouter.get('api/series/:id', function(req, res, next){
  debug('running route GET api/series/:id');
  Series.findById(req.params.id)
  .then(series => res.json(series))
  .catch(err => next(createError(404, err.message)));
});

seriesRouter.post('api/series/', jsonParser, function(req, res, next){
  debug('running route POST api/series/');
  req.body.timestamp = new Date();
  new Series(req.body).save()
  .then(series => res.json(series))
  .catch(next);
});

seriesRouter.put('api/series/:id', jsonParser, function(req, res, next){
  debug('running route PUT api/series/:id');
  Series.findByIdandUpdate(req.params.id, req.body)
  .then(series => res.json(series))
  .catch(err => next(createError(404, err.message)));
});
