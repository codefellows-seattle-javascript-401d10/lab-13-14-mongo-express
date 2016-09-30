'use strict';

const PORT = process.env.PORT|| 3000;
process.env.MONGODB_URI = 'mongodb://localhost/ducktest';

const expect = require('chai').expect;
const request = require('superagent');
const Fowl = require('../model/fowl.js');
const Duck = require('../model/duck.js');

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

      before(done => {
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
        request.post(`${url}/api/fowl/${this.tempFowl.id}/duck`)
        .send(exampleDuck)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.body.name).to.equal(exampleDuck.name);
            expect(res.body.fowlID).to.equal(this.tempFowl._id.toString());
            done();
          });
        done();
      });
    });
  });
});
