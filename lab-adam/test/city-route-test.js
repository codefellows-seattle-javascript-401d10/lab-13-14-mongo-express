'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/citytest';

const expect = require('chai').expect;
const request = require('superagent');
const City = require('../model/city.js');
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleCity = {
  name: 'FakeCity',
  population: 123000,
  lat: 50,
  lng: 50,
  rating: 8,
};

const updateCity = {
  name: 'UpdatedCity',
  population: 100000,
  lat: 30,
  lng: 30,
  rating: 4,
};

const exampleHospital = {
  name: 'FakeHospital',
  specialties: 'Derm',
  programRank: 7,
};

describe('testing unregistered routes', function() {
  it('should return a 404', done => {
    request.get(`${url}/api/FAKENESS`)
    .end((err, res) => {
      expect(res.status).to.equal(404);
      done();
    });
  });
});

describe('testing route /api/city', function(){
  describe('testing GET requests', function(){
    describe('with valid ID', function(){
      before(done => {
        exampleCity.timestamp = new Date();
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          return City.findByIdAndAddHospital(city._id, exampleHospital);
        })
        .then(hospital => {
          this.tempHospital = hospital;
          done();
        })
        .catch(done);
      });
      after(done => {
        if(this.tempCity){
          City.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a city', done => {
        request.get(`${url}/api/city/${this.tempCity.id}`)
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          for (var i in exampleCity) {
            if (i === 'id') continue;
            expect(res.body.i).to.equal(exampleCity.i);
          }
          expect(res.body.hospitals.length).to.equal(1);
          expect(res.body.hospitals[0].name).to.equal('FakeHospital');
          this.tempCity = res.body;
          done();
        });
      });
    });
    describe('with invalid ID', function() {
      it('should return a 404', done => {
        request.get(`${url}/api/city/1234512312`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('GET with no ID to /api/city/ and pagination', function(){
      before(done => {
        var i = 0;
        function createObjects(){
          exampleCity.timestamp = new Date();
          i++;
          if(i >= 300) return;
          new City(exampleCity).save()
          .then(createObjects(i));
        }
        createObjects();
        done();
      });
      after(done => {
        delete exampleCity.timestamp;
        if(this.tempCity){
          City.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return 50 cities', done => {
        request.get(`${url}/api/city`)
        .end((err, res) => {
          // expect(res.body).to.be.instanceOf(Array);
          expect(res.body).to.be.length(50);
          done();
        });
      });
      it('should return 100 cities', done => {
        request.get(`${url}/api/city?pagesize=100`)
        .end((err, res) => {
          // expect(res.body).to.be.instanceOf(Array);
          expect(res.body).to.be.length(100);
          done();
        });
      });
    });
  });
  describe('testing PUT requests', function(){
    describe('with valid body', function(){
      before(done => {
        exampleCity.timestamp = new Date();
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          done();
        })
        .catch(done);
      });
      after(done => {
        delete exampleCity.timestamp;
        if(this.tempCity){
          City.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return an updated city object', done => {
        request.put(`${url}/api/city/${this.tempCity.id}`)
        .send(updateCity)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          for (var i in updateCity) {
            if (i !== '_id') expect(res.body[i]).to.equal(updateCity[i]);
          }
          this.tempCity = res.body;
          done();
        });
      });
    });
    describe('with invalid or no body', function() {
      before(done => {
        exampleCity.timestamp = new Date();
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          done();
        })
        .catch(done);
      });
      after(done => {
        delete exampleCity.timestamp;
        if(this.tempCity){
          City.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should respond with bad request & 400 error', done => {
        request.put(`${url}/api/city/${this.tempCity.id}`)
        .set('Content-Type','application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with invalid ID', function() {
      it('should return a 404', done => {
        request.put(`${url}/api/city/1234512312`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('testing POST requests', function(){
    describe('with valid body', function(){
      after(done => {
        if(this.tempCity){
          City.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a city', done => {
        request.post(`${url}/api/city`)
        .send(exampleCity)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          for (var i in exampleCity) {
            if (i === 'id') continue;
            expect(res.body.i).to.equal(exampleCity.i);
          }
          this.tempCity = res.body;
          done();
        });
      });
    });
    describe('with invalid or no body', function(){
      after(done => {
        if(this.tempCity){
          City.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a 400 error', done => {
        request.post(`${url}/api/city`)
        .send({population:'not a Number'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
  describe('testing DELETE requests', function(){
    describe('with valid body', function(){
      before(done => {
        exampleCity.timestamp = new Date();
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          done();
        })
        .catch(done);
      });
      after(done => {
        delete exampleCity.timestamp;
        if(this.tempCity){
          City.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a 204 with no body', done => {
        request.delete(`${url}/api/city/${this.tempCity.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          this.tempCity = res.body;
          done();
        });
      });
    });
    describe('with invalid ID', function() {
      it('should return a 404', done => {
        request.delete(`${url}/api/city/1234512312`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
