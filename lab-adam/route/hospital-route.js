'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('hospital:hospital-route');

const createError = require('http-errors');
const City = require('../model/city.js');
const Hospital = require('../model/hospital.js');

const hospitalRouter = module.exports = new Router();

hospitalRouter.get('/api/city/:cityID/hospital/:id', function(req, res, next){
  debug('running GET route');
  Hospital.findById(req.params.id)
  .then(hospital => res.json(hospital))
  .catch(err => next(createError(404, err.message)));
});

hospitalRouter.put('/api/city/:cityID/hospital/:id', jsonParser, function(req, res, next){
  debug('running GET route');
  Hospital.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(hospital => res.json(hospital))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

hospitalRouter.post('/api/city/:cityID/hospital', jsonParser, function(req, res, next){
  debug('running POST route');
  City.findByIdAndAddHospital(req.params.cityID, req.body)
  .then(hospital => res.json(hospital))
  .catch(next);
});

hospitalRouter.delete('/api/city/:cityID/hospital/:id', function(req, res, next){
  debug('running DELETE route');
  Hospital.findById(req.params.id).remove()
  .then(() => {
    return City.findById(req.params.cityID);
  })
  .then(data => {
    return data.hospitals.pull({_id:req.params.id});
  })
  .then((err) => {
    // Mongo not 'rejecting' promise but returns with err. Catch here if exists.
    if (err.name === 'NotFoundError') next(createError(404, err.message));
    res.status(204).send();
  })
  .catch(err => next(createError(404, err.message)));
});
