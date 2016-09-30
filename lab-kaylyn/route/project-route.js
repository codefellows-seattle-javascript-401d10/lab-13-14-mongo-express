'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('portfolio:projectRouter');
const createError = require('http-errors');

const Portfolio = require('../model/portfolio.js');
const Project = require('../model/project.js');

const projectRouter = module.exports = new Router();

projectRouter.post('/api/portfolio/:portfolioID/project', jsonParser, function(req, res, next){
  debug('HIT POST');
  Portfolio.findByIdAndAddProject(req.params.portfolioID, req.body)
  .then( project => res.json(project))
  .catch(next);
});

projectRouter.get('/api/project/:id', function(req, res, next){
  Project.findById(req.params.id)
  .then(project => res.json(project))
  .catch(err => next(createError(404, err.message)));
});

projectRouter.delete('/api/project/:id', function(req, res, next){
  debug('hit route DELETE /api/portfolio');
  Portfolio.findByIdAndRemoveProject(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
