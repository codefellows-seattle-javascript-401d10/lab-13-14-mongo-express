'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const School = require('../model/school.js');

const schoolRouter = module.exports = new Router();

schoolRouter.post('/api/school', jsonParser, function(req, res, next){
  new School(req.body).save()
  .then(list => res.json(list))
  .catch(next);
});


// listRouter.get('/api/list/:id', function(req, res, next){
//   List.findById(req.params.id)
//   .then(list => res.json(list))
//   .catch(next);
// });