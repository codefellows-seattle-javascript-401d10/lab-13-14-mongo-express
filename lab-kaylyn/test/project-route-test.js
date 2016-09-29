
'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/projecttest';

const expect = require('chai').expect;
const request = require('superagent');
const Portfolio = require('../model/portfolio.js');
const Project = require('../model/project.js');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleProject = {
  projectName: 'some project',
  aboutProject:  'about this project',
  projectLink: 'some link to project',
};

const examplePortfolio = {
  name: 'pudge',
  about: 'about pudge',
  work: 'pudge work',
  timestamp: new Date(),
};

describe('testing project routes', function(){
  describe('testing post requests', function(){
    describe('with valid porfolio id and projectBody', function() {
      before(done => {
        new Portfolio(examplePortfolio).save()
        .then( portfolio => {
          this.tempPortfolio = portfolio;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Portfolio.remove({}),
          Project.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a project', done => {
        request.post(`${url}/api/portfolio/${this.tempPortfolio._id}/project`)
        .send(exampleProject)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.projectName).to.equal(exampleProject.projectName);
          expect(res.body.portfolioID).to.equal(this.tempPortfolio._id.toString());
          done();
        });
      });
      describe('testing POST requests with invalid body or no body provided', () => {
        it('should return a status code of 400', done => {
          request.post(`${url}/api/portfolio/${this.tempPortfolio._id}/project`)
          .send('justastring')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
        });
      });
    });
  });

  // describe('testing GET requests', function(){
  //   describe('testing with valid body', function(){
  //     before( done => {
  //       examplePortfolio.timestamp = new Date();
  //       new Portfolio(examplePortfolio).save()
  //       .then( portfolio => {
  //         this.tempPortfolio = portfolio;
  //         return Portfolio.findByIdAndAddProject(portfolio._id, exampleProject);
  //       })
  //       .then( project => {
  //         this.tempProject = project;
  //         done();
  //       })
  //       .catch(done);
  //     });
  //     after( done => {
  //       Promise.all([
  //         Portfolio.remove({})
  //         Project.remove({})
  //       ])
  //       .then(() => done())
  //       .catch(done);
  //     });
  //     it('should return a project', done => {
  //
  //     });
  //   });
  // });

});
