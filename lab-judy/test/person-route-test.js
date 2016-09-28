'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/persontest';

const expect = require('chai').expect;
const request = require('superagent');
const List = require('../model/list.js');
const debug = require('debug')('person test:');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleList = {
  name: 'judy',
  age: 11
};

describe('testing route /api/list', function(){

  //POST 200
  describe('testing POST request 200', function(){
    describe('with valid body', function(){
      after( done => {
        if(this.tempList){
          List.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a list with status 200', done => {
        request.post(`${url}/api/list`)
        .send(exampleList)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('judy');
          this.tempList = res.body;
          done();
        });
      });
    });
  });
  //GET request 200
  describe('testing GET request 200', function(){
    describe('with valid id', function(){
      before( done => {
        exampleList.timestamp = new Date();
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });
      after( done => {
        delete exampleList.timestamp;
        if(this.tempList){
          List.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it ('should return a list with status 200', done => {
        debug('running it block for GET request with 200 status');
        request.get(`${url}/api/list/${this.tempList._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('judy');
          done();
        });
      });
    });
  });

  //PUT test 200
  describe('testing PUT request 200', function(){
    describe('with valid body', function(){
      before( done => {
        exampleList.timestamp = new Date();
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });
      after( done => {
        delete exampleList.timestamp;
        if(this.tempList){
          List.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should update the data with 200 status', done => {
        debug('running it block for PUT request with 200 status');
        var updatedData = {name: 'Jen', age: 12};
        request.put(`${url}/api/list/${this.tempList._id}`)
        .send(updatedData)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(this.tempList._id.toString());
          for (var key in updatedData){
            expect(res.body[key]).to.equal(updatedData[key]);
          }
          done();
        });
      });
    });
  });

  //DELETE request 204
  describe('testing DELETE request', function(){
    describe('with valid ID', function(){
      before( done => {
        exampleList.timestamp = new Date();
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });
      after( done => {
        delete exampleList.timestamp;
        if(this.tempList){
          List.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should delete item and return status 204', done => {
        debug('running it block for DELETE request with 204 status');
        request.delete(`${url}/api/list/${this.tempList._id}`)
        .end( (err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(204);
          for (var key in res.body){
            expect(!res.body[key]);
          }
          done();
        });
      });

    });
  });
  //GET test 404
  describe('testing GET request for status 404', function(){
    describe('invalid id', function(){
      before( done => {
        exampleList.timestamp = new Date();
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });
      after( done => {
        delete exampleList.timestamp;
        if(this.tempList){
          List.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return status 404 for invalid request', done => {
        request.get(`${url}/api/list/badid#`)
        .end( (err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  //PUT test 400 - no body provided
  describe('testing PUT request for status 400', function(){
    describe('with no body provided', function(){
      before( done => {
        exampleList.timestamp = new Date();
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });
      after( done => {
        delete exampleList.timestamp;
        if(this.tempList){
          List.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return status 400 for no body provided', done => {
        request.put(`${url}/api/list/${this.tempList._id}`)
        .set('Content-Type','application/json')
        .send('invalid body')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  //PUT test 404 - valid request, but id not found
  describe('testing PUT request for status 404', function(){
    describe('valid request with ID not found', function(){
      before( done => {
        exampleList.timestamp = new Date();
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });
      after( done => {
        delete exampleList.timestamp;
        if(this.tempList){
          List.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return status 404', done => {
        var updatedData = {name: 'fake', age: 4};
        request.put(`${url}/api/list/badid#`)
      .send(updatedData)
      .end((err, res) =>{
        expect(res.status).to.equal(404);
        done();
      });
      });
    });
  });

  //POST test 400 bad request if no body provided
  describe('testing POST for status 400', function(){
    describe('with no body provided', function(){
      it('should return status 400', done => {
        request.post(`${url}/api/list`)
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  //DELETE test 404 for valid request with no id
  describe('testing DELETE for status 404', function(){
    describe('with no id provided', function(){
      it('should return status 404', done =>{
        request.delete(`${url}/api/list/badid#`)
        .end( (err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
