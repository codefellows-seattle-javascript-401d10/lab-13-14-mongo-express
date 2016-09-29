'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('portfolio:projectRouter');
const createError = require('http-errors');

const Portfolio = require('../model/portfolio.js');
const Project = require('../model/project.js');

const projectRouter = module.exports = new Router();

projectRouter.post('/api/portfolio/:portfolioID/project', jsonParser, function(req, res, next){
  debug('projectRouter.post');
  Portfolio.findByIdAndAddProject(req.params.portfolioID, req.body)
  .then( project => res.json(project))
  .catch(err => next(createError(404, err.message)));
});

projectRouter.get('/api/portfolio/project', function(req, res, next){
  Project.findById(req.params.id)
  .then(project => res.json(project))
  .catch(err => next(createError(404, err.message)));
});

projectRouter.put('/api/portfolio/project', jsonParser, function(req, res, next){
  debug('hit route PUT /api/porfolio');
  Project.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then( portfolio => res.json(portfolio))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
  });
});
