'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/dogtest';

const expect = require('chai').expect;
const request = require('superagent');
const Park = require('../model/park.js');
const Dog = require('../model/dog.js');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleDog = {
  name: 'barney',
  color: 'brown',
};

const examplePark = {
  name: 'magnuson',
  timestamp: new Date(),
};

describe('testing dog routes', function(){
  describe('testing POST requests', function(){
    describe('with valid park id and dogBody', () => {
      before(done => {
        new Park(examplePark).save()
        .then( park => {
          this.tempPark = park;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Park.remove({}),
          Dog.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a dog', done => {
        request.post(`${url}/api/park/${this.tempPark._id}/dog`)
        .send(exampleDog)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleDog.name);
          expect(res.body.parkID).to.equal(this.tempPark._id.toString());
          done();
        });
      });
    }); //end of describe ('with valid body')

    describe('with an invalid body', () => {
      it('should return a 400 status', done => {

        request.post(`${url}/api/park/${this.tempPark._id}/dog`)
        .set('Content-Type', 'application/json')
        .send('bad json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('testing DELETE requests', function(){
    describe('with a valid id', function() {

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
          console.log('this.tempDog.id in before block of delete test', this.tempDog.id);
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

      it('should delete a dog', done => {
        request.delete(`${url}/api/dog/${this.tempDog._id}`)
        .end((err,res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    it('should return a 404 status', done => {
      request.delete(`${url}/api/dog/1234`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

  }); //end of DELETE tests

//GET tests
  describe('testing GET requests', function() {
    describe('with a valid dog id', function(){

      before(done => {
        new Dog(exampleDog).save()
        .then(dog => {
          this.tempDog = dog;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Dog.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a dog', done => {
        request.get(`${url}/api/park/dog/${this.tempDog.id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });

    });//end of describe 'with valid dog id'

    describe('with an invalid dog id', function(){
      it('should return a status of 404', done => {
        request.get(`${url}/api/park/dog/123`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

  }); //end of GET tests

}); //end of all tests
