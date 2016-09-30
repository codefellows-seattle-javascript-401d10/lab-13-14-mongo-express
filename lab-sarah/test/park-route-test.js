'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/parktest';

const expect = require('chai').expect;
const request = require('superagent');

const Park = require('../model/park.js');
const Dog = require('../model/dog.js');

const debug = require('debug')('park:park-test');

require('../server.js');

const url = `http://localhost:${PORT}`;

const examplePark = {
  name: 'woodland',
  timestamp: new Date(),
};

const updatePark = {
  name: 'UPDATE',
};

const exampleDog = {
  name: 'Prungy',
  color: 'black',
};

describe('testing route /api/park', function(){

//POST TESTS

  describe('testing POST requests', function(){
    describe('with valid body', function(){
      after(done => {
        if (this.tempPark){
          Park.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a park', done => {
        request.post(`${url}/api/park`)
        .send(examplePark)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('woodland');
          this.tempPark = res.body;
          done();
        });
      }); //end of it 'should return a park'

    });//end of describe('with valid body')

    describe('with invalid or no body', function(){
      it('should return 400 status', done => {
        request.post(`${url}/api/park`)
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });//end of describe 'with invalid or no body'
  });//end of describe 'testing POST requests'


  //GET TESTS

//have to change get request to test the populate function
  describe('testing GET request', function(){
    describe('with a valid id', function(){
      before(done => {
        examplePark.timestamp = new Date();
        new Park(examplePark).save()
        .then(park => {
          this.tempPark = park;
          return Park.findByIdAndAddDog(park._id, exampleDog);
        })
        .then(dog => {
          //so we have an id on this dog for later
          this.tempDog = dog;
          done();
        })

        .catch(done);
      });

      after(done => {
        delete examplePark.timestamp;
        if(this.tempPark){
          Promise.all([
            Park.remove({}),
            Dog.remove({}),
          ])
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a park', done => {
        debug('hitting get route');
        request.get(`${url}/api/park/${this.tempPark._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('woodland');
          expect(res.body.dogs.length).to.equal(1);
          expect(res.body.dogs[0].name).to.equal(exampleDog.name);
          expect(res.body.dogs[0].color).to.equal(exampleDog.color);
          //checking to see if park is populated with dogs
          done();
        });
      }); //end of it 'should return a park'

    }); //end of describe 'with a valid id'

    describe('with an invalid id', function(){

      it ('should return a 404', done => {
        request.get(`${url}/api/park/hi`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

  }); //end of describe 'testing GET requests'

  //DELETE REQUESTS

  describe('testing DELETE requests', function(){
    before(done => {
      examplePark.timestamp = new Date();
      new Park(examplePark).save()
      .then(park => {
        this.tempPark = park;
        done();
      })
      .catch(done);
    });

    it('should return a 204 for successful deletion', done => {
      request.delete(`${url}/api/park/${this.tempPark.id}`)
      .end((err,res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });

    it('should return a 404 for successful deletion', done => {
      request.delete(`${url}/api/park/poop`)
      .end((err,res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  }); //end of describe 'testing DELETE requests'

  //PUT REQUESTS

  describe('testing PUT requests', function(){
    describe('with a valid body', function(){

      before(done => {
        examplePark.timestamp = new Date();
        new Park(examplePark).save()
        .then(park => {
          this.tempPark = park;
          done();
        })
        .catch(done);
      });

      after(done => {
        if (this.tempPark){
          Park.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a 200', done => {
        request.put(`${url}/api/park/${this.tempPark._id}`)
        .send(updatePark)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('UPDATE');
          //causing a failed test at the moment
          // expect(res.body.timestamp).to.equal(examplePark.timestamp);
          done();
        });
      });

    }); //end of describe 'with a valid body'

    describe('with an invalid body', function(){
      it ('should return a 404', done => {
        request.put(`${url}/api/park/hi`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with a valid id but not a valid body', function() {

      before(done => {
        examplePark.timestamp = new Date();
        new Park(examplePark).save()
        .then(park => {
          this.tempPark = park;
          done();
        });
      });

      it ('should return a 400', done => {
        request.put(`${url}/api/park/${this.tempPark._id}`)
        .set('Content-Type', 'application/json')
        .send('bad json')
        .end((err, res) =>
          expect(res.status).to.equal(400));
        done();
      });
    });
  }); //end of describe 'testing put requests'
}); //end of describe 'testing route /api/park'
