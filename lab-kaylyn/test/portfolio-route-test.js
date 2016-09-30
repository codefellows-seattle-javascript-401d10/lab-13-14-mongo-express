
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
  work: 'pudge work',
};

const exampleProject = {
  projectName: 'some project',
  aboutProject:  'about this project',
  projectLink: 'some link to project',
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
          return Portfolio.findByIdAndAddProject(portfolio._id, exampleProject);
        })
        .then( project => {
          this.tempProject = project;
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
          expect(res.body.work).to.equal('pudge work');
          expect(res.body.projects.length).to.equal(1);
          expect(res.body.projects[0].projectName).to.equal(exampleProject.projectName);
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
        let updatedPortfolio = {
          name: 'pudgey pudge',
          about:'bout that pudge',
          work:'pudge life',
        };
        request.put(`${url}/api/portfolio/${this.tempPortfolio._id}`)
        .send(updatedPortfolio)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.id).to.equal(updatedPortfolio._id);
          expect(res.body.name).to.equal(updatedPortfolio.name);
          expect(res.body.about).to.equal(updatedPortfolio.about);
          expect(res.body.work).to.equal(updatedPortfolio.work);
          this.tempPortfolio = res.body;
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
        let updatedPortfolio = {
          name: 'pudgey pudge',
          about:'bout that pudge',
          work:'pudge life',
        };
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
  describe('testing GET request with pageination', function(){
    describe('with valid query', function(){
      before( done => {
        console.log('examplePortfolio', examplePortfolio);
        var portfolios = [];
        for (var i=0; i< 1000; i++){
          portfolios.push(new Portfolio(examplePortfolio).save());
        }
        Promise.all(portfolios)
        .then( portfolios => {
          this.tempPortfolio = portfolios;
          done();
        })
        .catch(done);
      });
      after( done => {
        if(this.tempPortfolios){
          Portfolio.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return 50 portfolios', done => {
        request.get(`${url}/api/portfolio`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(50);
          done();
        });
      });
    });
  });
});
