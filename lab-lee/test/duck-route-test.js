'use strict';

const PORT = process.env.PORT|| 3000;
process.env.MONGODB_URI = 'mongodb://localhost/ducktest';

const expect = require('chai').expect;
const request = require('superagent');
const Fowl = require('../model/fowl.js');
const Duck = require('../model/duck.js');
const debug = require('debug')('fowl:ducktest');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleDuck = {
  name: 'Jeff',
  color: 'blue',
  feathers: '15',
};

const exampleFowl = {
  name: 'Fowls1',
  timestamp: new Date(),
};


describe('testing duck routes', function() {

  describe('testing POST requests', function() {

    describe('with valid fowl id and duckBody', function() {

      before( done => {
        new Fowl(exampleFowl).save()
        .then( fowl => {
          this.tempFowl = fowl;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Fowl.remove({}),
          Duck.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return a duck', done => {
        request.post(`${url}/api/fowl/${this.tempFowl._id}/duck`)
        .send(exampleDuck)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleDuck.name);
          expect(res.body.fowlID).to.equal(this.tempFowl._id.toString());
          done();
        });
      });

      describe('testing POST requests with invalid body or no body provided', function() {

        before( done => {
          new Fowl(exampleFowl).save()
          .then( fowl => {
            this.tempFowl = fowl;
            done();
          })
          .catch(done);
        });

        after( done => {
          Promise.all([
            Fowl.remove({}),
          ])
          .then(() => done())
          .catch(done);
        });

        it('should return a 400 bad request', done => {

          request.post(`${url}/api/fowl/${this.tempFowl._id}/duck`)
          .send('notjson')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            debug('being hit');
            expect(res.status).to.equal(400);
            done();
          });
        });
      });
    });
  });

  describe('testing GET requests', function() {

    before( done => {
      exampleFowl.timestamp = new Date();
      new Fowl(exampleFowl).save()
      .then( fowl => {
        this.tempFowl = fowl;
        debug('tempFowl', this.tempFowl);
        return Fowl.findByIdAndAddDuck(fowl._id, exampleDuck);
      })
      .then( duck => {
        this.tempDuck = duck;
        done();
      })
      .catch(done);
    });

    after( done => {
      Promise.all([
        Fowl.remove({}),
        Duck.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });

    describe('with valid duck id', () => {


      it('should return a duck', done => {
        request.get(`${url}/api/duck/${this.tempDuck._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleDuck.name);
          expect(res.body.fowlID).to.equal(this.tempFowl._id.toString());
          done();
        });
      });

      describe('testing GET requests with invalid duck id', () => {

        it('should return a 404 not found', done => {
          request.get(`${url}/api/duck/noduck`)
          .end((err, res) => {
            debug('being hit', res.body);
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });

  describe('testing DELETE requests', function() {

    before( done => {
      exampleFowl.timestamp = new Date();
      new Fowl(exampleFowl).save()
      .then( fowl => {
        this.tempFowl = fowl;
        debug('tempFowl', this.tempFowl);
        return Fowl.findByIdAndAddDuck(fowl._id, exampleDuck);
      })
      .then( duck => {
        this.tempDuck = duck;
        done();
      })
      .catch(done);
    });

    describe('with valid duck id', () => {

      it('should delete a duck', done => {
        request.delete(`${url}/api/duck/${this.tempDuck._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });

      describe('testing DELETE requests with invalid duck id', () => {

        it('should return a 404 not found', done => {
          request.delete(`${url}/api/duck/noduck`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });

  describe('Testing PUT /api/duck:id requests', function() {

    before( done => {
      exampleFowl.timestamp = new Date();
      new Duck(exampleDuck).save()
      .then( duck => {
        this.tempDuck = duck;
        done();
      })
      .catch(done);
    });

    after( done => {
      if(this.tempDuck) {
        Duck.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
      done();
    });

    describe('with valid id', () => {

      it('should return a duck with a status 200', done => {
        let updateData = {name:'steve'};
        request.put(`${url}/api/duck/${this.tempDuck._id}`)
        .send(updateData)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('steve');
          done();
        });
      });
    });

    describe('with no body provided', () => {

      it('should return a 400 bad request', done => {
        request.put(`${url}/api/duck/${this.tempDuck._id}`)
        .set('Content-Type', 'application/json')
        .send('hello')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with an id that doesn\'t exist', function() {

      it('should 404 not found', done => {
        request.put(`${url}/api/fowl/nopeduck`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
