'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const uuid = require('node-uuid');

const School = require('../model/school.js');

const schoolRouter = module.exports = new Router();
const debug = require('debug')('school:route');

schoolRouter.post('/api/school', jsonParser, function(req, res, next){
  debug('api/school POST request');
  req.body.id = uuid.v1();
  new School(req.body).save()
  .then(school => res.json(school))
  .catch(next);
});

schoolRouter.get('/api/list/:id', function(req, res, next){
  School.findById(req.params.id)
  .then(school => res.json(school))
  .catch(next);
});