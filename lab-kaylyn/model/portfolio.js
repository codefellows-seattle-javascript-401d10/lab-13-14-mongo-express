'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const debug = require('debug')('portfolio:portfolio');

const Project = require('./project.js');

const portfolioSchema = Schema({
  name: {type: String, required: true},
  about: {type: String, required: true},
  projects: [{type: Schema.Types.ObjectId, ref: 'project'}],
  work: {type: String, required: true},
  timestamp: {type: Date, required: true},
});

const Portfolio = module.exports = mongoose.model('portfolio', portfolioSchema);

Portfolio.findByIdAndAddProject = function(id, project){
  debug('Portfolio.findByIdAndAddProject');
  return Portfolio.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(portfolio => {
    project.portfolioID = portfolio._id;
    this.tempPortfolio = portfolio;
    return new Project(project).save();
  })
  .then( project => {
    this.tempPortfolio.projects.push(project._id);
    this.tempProject = project;
    return this.tempPortfolio.save();
  })
  .then( () => {
    return this.tempProject;
  });
};
