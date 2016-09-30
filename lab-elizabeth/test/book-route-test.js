'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/booktest';

const expect = require('chai').expect;
const request = require('superagent');
const Series = require('../model/series.js');
const Book = require('../model/book.js');

require('../server');

const url = `http://localhost:${PORT}`;

const exampleBook = {
  published: '2005',
  author: 'R.F.Rankin',
  title: 'The Brightonomicon',
  description: 'Hugo Rune vs. Count Otto Black. Rizla cannot remember any of it',
};

const exampleSeries = {
  title: 'The Brentford Trilogy',
  author: 'R.F.Rankin',
  description: 'Drunks save the world from the forces of darkness',
};

describe('testing book routes', function(){

  describe('testing GET requests', function(){

    before(done => {
      console.log('hitting before block');
      new Series(exampleSeries).save()
      .then(series => {
        this.tempSeries = series;
        exampleBook.seriesID = this.tempSeries._id;
        done();
      })
      .catch(done);
      // new Book(exampleBook).save(function(err, exampleSeries))
      // .then(book => {
      //   console.log('book', book);
      //   this.tempBook = book;
      //   done();
      // })
      // .catch(done);
    });

    after(done => {
      // console.log('hitting after block');
      Promise.all([
        Series.remove({}),
        Book.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });

    it('should return a book', done => {
      request.get(`${url}/api/series/${this.tempSeries._id}/book/${this.tempBook._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.seriesID).to.equal(this.tempSeries._id);
        expect(res.body._id).to.equal(this.tempBook._id);
        done();
      });
    });

  });

  // describe('testing POST requests', function(){
  //
  //   describe('with valid series.id and book.body', () => {
  //
  //     before(done => {
  //       new Series(exampleSeries).save()
  //       .then(series => {
  //         this.tempSeries = series;
  //         done();
  //       })
  //       .catch(done);
  //     });
  //
  //     after(done => {
  //       exampleBook.published = '2005';
  //       exampleBook.author = 'R.F.Rankin';
  //       exampleBook.title = 'The Brightonomicon';
  //       exampleBook.description = 'Hugo Rune vs. Count Otto Black. Rizla cannot remember any of it';
  //       Promise.all([
  //         Series.remove({}),
  //         Book.remove({}),
  //       ])
  //       .then(() => done())
  //       .catch(done);
  //     });
  //
  //     it('should create a book', done => {
  //       request.post(`${url}/api/series/${this.tempSeries._id}/book`)
  //       .send(exampleBook)
  //       .end((err, res) => {
  //         if(err) return done(err);
  //         expect(res.status).to.equal(200);
  //         expect(res.body.seriesID).to.equal(this.tempSeries._id.toString());
  //         done();
  //       });
  //     });
  //
  //     it('should create a book', done => {
  //       exampleBook.published = '';
  //       request.post(`${url}/api/series/${this.tempSeries._id}/book`)
  //       .send(exampleBook)
  //       .end((err, res) => {
  //         if(err) return done(err);
  //         expect(res.status).to.equal(200);
  //         expect(res.body.seriesID).to.equal(this.tempSeries._id.toString());
  //         done();
  //       });
  //     });
  //
  //   });
  //
  //   describe('with invalid id or body', () => {
  //
  //     before(done => {
  //       new Series(exampleSeries).save()
  //       .then(series => {
  //         this.tempSeries = series;
  //         done();
  //       })
  //       .catch(done);
  //     });
  //
  //     after(done => {
  //       exampleBook.published = '2005';
  //       exampleBook.author = 'R.F.Rankin';
  //       exampleBook.title = 'The Brightonomicon';
  //       exampleBook.description = 'Hugo Rune vs. Count Otto Black. Rizla cannot remember any of it';
  //       Promise.all([
  //         Series.remove({}),
  //         Book.remove({}),
  //       ])
  //       .then(() => done())
  //       .catch(done);
  //     });
  //
  //     it('should return 404: not found', done => {
  //       request.post(`${url}/api/series/hippocampus/book`)
  //       .send(exampleBook)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(404);
  //         done();
  //       });
  //     });
  //
  //     it('should return 404: not found', done => {
  //       request.post(`${url}/api/series/hippocampus/book`)
  //       .send({})
  //       .end((err, res) => {
  //         expect(res.status).to.equal(404);
  //         done();
  //       });
  //     });
  //
  //     it('should return 400: bad request', done => {
  //       request.post(`${url}/api/series/${this.tempSeries._id}/book`)
  //       .send({})
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         done();
  //       });
  //     });
  //
  //     it('should return 400: bad request', done => {
  //       exampleBook.author = '';
  //       request.post(`${url}/api/series/${this.tempSeries._id}/book`)
  //       .send(exampleBook)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         done();
  //       });
  //     });
  //
  //
  //     it('should return 400: bad request', done => {
  //       exampleBook.title = '';
  //       request.post(`${url}/api/series/${this.tempSeries._id}/book`)
  //       .send(exampleBook)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         done();
  //       });
  //     });
  //
  //     it('should return 400: bad request', done => {
  //       exampleBook.description = '';
  //       request.post(`${url}/api/series/${this.tempSeries._id}/book`)
  //       .send(exampleBook)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         done();
  //       });
  //     });
  //
  //   });
  //
  // });

});
