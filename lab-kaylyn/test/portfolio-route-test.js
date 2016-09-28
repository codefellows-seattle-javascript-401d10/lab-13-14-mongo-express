
'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/notetest';

const expect = require('chai').expect;
const request = require('superagent');
const Portfolio = require('../model/portfolio.js');

require('../server.js');

const url = `http://localhost:${PORT}`;
const examplePortfolio = {
  name: 'lulwat',
};

describe('testing route /api/portfolio', function(){
  describe('testing POST requests', function(){
    describe('with valid body', function(){
      after( done => {
        if(this.tempPortfolio){
          Portfolio.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a portfolio', done => {
        request.post(`${url}/api/portfolio`)
        .send(examplePortfolio)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('lulwat');
          this.tempPortfolio = res.body;
          done();
        });
      });
    });
  });

  describe('testing GET requests', function(){
    describe('with valid body', function(){
      before( done => {
        examplePortfolio.timestamp = new Date();
        new Portfolio(examplePortfolio).save()
        .then( portfolio => {
          this.tempPortfolio = portfolio;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete examplePortfolio.timestamp;
        if(this.tempPortfolio){
          Portfolio.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a portfolio', done => {
        request.get(`${url}/api/portfolio/${this.tempPortfolio._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('lulwat');
          done();
        });
      });
    });
  });
});
