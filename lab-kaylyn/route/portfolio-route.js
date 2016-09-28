'use strict';


const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const portfolio = require('../model/portfolio.js');

const portfolioRouter = module.exports = new Router();

portfolioRouter.post('/api/portfolio', jsonParser, function(req, res, next){
  req.body.timestamp = new Date();
  new portfolio(req.body).save()
  .then(portfolio => res.json(portfolio))
  .catch(next);
});

portfolioRouter.get('/api/portfolio/:id', function(req, res, next){
  portfolio.findById(req.params.id)
  .then(portfolio => res.json(portfolio))
  .catch(next);
});
