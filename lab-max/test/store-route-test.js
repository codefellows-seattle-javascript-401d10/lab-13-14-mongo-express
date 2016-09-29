'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/storetest';

const expect = require('chai').expect;
const request = require('superagent');
const Store = require('../model/store.js');

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleStore = {
  name: 'nike',
  year: 1964,
  storeType: 'sporting goods',
};

describe('testing route /api/store', function(){

  describe('testing invalid route', function(){
    it('should respond with a 404 error for route not found', done => {
      request.get(`${url}/api/cats`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('tesing GET requests', function(){

    describe('with valid body', function(){

      before( done => {
        exampleStore.timestamp = new Date();
        new Store(exampleStore).save()
        .then( store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempStore){
          Store.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a store', done => {
        request.get(`${url}/api/store/${this.tempStore._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('nike');
          expect(res.body.year).to.equal(1964);
          expect(res.body.storeType).to.equal('sporting goods');
          done();
        });
      });
    });

    describe('with invalid body', function(){
      it('should return a 404 error for id not found', done => {
        request.get(`${url}/api/store/_1111`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('testing POST requests', function(){

    describe('testing with valid body', function(){

      after(done => {
        if(this.tempStore){
          Store.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a store', done => {
        request.post(`${url}/api/store`)
        .send(exampleStore)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('nike');
          expect(res.body.year).to.equal(1964);
          expect(res.body.storeType).to.equal('sporting goods');
          this.tempStore = res.body;
          done();
        });
      });
    });

    describe('testing with an invalid body', function(){

      after(done => {
        if(this.tempStore){
          Store.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should respond with a 400 error for bad request', done => {
        request.post(`${url}/api/store`)
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('testing PUT requests', function(){

    describe('testing valid PUT request', function(){

      before( done => {
        exampleStore.timestamp = new Date();
        new Store(exampleStore).save()
        .then( store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempStore){
          Store.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a store', done => {
        let updateStore = {
          name: 'shoe',
          year: 1111,
          storeType: 'clothing',
        };
        request.put(`${url}/api/store/${this.tempStore._id}`)
        .send(updateStore)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(updateStore.name);
          expect(res.body.year).to.equal(updateStore.year);
          expect(res.body.storeType).to.equal(updateStore.storeType);
          this.tempStore = res.body;
          done();
        });
      });
    });

    describe('testing invalid PUT request with invalid body', function(){

      before( done => {
        exampleStore.timestamp = new Date();
        new Store(exampleStore).save()
        .then( store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempStore){
          Store.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should respond with a 400 error for bad request', done => {
        request.put(`${url}/api/store/${this.tempStore.id}`)
        .set('Content-Type', 'application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('testing invalid PUT request with invalid id', function(){
      it('should return a 404 error for id not found', done => {
        request.put(`${url}/api/store/_11111`)
        .send(exampleStore)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('testing DELETE requests', function(){

    describe('testing valid DELETE', function(){

      before( done => {
        exampleStore.timestamp = new Date();
        new Store(exampleStore).save()
        .then( store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      it('should delete a document and return a 204 status code', done => {
        request.delete(`${url}/api/store/${this.tempStore._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    describe('testing an invalid DELETE for id not found', function() {
      it('should return a 404 status code', done => {
        request.delete(`${url}/api/store/_12345`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
