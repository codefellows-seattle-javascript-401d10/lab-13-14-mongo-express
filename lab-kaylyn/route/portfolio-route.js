'use strict';


const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('debug:portfolioRouter');

const Portfolio = require('../model/portfolio.js');
const pageMiddleware = require('../lib/page-middleware.js');

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
  .populate('projects')
  .then(portfolio => res.json(portfolio))
  .catch(err => next(createError(404, err.message)));
});

portfolioRouter.put('/api/portfolio/:id', jsonParser, function(req, res, next){
  debug('hit route PUT /api/porfolio');
  Portfolio.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then( portfolio => res.json(portfolio))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err); //mongoose always handles validation erros so it's already taken care of in the middleware error handlling logic
    next(createError(404, err.message));
  });
});

portfolioRouter.delete('/api/portfolio/:id', function(req, res, next){
  debug('hit route DELETE /api/portfolio');
  Portfolio.findByIdAndRemove(req.params.id)

  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});

portfolioRouter.get('/api/portfolio', pageMiddleware, function(req, res, next){
  let offset = req.query.offset;
  let pagesize = req.query.pagesize;
  let page = req.query.page;
  let skip = offset + pagesize * page;
  Portfolio.find().skip(skip).limit(pagesize)
  .then(portfolios => res.json(portfolios))
  .catch(next);
});
