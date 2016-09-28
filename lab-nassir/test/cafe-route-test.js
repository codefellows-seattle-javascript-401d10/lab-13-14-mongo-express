'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/cattest';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('cat:test');
const Cafe = require('../model/cafe');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleCafe = {
  name: 'Test Cafe',
  address: 'Test Address',
};


// your tests should start your server when they begin and stop your server when they finish
// * write a test to ensure that your api returns a status code of 404 for routes that have not been registered
// * write tests to ensure your `/api/model-name` endpoint responds as described for each condition below:
// * `GET` - test 200, response body like `{<data>}` for a request made with a valid id
// * `GET` - test 404, responds with 'not found' for valid request made with an id that was not found
// * `PUT` - test 200, response body like  `{<data>}` for a post request with a valid body
// * `PUT` - test 400, responds with 'bad request' for if no `body provided` or `invalid body`
// * `PUT` - test 404, responds with 'not found' for valid request made with an id that was not found
// * `POST` - test 400, responds with 'bad request' for if no `body provided` or `invalid body`
// * `POST` - test 200, response body like  `{<data>}` for a post request with a valid body
// * `DELETE` - test 204, with no body, for a request with a valid id
// * `DELETE` - test 404, responds with 'not found' for valid request made with an id that was not found

describe('Testing routes on /api/cafe', function(){

  describe('Testing POST /api/cafe', function(){

    after(done => {
      if(this.tempCafe) {
        Cafe.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
    });

    describe('Testing POST /api/cafe with VALID BODY', function(){
      it('Should return a status code of 200 and a valid cat cafe', done => {
        request.post(`${url}/api/cafe`)
        .send(exampleCafe)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Test Cafe');
          expect(res.body.address).to.equal('Test Address');
          done();
        });
      });
    });

    describe('Testing POST /api/cafe with NO BODY or INVALID BODY', function(){
      it('Should return a status code of 400 and an error message', done => {
        request.post(`${url}/api/cafe`)
        .set('Content-type', 'application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('Error Message');
          done();
        });
      });
    });
  });

  describe('Testing GET /api/cafe', function(){

    describe('Testing GET /api/cafe with VALID ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
      });

      it('Should return a status code of 200 and a cat cafe', done => {
        request.get(`${url}/api/cafe/${this.tempCafe._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Test Cafe');
          expect(res.body.address).to.equal('Test Address');
          done();
        });
      });
    });

    describe('Testing GET /api/cafe with NO ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
      });

      it('Should return a status code of 404 and an error message', done => {
        request.get(`${url}/api/cafe/12345`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('Some Error Message');
          done();
        });
      });
    });
  });

  // describe('Testing PUT /api/cafe', function(){
  //
  //   describe('Testing PUT /api/cafe with VALID BODY', function(){
  //
  //   });
  //   describe('Testing GET /api/cafe with NO ID', function(){
  //
  //   });
  // });

});
