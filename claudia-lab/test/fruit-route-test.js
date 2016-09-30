'use strict';

const PORT = process.env.port || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/fruit-test'; //these are before you require server

const debug = require('debug')('fruit:server');
const expect = require('chai').expect;
const request = require('superagent');
const Fruit = require('../model/fruit.js');
//const Location = require('../model/location.js');
//const Fruit = require('../model/fruit.js');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleLocation = {
  name: 'Florida',
  content: 'asdfasdf',
};

const exampleFruit = {
  name: 'apple',
  color: 'blue',
};

describe('testing route/api/fruit', function(){
//TESTING POST REQUESTS
///////////////////////////////////////////////////
  describe('testing POST requests', function(){
    describe('with valid body', function(){
      after( done => {
        if(this.tempFruit){
          Fruit.remove({}) //removes all lists!
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      //TESTING POST STATUS CODE 200 - OK
      it('should return a fruit', done => {
        request.post(`${url}/api/fruit`)
        .send(exampleFruit)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('apple');
          this.tempFruit = res.body;
          done(); //done is called when async function is complete
        });
      }); //end it block

      //TESTING POST ERROR 400 - BAD REQUEST
      it('should respond with 400 bad request', done => {
        request.post(`${url}/api/fruit`)
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
        new Fruit(exampleFruit).save()
        .then( fruit => {
          this.tempFruit = fruit;
          return Fruit.findByIdAndAddLocation(fruit._id, exampleLocation);
        })
        .then (location => {
          this.tempLocation = location;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempFruit){
          Fruit.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      //TESTING GET STATUS 200 - OK
      it('should return a fruit', done => {
        debug('hitting fruit get route');
        request.get(`${url}/api/fruit/${this.tempFruit._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('apple');
          expect(res.body.locations.length).to.equal(1);
          expect(res.body.locations[0].name).to.equal(exampleLocation.name);
          //testing to see if the list has been populated with fruits
          done();
        });
      });//end it block

      //TESTING GET ERROR 404 - NOT FOUND
      it('should return not found', done => {
        request.get(`${url}/api/fruit/18203491238042380412`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block

    });
  });

// TESTING GET REQUESTS WITH PAGEnATION
////////////////////////////////////////////////////
  describe('testing GET requests with pagenation', function(){
    describe('with valid query', function(){
      console.log('exampleFruit', exampleFruit);
      before( done => {
        var fruits = [];
        for (var i = 0; i<1000; i++){
          fruits.push(new Fruit(exampleFruit).save());
        }

        Promise.all(fruits) //takes all lists and waits for them to complete
        .then( fruits => {
          this.tempFruits = fruits;
          done();
        })
      .catch(done);
      });

      after( done => {
        if(this.tempFruits){
          Fruit.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      //TESTING GET STATUS 200 - OK
      it('should return 50 fruits', done => {
        request.get(`${url}/api/fruit`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(50);
          done();
        });
      });//end it block

      //TESTING GET ERROR 404 - NOT FOUND
      it('should return not found', done => {
        request.get(`${url}/api/fruit/?pagesize=100`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(100);
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
        new Fruit(exampleFruit).save()
        .then( fruit => {
          this.tempFruit = fruit;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempFruit){
          Fruit.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      //TESTING PUT STATUS CODE 200 - OK
      it('should return an updated fruit', done => {
        request.put(`${url}/api/fruit/${this.tempFruit._id}`)
        .send({name: 'asdf'})
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('asdf');
          this.tempFruit = res.body;
      //    console.log(res.body);
          done();
        });
      }); //end it block

      //TESTING PUT ERROR CODE 404 - NOT FOUND
      it('should respond with 404 not found', done => {
        request.put(`${url}/api/fruit/hailsatan`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block

      //TESTING PUT ERROR CODE 400 - BAD REQUEST
      it('should respond with 400 bad request', done => {
        request.put(`${url}/api/fruit/${this.tempFruit._id}`)
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
        new Fruit(exampleFruit).save()
        .then( fruit => {
          this.tempFruit = fruit;
          done();
        })
        .catch(done);
      });

      //TESTING DELETE STATUS CODE 204 - OK
      it('should respond with 204 successful deletions', done => {
        request.delete(`${url}/api/fruit/${this.tempFruit._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      }); //end it block

      //TESTING DELETE ERROR CODE 404 - NOT FOUND
      it('should respond with 404 not found', done => {
        request.delete(`${url}/api/fruit/ilovechickennuggets`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      }); //end it block

    });
  });

/////////////////////////////////////////////
}); //end testing route/api/fruit
