'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const School = require('../model/school.js');

const schoolRouter = module.exports = new Router();
const debug = require('debug')('school:route');

schoolRouter.get('/api/school/:id', function(req, res, next){
  debug('api/school GET request');
  School.findById(req.params.id)
  .then(school => res.json(school))
  .catch(err => next(createError(404, err.message)));
});

schoolRouter.get('/api/school/', function(req, res, next){
  debug('api/school GET request without id');
  School.find()
  .then(school => res.json(school))
  .catch(err => next(createError(404, err.message)));
});

schoolRouter.post('/api/school', jsonParser, function(req, res, next){
  debug('api/school POST request');
  new School(req.body).save()
  .then(school => res.json(school))
  .catch(next);
});

schoolRouter.put('/api/school/:id', jsonParser, function(req, res, next){
  debug('api/school PUT request');
  School.findByIdAndUpdate(req.params.id,req.body, {new: true})
  .then(school => res.json(school))
  .catch(err => {
    if(err.name === 'ValidarionError') return next(err);
    next(createError(404, err.message));
  });
});


schoolRouter.delete('/api/school/:id', function(req, res, next){
  debug('api/school DELETE request');
  School.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
