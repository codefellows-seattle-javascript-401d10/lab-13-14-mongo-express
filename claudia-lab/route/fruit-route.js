'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('fruit:server');
const createError = require('http-errors');

//APP MODULES
const Fruit = require('../model/fruit.js');
const pageMiddleware = require('../lib/page-middleware.js');

// MODULE CONSTANTS
const fruitRouter = module.exports = new Router();

// write a list to the database with a given id
fruitRouter.post('/api/fruit', jsonParser, function(req, res, next) {
  debug('hit route POST /api/fruit');
  new Fruit(req.body).save() //save before writing to database
  //.save returns a Promise.
  .then(fruit => res.json(fruit)) //returns a list to us
  .catch(next);
});

// find an item in the database with a given id
fruitRouter.get('/api/fruit/:id', function(req, res, next){
  debug('hit route GET /api/fruit/:id');
  Fruit.findById(req.params.id)
  .populate('locations') //name of property we are trying to populate
  .then(fruit => res.json(fruit))
  .catch(err => next(createError(404, err.message)));
});

// returns an array of all lists with pagination
fruitRouter.get('/api/fruit', pageMiddleware, function(req, res, next){
  debug('hit route GET /api/fruit');
  let offset = req.query.offset;
  let pagesize = req.query.pagesize;
  let page = req.query.page;
  let skip = offset + pagesize * page;

  Fruit.find().skip(skip).limit(pagesize) //if it doesn't find anything, gives empty array

  .then(fruits => res.json(fruits))
  .catch(next);
});

// update an item with a given id
fruitRouter.put('/api/fruit/:id', jsonParser, function(req, res, next){
  debug('hit route UPDATE /api/fruit/:id');
  Fruit.findByIdAndUpdate(req.params.id, req.body, {new: true}) //new:true actually gets a list back
  .then(fruit => res.json(fruit))
  .catch(err => {
    if (err.name ==='Validation Error') return next(err);
    next(createError(404, err.message));
  });
});

// delete an item with a given id
fruitRouter.delete('/api/fruit/:id', function(req, res, next){
  debug('hit route DELETE /api/fruit/:id');
  Fruit.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});

//mongoose always returns ValidationError when there is a problem with validation LOL
