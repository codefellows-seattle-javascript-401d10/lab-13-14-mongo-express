'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser');
const createError = require('http-errors');
const debug = require('debug')('series:series-router');

const Series = require('../model/series');
const pageMiddleware = require('../lib/page-middleware');

const seriesRouter = module.exports = new Router();

seriesRouter.delete('api/series/:id', function(req, res, next){
  debug('delete');
  return Series.findByIdandRemove(req.params.id)
  .then(() => res.sendStatus(204).send())
  .catch(err => next(createError(404, err.message)));
});

seriesRouter.get('api/series/:id', function(req, res, next){
  debug('get by id');
  return Series.findById(req.params.id)
  .populate('books')
  .then(series => res.json(series))
  .catch(err => next(createError(404, err.message)));
});

seriesRouter.get('api/series', pageMiddleware, function(req, res, next){
  debug('get all');
  let offset = req.query.offset;
  let pageSize = req.query.pagesize;
  let page = req.query.page;

  let skip = offset + pageSize * page;
  Series.fine().skip(skip).limit(pageSize)
  .then(series => res.json(series))
  .catch(next);
});

seriesRouter.post('api/series/', jsonParser, function(req, res, next){
  debug('post');
  req.body.timestamp = new Date();
  new Series(req.body).save()
  .then(series => res.json(series))
  .catch(next);
});

seriesRouter.put('api/series/:id', jsonParser, function(req, res, next){
  debug('seriesRouter.put');
  return Series.findByIdandUpdate(req.params.id, req.body, {new: true})
  .then(series => res.json(series))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});
