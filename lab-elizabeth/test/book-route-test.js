'use strict';

const debug = require('debug')('series:book-route-test');

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/booktest';

const expect = require('chai').expect;
const request = require('superagent');
const Series = require('../model/series.js');
const Book = require('../model/book.js');

const server = require('../server');

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

  before(done => {
    debug('before book-router');
    if(!server.isRunning) {
      server.listen(PORT, () => {
        server.isRunning = true;
        debug(`server up, mate! <(0v0)> ${PORT}`);
        done();
      });
      return;
    }
    done();
  });

  after(done => {
    debug('after book-router');
    if(server.isRunning){
      server.close(() => {
        server.isRunning = false;
        debug('server down, mate. <(=v=)>');
        done();
      });
      return;
    }
  });

  describe('testing DELETE requests', function(){

    describe('with valid ids', () => {

      before(done => {
        new Series(exampleSeries).save()
        .then(series => {
          exampleBook.seriesID = series._id;
          this.tempSeries = series;
          return Series.findByIdAndAddBook(series._id, exampleBook);
        })
        .then(book => {
          console.log(book);
          this.tempBook = book;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Series.remove({}),
          Book.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should delete a book', done => {
        console.log(this.tempSeries, this.tempBook);
        request.delete(`${url}/api/series/${this.tempSeries._id}/book/${this.tempBook._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });

    });

  });

  describe('testing GET requests', function(){

    describe('with valid ids', function(){

      before(done => {
        new Series(exampleSeries).save()
        .then(series => {
          exampleBook.seriesID = series._id;
          this.tempSeries = series;
          return Series.findByIdAndAddBook(series._id, exampleBook);
        })
        .then(book => {
          this.tempBook = book;
          done();
        })
        .catch(done);
      });

      after(done => {
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
          expect(res.body.seriesID).to.equal(this.tempSeries._id.toString());
          expect(res.body._id).to.equal(this.tempBook._id.toString());
          done();
        });
      });

    });

    describe('with invalid ids', () => {

      before(done => {
        new Series(exampleSeries).save()
        .then(series => {
          exampleBook.seriesID = series._id;
          this.tempSeries = series;
          return Series.findByIdAndAddBook(series._id, exampleBook);
        })
        .then(book => {
          this.tempBook = book;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Series.remove({}),
          Book.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return 404: not found', done => {
        request.get(`${url}/api/series/hippocampus/book/${this.tempBook._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });

      it('should return 404: not found', done => {
        request.get(`${url}/api/series/${this.tempSeries._id}/book/hippocampus`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });

    });

  });

  describe('testing POST requests', function(){

    describe('with valid series.id and book.body', () => {

      before(done => {
        new Series(exampleSeries).save()
        .then(series => {
          this.tempSeries = series;
          done();
        })
        .catch(done);
      });

      after(done => {
        exampleBook.published = '2005';
        exampleBook.author = 'R.F.Rankin';
        exampleBook.title = 'The Brightonomicon';
        exampleBook.description = 'Hugo Rune vs. Count Otto Black. Rizla cannot remember any of it';
        Promise.all([
          Series.remove({}),
          Book.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should create a book', done => {
        request.post(`${url}/api/series/${this.tempSeries._id}/book`)
        .send(exampleBook)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.seriesID).to.equal(this.tempSeries._id.toString());
          done();
        });
      });

      it('should create a book', done => {
        exampleBook.published = '';
        request.post(`${url}/api/series/${this.tempSeries._id}/book`)
        .send(exampleBook)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.seriesID).to.equal(this.tempSeries._id.toString());
          done();
        });
      });

    });

    describe('with invalid id or body', () => {

      before(done => {
        new Series(exampleSeries).save()
        .then(series => {
          this.tempSeries = series;
          done();
        })
        .catch(done);
      });

      after(done => {
        exampleBook.published = '2005';
        exampleBook.author = 'R.F.Rankin';
        exampleBook.title = 'The Brightonomicon';
        exampleBook.description = 'Hugo Rune vs. Count Otto Black. Rizla cannot remember any of it';
        Promise.all([
          Series.remove({}),
          Book.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return 404: not found', done => {
        request.post(`${url}/api/series/hippocampus/book`)
        .send(exampleBook)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });

      it('should return 404: not found', done => {
        request.post(`${url}/api/series/hippocampus/book`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });

      it('should return 400: bad request', done => {
        request.post(`${url}/api/series/${this.tempSeries._id}/book`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });

      it('should return 400: bad request', done => {
        exampleBook.author = '';
        request.post(`${url}/api/series/${this.tempSeries._id}/book`)
        .send(exampleBook)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });


      it('should return 400: bad request', done => {
        exampleBook.title = '';
        request.post(`${url}/api/series/${this.tempSeries._id}/book`)
        .send(exampleBook)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });

      it('should return 400: bad request', done => {
        exampleBook.description = '';
        request.post(`${url}/api/series/${this.tempSeries._id}/book`)
        .send(exampleBook)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });

    });

  });

});
