'use strict';


const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('debug:portfolioRouter');

const portfolio = require('../model/portfolio.js');

const portfolioRouter = module.exports = new Router();

portfolioRouter.post('/api/portfolio', jsonParser, function(req, res, next){
  debug('hit route POST /api/portfolio');
  req.body.timestamp = new Date();
  new portfolio(req.body).save()
  .then(portfolio => res.json(portfolio))
  .catch(next);
});

portfolioRouter.get('/api/portfolio/:id', function(req, res, next){
  debug('hit route GET /api/portfolio');
  portfolio.findById(req.params.id)
  .then(portfolio => res.json(portfolio))
  .catch(next);
});

portfolioRouter.put('/api/portfolio/:id', jsonParser, function(req, res, next){
  debug('hit route PUT /api/porfolio');
  portfolio.findById(req.params.id, req.body)
  .then( portfolio => res.json(portfolio))
  .catch(next);
});

portfolioRouter.delete('/api/portfolio/:id', function(req, res, next){
  debug('hit route DELETE /api/portfolio');
  portfolio.findById(req.params.id)
  .then(() => res.status(204).send())
  .catch( err => next(err));
});
