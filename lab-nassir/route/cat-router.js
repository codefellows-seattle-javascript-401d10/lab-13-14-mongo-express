'use strict';

const Router = require('express').Router;
const debug = require('debug')('cat:cat-router');
const jsonParser = require('body-parser').json();

const Cafe = require('../model/cafe');
const Cat = require('../model/cat');

const catRouter = module.exports = new Router();

catRouter.post('/api/cafe/:cafeId/cat', jsonParser, function(req, res, next){
  debug('Hit POST router');
  Cafe.findByIdAndAddCat(req.params.cafeId, req.body)
  .then(cat => res.json(cat))
  .catch(next);
});

catRouter.get('/api/cafe/:cafeId/cat/:id', function(req, res, next){
  debug('Hit GET router');
  Cat.findById(req.params.id)
  .then(cat => res.json(cat))
  .catch(next);
});
