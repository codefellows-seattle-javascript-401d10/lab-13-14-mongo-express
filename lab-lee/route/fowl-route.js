'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Fowl = require('../model/fowl.js')

const fowlRouter = module.exports = new Router();


fowlRouter.post('/api/fowl', jsonParser, function(req, res, next) {
  req.body.timestamp = new Date();
  new Fowl(req.body).save()
  .then(fowl => res.json(fowl))
  .catch(next);
});

fowlRouter.get('/api/fowl/:id', function(req, res, next) {
  req.body.timestamp = new Date();
  Fowl.findById(req.params.id)
  .then(fowl => res.json(fowl))
  .catch(next);
});
