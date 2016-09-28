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
        
      });

      describe('POST - test 200, response body like {<data>} for a post request with a valid body', function() {
        
        // after( done => {
        //   new School(exampleSchool).save()
        //   .then( school => {
        //     this.tempSchool = school;
        //     done();
        //   })
        // .catch(done);
        // });

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

    });

    describe('Testing PUT requests', function() {

    });

    describe('Testing DELETE requests', function() {

    });

  });
});

