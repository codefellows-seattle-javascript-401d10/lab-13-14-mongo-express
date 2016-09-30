'use strict';

const PORT = process.env.PORT|| 3000;
process.env.MONGODB_URI = 'mongodb://localhost/fowltest';

const expect = require('chai').expect;
const request = require('superagent');
const Fowl = require('../model/fowl.js');

const exampleFowl = {
  name: 'Jeff',
};
const url = `http://localhost:${PORT}`;

require('../server.js');

describe('testing route /api/fowl', function() {

  describe('testing POST /api/fowl requests', function() {

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
        request.get(`${url}/api/fowl/nope-fowl`)
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
          let timestamp = new Date(res.body.timestamp);
          expect(timestamp.toString()).to.equal(exampleFowl.timestamp.toString());
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
        request.put(`${url}/api/fowl/nope-fowl`)
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
        request.delete(`${url}/api/fowl/nope-fowl`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('Testing GET request with pageination', function(){

    describe('with a valid query', function() {

      before( done => {
        var fowls = [];
        for (var i = 0; i < 1000; i++) {
          exampleFowl.timestamp = new Date();
          fowls.push(new Fowl(exampleFowl).save());
        }
        Promise.all(fowls)
        .then( fowls => {
          this.tempFowls = fowls;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleFowl.timestamp;
        if(this.tempFowls) {
          Fowl.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('should return 50 fowls at page 0.', done => {
        request.get(`${url}/api/fowl`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(50);
          done();
        });
      });

      it('should return 50 fowls at page 3.', done => {
        request.get(`${url}/api/fowl?page=3`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(50);
          done();
        });
      });
    });
  });

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
});
