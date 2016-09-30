'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('location: location-route');
const createError = require('http-errors');

//APP MODULES
const Fruit = require('../model/fruit.js');
const Location = require('../model/location.js');

// MODULE CONSTANTS
const locationRouter = module.exports = new Router();

// write a list to the database with a given id
locationRouter.post('/api/fruit/:fruitID/location', jsonParser, function(req, res, next) {
  debug('hit POST route');
  Fruit.findByIdAndAddLocation(req.params.fruitID, req.body)
  .then(location => res.json(location)) //returns location and sends
  .catch(next); //errors are handled in error middleware
});

// get a list from the database with a given id
locationRouter.get('/api/location/:id', function(req, res, next){
  debug('hit GET route');
  Location.findById(req.params.id)
  .then(location => res.json(location))
  .catch(err => next(createError(404, err.message)));
});

// delete an item from the database with a given id
locationRouter.delete('/api/location/:locationID', function(req, res, next){
  debug('hit DELETE route');
  Fruit.findByIdAndRemoveLocation(req.params.locationID)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
