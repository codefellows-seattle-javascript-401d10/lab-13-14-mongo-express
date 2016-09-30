'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('series:book-route');

const Series = require('../model/series.js');
// const Book = require('../model/book.js')

const bookRouter = module.exports = new Router();


bookRouter.get('/api/series/:seriesID/book/:bookID', function(req, res, next){
  debug('bookRouter.get');
  return Series.findBookById(req.params.seriesID, req.params.bookID)
  .then(book => res.json(book))
  .catch(next);
});

bookRouter.post('/api/series/:seriesID/book', jsonParser, function(req, res, next){
  debug('bookRouter.post');
  return Series.findByIdAndAddBook(req.params.seriesID, req.body)
  .then(book => res.json(book))
  .catch(next);
});
