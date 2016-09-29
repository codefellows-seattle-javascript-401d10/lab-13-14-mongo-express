'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/customertest';

const expect = require('chai').expect;
const request = require('superagent');

const Order = require('../model/order.js');
const Customer = require('../model/customer.js');

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
              console.log('customer ---------------->', customer);
              this.tempCustomer = customer;
              return Customer.findByIdAndAddOrder(customer._id, exampleOrder);
            })
            .then(order => {
              console.log('Order ------------------>', order);
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
            done();
          });
        });
      });
    });
  });
});
