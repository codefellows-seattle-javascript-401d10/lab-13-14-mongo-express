
'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/portfoliotest';

const expect = require('chai').expect;
const request = require('superagent');
const Portfolio = require('../model/portfolio.js');

require('../server.js');

const url = `http://localhost:${PORT}`;
const examplePortfolio = {
  name: 'pudge',
  about: 'about pudge',
  projects: 'projects of pudge',
  work: 'pudge work',
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
          expect(res.body.name).to.equal('pudge');
          expect(res.body.about).to.equal('about pudge');
          expect(res.body.projects).to.equal('projects of pudge');
          expect(res.body.work).to.equal('pudge work');
          this.tempPortfolio = res.body;
          done();
        });
      });
    });
    describe('testing POST with invalid body or no body provided', function(){
      it('should return a 400 status code', done => {
        request.post(`${url}/api/portfolio`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
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
          expect(res.body.name).to.equal('pudge');
          expect(res.body.about).to.equal('about pudge');
          expect(res.body.projects).to.equal('projects of pudge');
          expect(res.body.work).to.equal('pudge work');
          done();
        });
      });
    });
    describe('testing GET request with invalid id', function(){
      it('should return a 404 status code', done => {
        request.get(`${url}/api/portfolio/666`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('testing PUT requests', function(){
    describe('testing PUT with valid body and id', function(){
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
      it('should return an updated portfolio', done => {
        let updatedPortfolio = {name: 'pudgey pudge', about:'bout that pudge', projects:'project pudge face', work:'pudge life'};
        request.put(`${url}/api/portfolio/${this.tempPortfolio._id}`)
        .send(updatedPortfolio)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(updatedPortfolio._id);
          expect(res.body.name).to.equal(updatedPortfolio.name);
          expect(res.body.about).to.equal(updatedPortfolio.about);
          expect(res.body.projects).to.equal(updatedPortfolio.projects);
          expect(res.body.work).to.equal(updatedPortfolio.work);
          updatedPortfolio = res.body;
          done();
        });
      });
      it('should return a 400 status code', done => {
        let updatedPortfolio = 'justastupidstring';
        request.put(`${url}/api/portfolio/${this.tempPortfolio._id}`)
        .set('Content-Type', 'application/json')
        .send(updatedPortfolio)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
      it('should return a 404 status code', done => {
        let updatedPortfolio = {name: 'pudgey pudge', about:'bout that pudge', projects:'project pudge face', work:'pudge life'};
        request.put(`${url}/api/portfolio/${this.tempPortfolio.cheese}`)
        .send(updatedPortfolio)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('testing DELETE requests', function(){
    describe('testing DELETE with valid id', function(){
      before( done => {
        examplePortfolio.timestamp = new Date();
        new Portfolio(examplePortfolio).save()
        .then( portfolio => {
          this.tempPortfolio = portfolio;
          done();
        })
        .catch(done);
      });
      it('should return a status code 0f 204', done => {
        request.delete(`${url}/api/portfolio/${this.tempPortfolio._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
      describe('testing DELETE requests with invaid id', function(){
        it('should return a status code of 404', done => {
          request.delete(`${url}/api/portfolio`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });
});
