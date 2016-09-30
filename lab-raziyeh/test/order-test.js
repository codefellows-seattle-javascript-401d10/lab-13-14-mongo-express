'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/customertest';

const expect = require('chai').expect;
const request = require('superagent');
const Customer = require('../model/customer.js');
const Order = require('../model/order.js');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleOrder = {
  order_date: new Date(),
  price: 12000,
};
const exampleCustomer = {
  name: 'Raziyeh',
  family: 'Bazargan',
  email: 'r.bazargan@gmail.com',
  phone: '425-598-5126',
  address: '11000 NE 10th St',
  city:'Bellevue',
};

describe('Testing  API', function() {

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

  describe('Testing api/order', function() {
    
    describe('Testing GET requests', function() {
      describe('GET - test 200, response body like {<data>} for a request made with a valid order_id', function() {
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              this.tempCustomer = customer;
              return Customer.findByIdAndAddOrder(customer._id, exampleOrder);
            })
            .then(order => {
              this.tempOrder = order;
              done();
            })
            .catch(done);
        });

        it('Expect to return 200 for valid order_Id', done => {
          request.get(`${url}/api/order/${this.tempOrder._id}`)
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(200);
            expect(err).to.be.null;
            done();
          });
        });
      });
    });

    describe('Testing POST requests', function() {
      describe('POST - test 200, create a new Order', function() {
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              this.tempCustomer = customer;
              done();
            })
            .catch(done);
        });

        it('Expect to create a new Order', done => {
          request.post(`${url}/api/customer/${this.tempCustomer._id}/order`)
          .send(exampleOrder)
          .end((err, res) => {
            if(err) done(err);
            expect(res.body.price).to.equal(12000);
            expect(err).to.be.null;
            done();
          });
        });
      });
      describe('POST - test 400, invalid body to create an new order', function() {
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              this.tempCustomer = customer;
              done();
            })
            .catch(done);
        });

        it('Expect to show an 400 error', done => {
          request.post(`${url}/api/customer/${this.tempCustomer._id}/order`)
          //.set('Content-Type','application/json')
          .send('ddd')
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(err).to.be.not.null;
            done();
          });
        });
      });
    });

    describe('Testing PUT requests', function() {
      var tempOrder;
      describe('PUT - test 200, response body like {<data>} for a post request with a valid body', () => {
        before(done => {
          new Order(exampleOrder).save()
            .then(order => {
              tempOrder = order;
              done();
            })
            .catch(done);
        });

        it('Testing a PUT request made with a valid id', done => {
          request.put(`${url}/api/order/${tempOrder._id}`)
          .send({price:14000})
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(200);
            expect(res.body.price).to.equal(14000);
            done();
          });
        });
      });

      describe('PUT - test 400, responds with \'bad request\' for if no body provided or invalid body', () => {
        before(done => {
          new Order(exampleOrder).save()
            .then(order => {
              this.tempOrder = order;
              done();
            })
            .catch(done);
        });
        it('Testing a PUT request made with a no body', done => {
          request.put(`${url}/api/order/${this.tempOrder._id}`)
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
      describe('GET - test 204, Delete an Order with a valid order_id', function() {
        before(done => {
          new Customer(exampleCustomer).save()
            .then(customer => {
              this.tempCustomer = customer;
              return Customer.findByIdAndAddOrder(customer._id, exampleOrder);
            })
            .then(order => {
              this.tempOrder = order;
              done();
            })
            .catch(done);
        });

        it('Expect to return 204 for a valid order_Id', done => {
          request.delete(`${url}/api/order/${this.tempOrder._id}`)
          .end((err, res) => {
            if(err) done(err);
            expect(res.status).to.equal(204);
            expect(err).to.be.null;
            done();
          });
        });
      });
    });
  });
});
