'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('park:dog-route');
const createError = require('http-errors');

const Park = require('../model/park.js');
const Dog = require('../model/dog.js');

const dogRouter = module.exports = new Router();

//this route will always stay the same, the logic for adding the dog is actually happening in the park model.
dogRouter.post('/api/park/:parkID/dog', jsonParser, function(req, res, next){
  debug('hit post route for dog');
  debug('req.body', req.body);
  Park.findByIdAndAddDog(req.params.parkID, req.body)
  .then(dog => res.json(dog))
  .catch(next);
});

dogRouter.delete('/api/dog/:dogID', function(req, res, next){
  debug('hit delete route for dog');
  //want to send the parkID of the dog, and the dog itself, so you can delete it
  Park.findByIdAndDeleteDog(req.params.dogID)
  .then(() => res.status(204).send())
    .catch(err => next(createError(404, err.message)));
});


dogRouter.get('/api/park/dog/:dogID', function(req, res, next){
  debug('hit get route for dog');
  Dog.findById(req.params.dogID)
  .then(dog => res.json(dog))
  .catch(err => next(createError(404, err.message)));
});
