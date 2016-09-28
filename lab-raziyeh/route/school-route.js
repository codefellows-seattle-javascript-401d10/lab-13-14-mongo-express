'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const School = require('../model/school.js');

const schoolRouter = module.exports = new Router();
const debug = require('debug')('school:route');

schoolRouter.post('/api/school', jsonParser, function(req, res, next){
  debug('api/school POST request');
  new School(req.body).save()
  .then(school => res.json(school))
  .catch(next);
});


// listRouter.get('/api/list/:id', function(req, res, next){
//   List.findById(req.params.id)
//   .then(list => res.json(list))
//   .catch(next);
// });