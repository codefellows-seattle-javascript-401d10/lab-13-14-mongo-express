'use strict';

const PORT = process.env.PORT|| 3000;
process.env.MONGODB_URI = 'mongodb://localhost/fowltest';

const debug = require('debug');
const expect = require('chai').expect;
const request = require('superagent');
const Fowl = require('../model/fowl.js');

require('../server.js');

const url = `http://localhost:${PORT}`
const exampleFowl = {
  name: 'Jeff'
};

describe('testing route /api/note', function() {

  describe('testing POST requests', function() {

    describe('with valid body', function() {

      after( done=> {
        if(this.tempFowl) {
          Fowl.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
      });


      it('should return a fowl', done => {
        request.post(`${url}/api/fowl`)
        .send(exampleFowl)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Jeff');
          this.tempFowl = res.body;
          done();
        });
      })
    })
  })
  describe('testing GET requests', function() {

    describe('with valid body', function() {

      before( done => {
        new Fowl(exampleFowl).save()
        .then( fowl => {
          this.tempFowl = fowl;
          done();
        })
        .catch(done);
      })

      after( done=> {
        if(this.tempFowl) {
          Fowl.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
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
      })
    })
  })
})
