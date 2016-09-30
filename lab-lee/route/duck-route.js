'use strtict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json;
const debug = require('debug')('duck:router');
const createError = require('http-errors');

const Fowl = require('../model/fowl.js');

const duckRouter = module.exports = new Router();

duckRouter.post('/api/fowl/:fowlID/duck', jsonParser, function(req, res, next) {
  debug('hit POST for api/fowl/:fowlID/duck');
  Fowl.findByIdAndAddDuck(req.params.fowlID, req.body)
  .then( duck => res.json(duck))
  .catch( err => next(createError(404, err.message)));
});
