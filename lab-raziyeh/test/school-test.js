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
        done();
      });
    });
  });

  describe('Testing api/school', function() {

  });

});