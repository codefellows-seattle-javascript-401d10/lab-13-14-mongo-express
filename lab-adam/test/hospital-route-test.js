'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/citytest';

const expect = require('chai').expect;
const request = require('superagent');
const City = require('../model/city.js');
const Hospital = require('../model/hospital.js');
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleCity = {
  name: 'FakeCity',
  population: 123000,
  lat: 50,
  lng: 50,
  rating: 8,
  timestamp: new Date(),
};

const exampleHospital = {
  name: 'FakeHospital',
  specialties: 'Derm',
  programRank: 7,
};

const updatedHospital = {
  name: 'UpdatedHospital',
  specialties: 'Internal Medicine',
  programRank: 3,
};

describe('testing hospital routes', function(){
  describe('testing POST requests', function(){
    describe('with valid city id and hospital body', () => {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          done();
        })
        .catch(done);
      });
      after(done => {
        Promise.all([
          City.remove(),
          Hospital.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a hospital', done => {
        request.post(`${url}/api/city/${this.tempCity.id}/hospital`)
        .send(exampleHospital)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(exampleHospital.name);
          expect(res.body.cityID).to.equal(this.tempCity._id.toString());
          done();
        });
      });
    });
  });
  describe('testing GET requests', function(){
    describe('with valid city and hospital ID', () => {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          exampleHospital.cityID = this.tempCity._id;
          return City.findByIdAndAddHospital(this.tempCity._id, exampleHospital);
        })
        .then(hospital => {
          this.tempHospital = hospital;
          done();
        })
        .catch(done);
      });
      after(done => {
        Promise.all([
          City.remove(),
          Hospital.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a hospital', done => {
        request.get(`${url}/api/city/${this.tempCity._id}/hospital/${this.tempHospital._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(exampleHospital.name);
          expect(res.body.cityID).to.equal(this.tempCity._id.toString());
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
    describe('with invalid ID', function() {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          exampleHospital.cityID = this.tempCity._id;
          return City.findByIdAndAddHospital(this.tempCity._id, exampleHospital);
        })
        .then(hospital => {
          this.tempHospital = hospital;
          done();
        })
        .catch(done);
      });
      it('should return a 404', done => {
        request.get(`${url}/api/city/${this.tempCity._id}/hospital/1231231231231`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('testing PUT requests', function(){
    describe('with valid city and hospital ID', () => {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          exampleHospital.cityID = this.tempCity._id;
          return City.findByIdAndAddHospital(this.tempCity._id, exampleHospital);
        })
        .then(hospital => {
          this.tempHospital = hospital;
          done();
        })
        .catch(done);
      });
      after(done => {
        Promise.all([
          City.remove(),
          Hospital.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a hospital', done => {
        request.put(`${url}/api/city/${this.tempCity._id}/hospital/${this.tempHospital._id}`)
        .send(updatedHospital)
        .end((err, res) => {
          if(err) return done(err);
          for (var i  in updatedHospital) {
            expect(res.body[i]).to.equal(updatedHospital[i]);
          }
          expect(res.body.cityID).to.equal(this.tempCity._id.toString());
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
    describe('with invalid or no body', function() {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          exampleHospital.cityID = this.tempCity._id;
          return City.findByIdAndAddHospital(this.tempCity._id, exampleHospital);
        })
        .then(hospital => {
          this.tempHospital = hospital;
          done();
        })
        .catch(done);
      });
      after(done => {
        Promise.all([
          City.remove(),
          Hospital.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });
      it('should respond with bad request & 400 error', done => {
        request.put(`${url}/api/city/${this.tempCity._id}/hospital/${this.tempHospital._id}`)
        .set('Content-Type','application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with invalid ID', function() {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          exampleHospital.cityID = this.tempCity._id;
          return City.findByIdAndAddHospital(this.tempCity._id, exampleHospital);
        })
        .then(hospital => {
          this.tempHospital = hospital;
          done();
        })
        .catch(done);
      });
      after(done => {
        Promise.all([
          City.remove(),
          Hospital.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a 404', done => {
        request.put(`${url}/api/city/${this.tempCity._id}/hospital/FAKEID`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('testing DELETE requests', function(){
    describe('with valid city and hospital ID', () => {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          exampleHospital.cityID = this.tempCity._id;
          return City.findByIdAndAddHospital(city._id, exampleHospital);
        })
        .then(hospital => {
          this.tempHospital = hospital;
          request.get(`${url}/api/city/${this.tempCity._id}`)
          .end((err, res) => {
            this.origNum = res.body.hospitals.length;
            done();
          });
        })
        .catch(done);
      });
      after(done => {
        Promise.all([
          City.remove(),
          Hospital.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });
      it('should return a 204', done => {
        request.delete(`${url}/api/city/${this.tempCity._id}/hospital/${this.tempHospital._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          request.get(`${url}/api/city/${this.tempCity._id}`)
          .end((err, res) => {
            expect(res.body.hospitals.length).to.equal(this.origNum - 1);
            done();
          });
        });
      });
    });
    describe('with invalid ID', function() {
      before(done => {
        new City(exampleCity).save()
        .then(city => {
          this.tempCity = city;
          exampleHospital.cityID = this.tempCity._id;
          City.findByIdAndAddHospital(this.tempCity._id, exampleHospital);
          done();
        })
        .catch(done);
      });
      it('should return a 404', done => {
        request.delete(`${url}/api/city/${this.tempCity._id}/hospital/INVALIDID`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
