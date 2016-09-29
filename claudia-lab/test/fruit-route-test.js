'use strict';

const PORT = process.env.port || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/fruit-test'; //these are before you require server

const expect = require('chai').expect;
const request = require('superagent');
const FruitList = require('../model/fruitlist.js');
require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleFruitList = { 
  name: 'goose',
  color: 'blue'
};

describe('testing route/api/fruitlist', function(){
//TESTING POST REQUESTS
///////////////////////////////////////////////////
  describe('testing POST requests', function(){
    describe('with valid body', function(){

      after( done => {
        if(this.tempFruitList){
          FruitList.remove({}) //removes all lists!
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      //TESTING POST STATUS CODE 200 - OK
      it('should return a fruitslist', done => {
        request.post(`${url}/api/fruitlist`)
        .send(exampleFruitList)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('goose');
          this.tempFruitList = res.body;
          done();
        });
      }); //end it block

      //TESTING POST ERROR 400 - BAD REQUEST
      it('should respond with 400 bad request', done => {
        request.post(`${url}/api/fruitlist`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      }); //end it block

    }); //end describe with valid body
  }); //end testing POST requests

// TESTING GET REQUESTS
////////////////////////////////////////////////////
  describe('testing GET requests', function(){
    describe('with valid body', function(){
      before( done => {
        new FruitList(exampleFruitList).save()
        .then( fruitlist => {
          this.tempFruitList = fruitlist;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempList){
          FruitList.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      //TESTING GET STATUS 200 - OK
      it('should return a fruitlist', done => {
        request.get(`${url}/api/fruitlist/${this.tempFruitList._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('goose');
          done();
        });
      });//end it block

      //TESTING GET ERROR 404 - NOT FOUND
      it('should return not found', done => {
        request.get(`${url}/api/fruitlist/18203491238042380412`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block

    });
  });
//TESTING PUT REQUESTS
////////////////////////////////////////////////////
  describe('testing PUT requests', function(){
    describe('with valid body', function(){
      before( done => {
        new FruitList(exampleFruitList).save()
        .then( fruitlist => {
          this.tempFruitList = fruitlist;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempList){
          FruitList.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      //TESTING PUT STATUS CODE 200 - OK
      it('should return an updated fruitlist', done => {
        request.put(`${url}/api/fruitlist/${this.tempFruitList._id}`)
        .send({name: 'asdf'})
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('asdf');
          this.tempFruitList = res.body;
      //    console.log(res.body);
          done();
        });
      }); //end it block

      //TESTING PUT ERROR CODE 404 - NOT FOUND
      it('should respond with 404 not found', done => {
        request.put(`${url}/api/fruitlist/hailsatan`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block

      //TESTING PUT ERROR CODE 400 - BAD REQUEST
      it('should respond with 400 bad request', done => {
        request.put(`${url}/api/fruitlist/${this.tempFruitList._id}`)
        .set('Content-Type', 'application/json')
        .send('asdfasdf')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      }); //end it block

    });
  });

  //TESTING DELETE REQUESTS
  ////////////////////////////////////////////////////
  describe('testing DELETE requests', function(){
    describe('with valid id and no body', function(){
      before( done => {
        new FruitList(exampleFruitList).save()
        .then( fruitlist => {
          this.tempFruitList = fruitlist;
          done();
        })
        .catch(done);
      });

      //TESTING DELETE STATUS CODE 204 - OK
      it('should respond with 204 successful deletions', done => {
        request.delete(`${url}/api/fruitlist/${this.tempFruitList._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      }); //end it block

      //TESTING DELETE ERROR CODE 404 - NOT FOUND
      it('should respond with 404 not found', done => {
        request.delete(`${url}/api/fruitlist/ilovechickennuggets`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block

    });
  });

/////////////////////////////////////////////
}); //end testing route/api/fruitlist
