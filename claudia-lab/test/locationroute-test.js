'use strict';

const PORT = process.env.port || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/location-test'; //these are before you require server

const expect = require('chai').expect;
const request = require('superagent');
const Fruit = require('../model/fruit.js');
const Location = require('../model/location.js');

require('../server.js');

const url = `http://localhost:${PORT}`;

//create an example fruit for testing
const exampleLocation = {
  name: 'Florida',
  content: 'asdfasdf',
};

//create an example fruit list for testing
const exampleFruit = {
  name: 'apple',
  color: 'blue'
};

describe('testing location routes', function(){
//TESTING POST REQUESTS
///////////////////////////////////////////////////
  describe('testing POST requests', function(){
    describe('with valid location body and list id', function(){

      before (done => {
        new Fruit(exampleFruit).save()
        .then( fruit => {
          this.tempFruit = fruit;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all ([
          Fruit.remove({}),//removes all fruits
          Location.remove({}), //removes all locations
        ])
        .then(() => done())
        .catch(done);
      });

      //TESTING POST STATUS CODE 200 - OK
      it('should return a location', done => {
        request.post(`${url}/api/fruit/${this.tempFruit._id}/location`)
        .send(exampleLocation)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.body.name).to.equal(exampleLocation.name);
          expect(res.body.fruitID).to.equal(this.tempFruit._id.toString());
          done(); //done is called when async function is complete
        });
      }); //end it block

      //TESTING POST STATUS CODE 400 - BAD REQUEST
      it('should respond with 400 bad request', done => {
        request.post(`${url}/api/fruit/`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      }); //end it block
    });
  });

//TESTING GET REQUESTS
///////////////////////////////////////////////////
  describe('testing GET requests', function(){
    describe('with valid body and list id', function(){

      before (done => {
        new Fruit(exampleFruit).save() //promise, returns a whole fruit
        .then( fruit => { //fruit references whole fruit
          this.tempFruit = fruit;
          return Fruit.findByIdAndAddLocation(fruit._id, exampleLocation);
        })
        .then( location => {
          this.tempLocation = location;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all ([
          Fruit.remove({}),//removes all fruits
          Location.remove({}), //removes all locations
        ])
        .then(() => done())
        .catch(done);
      });

      // TESTING STATUS CODE 200 - OK
      it('should return a location', done => {
        request.get(`${url}/api/location/${this.tempLocation._id}`)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleLocation.name);
          expect(res.body.content).to.equal(exampleLocation.content);
          expect(res.body.fruitID).to.equal(this.tempFruit._id.toString());
          done();
        });
      }); //end it block

      //TESTING GET ERROR 404 - NOT FOUND
      it('should return not found', done => {
        request.get(`${url}/api/location/thisisarandomid`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block
    });
  });


//TESTING DELETE REQUESTS
///////////////////////////////////////////////////
  describe('testing DELETE requests', function(){
    describe('with valid id and no body', function(){
      //mock create a list before testing delete
      before (done => {
        new Fruit(exampleFruit).save() //promise, returns a whole fruit
        .then( fruit => { //fruit references whole fruit
          this.tempFruit = fruit;
          return Fruit.findByIdAndAddLocation(fruit._id, exampleLocation);
        })
        .then( location => {
          this.tempLocation = location;
          done();
        })
        .catch(done);
      });

      //TESTING DELETE STATUS CODE 204
      it('should respond with 204 successful deletions', done => {
        request.delete(`${url}/api/fruit/${this.tempFruit._id}/location/${this.tempLocation._id}`)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(204);
          done();
        });
      }); //end it block

      //TESTING DELETE ERROR CODE 404 - NOT FOUND
      it('should respond with 404 not found', done => {
        request.delete(`${url}/api/fruit/ilovechickennuggets/location/somuch`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block

    });
  });


//////////////////////////////////////
}); //end first describe block
