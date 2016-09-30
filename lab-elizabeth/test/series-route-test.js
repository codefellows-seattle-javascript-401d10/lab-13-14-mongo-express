'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/seriestest';

const expect = require('chai').expect;
const request = require('superagent');
const Series = require('../model/series');

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleSeries = {
  title: 'Chronicles of Narnia',
  author: 'C.S.Lewis',
  description: 'Lions, Magical Queens, portals to other worlds',
};

const exampleBook = {
  published: '2 May 1955',
  title: 'The Magicians Nephew',
  author: 'C.S.Lewis',
  description: 'Oh no, Digory and Polly messed with the wrong rings',
};

describe('testing series routes', function(){

  describe('testing GET requests', function(){

    describe('with valid query', function(){

      before( done => {
        new Series(exampleSeries).save()
        .then( series => {
          this.tempSeries = series;
          return Series.findByIdAndAddBook(series._id, exampleBook);
        })
        .then(book => {
          this.tempBook = book;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempSeries){
          Series.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a series', done => {
        request.get(`${url}/api/series/${this.tempSeries._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.tempSeries._id.name);
          done();
        });
      });

    });

    describe('testing GET request with pageination', function(){

      describe('with valid query', function(){

        before(done => {
          var seriess = [];
          for (var i = 0; i < 1000; i++){
            seriess.push(new Series(exampleSeries).save());
          }

          Promise.all(seriess)
          .then(seriess => {
            this.tempSeries = seriess;
            done();
          })
          .catch(done);
        });

        after(done => {
          if(this.tempSeries){
            Series.remove({})
            .then(() => done())
            .catch(done);
            return;
          }
          done();
        });

        it('should return 50 series', done => {
          request.get(`${url}/api/series`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(50);
            done();
          });
        });

      });

    });

  });

  describe('testing POST requests', function(){

    describe('with valid body', function(){

      after( done => {
        if(this.tempSeries){
          Series.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should create a series', done => {
        request.post(`${url}/api/series`)
        .send(exampleSeries)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          this.tempSeries = res.body;
          done();
        });
      });

    });

  });

});
