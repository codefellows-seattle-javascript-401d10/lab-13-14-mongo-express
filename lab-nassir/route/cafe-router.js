'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Cafe = require('../model/cafe');

const cafeRouter = module.exports = new Router();

cafeRouter.post('/api/cafe', function(req, res, next){
  req.body.timestamp = new Date();
  new Cafe(req.body).save()
  .then(cafe => res.json(cafe))
  .catch(next);
});

cafeRouter.get('/api/cafe/:id', function(req, res, next){
  Cafe.findById(req.params.id)
  .then(cafe => res.json(cafe))
  .catch(next);
});

module.exports = cafeRouter;
