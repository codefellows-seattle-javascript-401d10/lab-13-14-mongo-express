'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const City = require('../model/city.js');
const debug = require('debug')('city:city-route');
const createError = require('http-errors');
const cityRouter = module.exports = new Router();
const pageMiddleware = require('../lib/page-middleware.js');

cityRouter.post('/api/city', jsonParser, function(req, res, next){
  debug('running POST route');
  req.body.timestamp = new Date();
  City(req.body).save()
  .then(city => res.json(city))
  .catch(next);
});

cityRouter.delete('/api/city/:id', function(req, res, next){
  debug('running DELETE route');
  City.findById(req.params.id).remove()
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});

cityRouter.get('/api/city/', pageMiddleware, function(req, res, next){
  debug('running empty get route');
  let offset = parseInt(req.query.offset);
  let pagesize = parseInt(req.query.pagesize);
  let page = parseInt(req.query.page);
  // This is NOT WORKING PROPERLY... Skipping too much on default;
  let skip = (offset) + pagesize * (page - 1);
  City.find().skip(skip).limit(pagesize)
  .populate('hospitals')
  .then(city => res.json(city))
  .catch(err => next(createError(404, err.message)));
});

cityRouter.get('/api/city/:id', function(req, res, next){
  debug('running GET route');
  City.findById(req.params.id)
  .populate('hospitals')
  .then(city => res.json(city))
  .catch(err => next(createError(404, err.message)));
});

cityRouter.put('/api/city/:id', jsonParser, function(req, res, next){
  debug('running PUT route');
  City.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .populate('hospitals')
  .then(city => res.json(city))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});
