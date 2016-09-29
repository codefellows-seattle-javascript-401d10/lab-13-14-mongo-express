'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug');

const List = require('../model/list.js');
const Person = require('../model/person.js');

const personRouter = module.exports = new Router();

personRouter.post('/api/list/:listID/person', jsonParser, function(req, res, next){
  debug('running person POST');
  List.findByIdAndAddPerson(req.params.listID, req.body)
  .then( person => res.json(person))
  .catch(next);
});

//TODO: This probably isn't right
personRouter.get('/api/list/person/:personID', jsonParser, function(req, res, next){
  debug('running person GET');
  Person.findById(req.params.personID)
  .then(person => {
    res.json(person);
  })
  .catch(err => next(createError(404, err.message)));
});

//TODO: This probably isn't right
personRouter.put('/api/list/:listID/person', jsonParser, function(req, res, next){
  debug('running person PUT');
  List.persons.findByIdAndUpdate(req.params.listID, req.body, {new: true})
  .then( persons => res.json(persons))
  .catch(err => {
    if (err.name === 'ValidationError') return next (err);
    next(createError(404, err.message));
  });
});

personRouter.delete('/api/list/:listID/person/:personID', function(req, res, next){
  debug('running person DELETE');
  List.findByIdAndDeletePerson(req.params.listID, req.params.personID)
  .then( () => {
    res.sendStatus(204);
  })
  .catch( err => next(createError(404, err.message)));
});
