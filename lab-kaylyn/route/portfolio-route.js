'use strict';


const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('debug:portfolioRouter');

const Portfolio = require('../model/portfolio.js');

const portfolioRouter = module.exports = new Router();

portfolioRouter.post('/api/portfolio', jsonParser, function(req, res, next){
  debug('hit route POST /api/portfolio');
  req.body.timestamp = new Date();
  new Portfolio(req.body).save()
  .then(portfolio => res.json(portfolio))
  .catch(next);
});

portfolioRouter.get('/api/portfolio/:id', function(req, res, next){
  debug('hit route GET /api/portfolio');
  Portfolio.findById(req.params.id)
  .then(portfolio => res.json(portfolio))
  .catch(err => next(createError(404, err.message)));
});

portfolioRouter.put('/api/portfolio/:id', jsonParser, function(req, res, next){
  debug('hit route PUT /api/porfolio');
  Portfolio.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then( portfolio => res.json(portfolio))
  .catch(err => next(createError(404, err.message)));
});

portfolioRouter.delete('/api/portfolio/:id', function(req, res, next){
  debug('hit route DELETE /api/portfolio');
  Portfolio.findById(req.params.id).remove()
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
