'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/customertest';

const expect = require('chai').expect;
const request = require('superagent');

const Customer = require('../model/customer.js');

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleCustomer = {
  name: 'Raziyeh',
  family: 'Bazargan',
  email: 'r.bazargan@gmail.com',
  phone: '425-598-5126',
  address: '11000 NE 10th St',
  city:'Bellevue',
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

  describe('Testing api/customer', function() {
    describe('Testing POST requests', function() {
      describe('POST - test 400, responds with \'bad request\' for if no body provided or invalid body', function() {
        it('Testing a post request if no body provided or invalid body', done => {
          request.post(`${url}/api/customer`)
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
          exampleCustomer.timestamp = new Date();
          new Customer(exampleCustomer).save()
         .then( customer => {
           this.tempCustomer = customer;
           done();
         })
        .catch(done);
        });

        it('Testing a post request with a valid body', done => {
          request.post(`${url}/api/customer`)
          .send(exampleCustomer)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            this.tempCustomer = res.body;
            done();
          });
        });

      });
    });

    describe('Testing GET requests', function() {
      describe('GET - test 200, response body like {<data>} for a request made with a valid id', function() {
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              this.tempCustomer = customer;
              done();
            })
            .catch(done);
        });

        it('Testing a GET request made with a valid id', done => {
          request.get(`${url}/api/customer/${this.tempCustomer._id}`)
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(200);
            done();
          });
        });
      });

      describe('GET - test 404, responds with \'not found\' for valid request made with an id that was not found', function() {
        it('Testing a GET request with an id that was not found', done => {
          request.get(`${url}/api/customer/${1112}`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.err).to.not.be.null;
            done();
          });
        });
      });
    });

    describe('Testing PUT requests', function() {
      var tempCustomer;
      describe('PUT - test 200, response body like {<data>} for a post request with a valid body', () => {
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              tempCustomer = customer;
              done();
            })
            .catch(done);
        });

        it('Testing a PUT request made with a valid id', done => {
          request.put(`${url}/api/customer/${tempCustomer._id}`)
          .send({name:'gggg'})
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(200);
            done();
          });
        });
      });

      describe('PUT - test 400, responds with \'bad request\' for if no body provided or invalid body', () => {
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              this.tempCustomer = customer;
              done();
            })
            .catch(done);
        });
        it('Testing a PUT request made with a no body', done => {
          request.put(`${url}/api/customer/${this.tempCustomer._id}`)
          .set('Content-Type', 'application/json')
          .send('d')
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
        });
      });
    });

    describe('Testing DELETE requests', function() {
      describe('DELETE - test 204, with no body, for a request with a valid id', function() {
        
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              this.tempCustomer = customer;
              done();
            })
            .catch(done);
        });

        it('Testing a DELETE request with no body, with a valid id', done => {
          request.delete(`${url}/api/customer/${this.tempCustomer._id}`)
          .end((err, res) => {
            expect(res.status).to.equal(204);
            done();
          });
        });
      });
    });
  });
});
