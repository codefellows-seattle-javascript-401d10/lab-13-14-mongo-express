'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('series:series');
const Schema = mongoose.Schema;
const createError = require('http-errors');

const Book = require('./book.js');

const seriesSchema = Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  author: {type: String, required: true},
  books: [{type: Schema.Types.ObjectId, ref: 'book'}],
});

const Series = module.exports = mongoose.model('series', seriesSchema);

Series.findByIdAndAddBook = function(id, book){
  debug('findByIdAndAddBook');
  return Series.findById(id)
  .catch(err => Promise.reject(createError(400, err.message)))
  .then(series => {
    debug('series', series);
    book.seriesID = series._id;
    this.tempSeries = series;
    return new Book(book).save();
  })
  .then(book => {
    debug('book', book);
    this.tempSeries.books.push(book._id);
    this.tempBook = book;
    return this.tempSeries.save();
  })
  .then(() => {
    return Promise.resolve(this.tempBook);
  });
};
