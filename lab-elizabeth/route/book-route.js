'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();

const Series = require('../model/series');

const bookRouter = module.exports = new Router();

bookRouter.post('/api/list/:seriesID/note', jsonParser, function(req, res, next){
  Series.findByIdAndAddBook(req.params.seriesID, req.body)
  .then(book => res.json(book))
  .catch(next);
});
