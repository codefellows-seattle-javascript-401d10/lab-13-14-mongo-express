'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/notetest';

const expect = require('chai').expect;
const request = require('superagent');

const School = require('../model/school.js');

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleSchool = {
  name: 'Bellevue High School',
  Type: 'Public',
  state: 'WA',
  city: 'Bellevue',
  students: 250,
  grade:'A',
};

//write a test to ensure that your api returns a status code of 404 for routes that have not been registered
describe('Testing API', function() {

  describe('General Testing on API', function() {
    it('Testing routes that have not been registered', done => {
      request.get(`${url}/api/unRegistereg_URL`)
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(err).to.not.be.null;
        done();
      });
    });
  });

  describe('Testing api/school', function() {
    describe('Testing POST requests', function() {
      describe('POST - test 400, responds with \'bad request\' for if no body provided or invalid body', function() {
        it('Testing a post request if no body provided or invalid body', done => {
          request.post(`${url}/api/school`)
          .send({name:''})
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.err).to.not.be.null;
            done();
          });
        });
      });

      describe('POST - test 200, response body like {<data>} for a post request with a valid body', function() {
        
        before( done => {
          exampleSchool.timestamp = new Date();
          new School(exampleSchool).save()
         .then( school => {
           this.tempSchool = school;
           done();
         })
        .catch(done);
        });

        it('Testing a post request with a valid body', done => {
          request.post(`${url}/api/school`)
          .send(exampleSchool)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            this.tempSchool = res.body;
            done();
          });
        });

      });
    });

    describe('Testing GET requests', function() {
      describe('GET - test 200, response body like {<data>} for a request made with a valid id', function() {
        before(done => {
          new School(exampleSchool).save()
            .then(school => {
              this.tempSchool = school;
              done();
            })
            .catch(done);
        });

        it('Testing a GET request made with a valid id', done => {
          request.get(`${url}/api/school/${this.tempSchool._id}`)
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(200);
            done();
          });
        });
      });

      describe('GET - test 404, responds with \'not found\' for valid request made with an id that was not found', function() {
        it('Testing a GET request with an id that was not found', done => {
          request.get(`${url}/api/school/${1112}`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.err).to.not.be.null;
            done();
          });
        });
      });
    });

    describe('Testing PUT requests', function() {

    });

    describe('Testing DELETE requests', function() {
      describe('DELETE - test 204, with no body, for a request with a valid id', function() {
        
        before(done => {
          new School(exampleSchool).save()
            .then(school => {
              this.tempSchool = school;
              done();
            })
            .catch(done);
        });

        it('Testing a DELETE request with no body, with a valid id', done => {
          request.delete(`${url}/api/school/${this.tempSchool._id}`)
          .end((err, res) => {
            expect(res.status).to.equal(204);
            expect(res.err).to.be.null;
            done();
          });
        });
      });
    });

  });
});
