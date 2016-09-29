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
  description: 'Hugo Rune vs. Count Otto Black. Rizla can\'t remember any of it',
};

const exampleSeries = {
  title: 'The Brentford Trilogy',
  author: 'R.F.Rankin',
  description: 'Drunks save the world from the forces of darkness',
};

describe('testing book routes', function(){

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
          expect(status).to.equal(200);
          expect(res.body.seriesID).to.equal(this.tempSeries._id.toString());
          // for(var key in res.body){
          //   if(key !== res.body.seriesID) expect(res.body[key]).to.equal(this.tempSeries[key]);
          // }
          done();
        });
      });
    });

  });

});
