'use strict';

const PORT = process.env.PORT|| 3000;
process.env.MONGODB_URI = 'mongodb://localhost/fowltest';

const expect = require('chai').expect;
const request = require('superagent');
const Fowl = require('../model/fowl.js');
const debug = require('debug')('fowl:test');

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleFowl = {
  name: 'Jeff',
};

describe('testing route /api/note', function() {

  describe('testing POST /api/duck requests', function() {

    describe('with valid body', function() {

      after( done => {
        if(this.tempFowl) {
          Fowl.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
      });

      it('should return a fowl and status 200', done => {
        request.post(`${url}/api/fowl`)
        .send(exampleFowl)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Jeff');
          this.tempFowl = res.body;
          done();
        });
      });
    });

    describe('with an invalid body', function() {

      it('should return 400 bad request', done => {
        request.post(`${url}/api/fowl`)
        .send({name: ''})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('testing GET requests', function() {

    describe('with valid body', function() {

      before( done => {
        exampleFowl.timestamp = new Date();
        new Fowl(exampleFowl).save()
        .then( fowl => {
          this.tempFowl = fowl;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleFowl.timestamp;
        if(this.tempFowl) {
          Fowl.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a fowl', done => {
        request.get(`${url}/api/fowl/${this.tempFowl._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Jeff');
          this.tempFowl = res.body;
          done();
        });
      });
    });

    describe('with a file that doesn\'t exist', function() {

      it('should give a 404 id not found', done => {
        request.get(`${url}/api/fowl/nope-duck`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('Testing PUT /api/fowl:id requests', function() {

    describe('with valid id', function() {

      before( done => {
        exampleFowl.timestamp = new Date();
        new Fowl(exampleFowl).save()
        .then( fowl => {
          this.tempFowl = fowl;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleFowl.timestamp;
        if(this.tempFowl) {
          Fowl.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a fowl with a status 200', done => {
        let updateData = {name:'steve'};
        request.put(`${url}/api/fowl/${this.tempFowl._id}`)
        .send(updateData)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('steve');
          this.tempFowl = res.body;
          done();
        });
      });
    });

    describe('with no body provided', function() {

      before( done => {
        exampleFowl.timestamp = new Date();
        new Fowl(exampleFowl).save()
        .then( fowl => {
          this.tempFowl = fowl;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleFowl.timestamp;
        if(this.tempFowl) {
          Fowl.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return a 400 bad request', done => {
        request.put(`${url}/api/fowl/${this.tempFowl._id}`)
        .set('Content-Type', 'application/json')
        .send('hello')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with a body that doesn\'t exist', function() {

      it('should 404 not found', done => {
        request.put(`${url}/api/fowl/nope-duck`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('Testing DELETE /api/fowl:id requests', function() {

    describe('with valid id', function() {

      before( done => {
        exampleFowl.timestamp = new Date();
        new Fowl(exampleFowl).save()
        .then( fowl => {
          this.tempFowl = fowl;
          done();
        })
        .catch(done);
      });

      it('should delete a fowl with a status 204', done => {
        request.delete(`${url}/api/fowl/${this.tempFowl._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    describe('with an id that doesn\'t exist', function() {

      it('should 404 not found', done => {
        request.delete(`${url}/api/fowl/nope-duck`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('Testing GET with api/fowl to return the db', function() {

    before( done => {
      exampleFowl.timestamp = new Date();
      new Fowl(exampleFowl).save()
      .then( fowl => {
        this.tempFowl = fowl;
      })
      .then( fowl => {
        new Fowl(exampleFowl).save();
        this.tempFowl2 = fowl;
        done();
      })
      .catch(done);
    });

    after( done => {
      delete exampleFowl.timestamp;
      if(this.tempFowl) {
        Fowl.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
      done();
    });

    it('should return an array with status 200.', done => {
      request.get(`${url}/api/fowl`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(2);
        this.tempFowl = res.body;
        done();
      });
    });
  });
});
