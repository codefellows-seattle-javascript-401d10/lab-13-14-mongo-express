'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/cattest';

const expect = require('chai').expect;
const request = require('superagent');
const Cafe = require('../model/cafe');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleCafe = {
  name: 'Test Cafe',
  address: 'Test Address',
  timestamp: new Date(),
};

const exampleCafeTwo = {
  name: 'Test Cafe Two',
  address: 'Test Address Two',
};

describe('Testing routes on /api/cafe', function(){

  describe('Testing POST /api/cafe', function(){

    after(done => {
      if(this.tempCafe) {
        Cafe.remove({})
        .then(() => done())
        .catch(done);
        return;
      }
      done();
    });

    describe('Testing POST /api/cafe with VALID BODY', function(){
      it('Should return a status code of 200 and a valid cat cafe', done => {
        request.post(`${url}/api/cafe`)
        .send(exampleCafe)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Test Cafe');
          expect(res.body.address).to.equal('Test Address');
          this.tempCafe = res.body;
          done();
        });
      });
    });

    describe('Testing POST /api/cafe with NO BODY or INVALID BODY', function(){
      it('Should return a status code of 400 and an error message', done => {
        request.post(`${url}/api/cafe`)
        .set('Content-type', 'application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('SyntaxError');
          done();
        });
      });
    });
  });

  describe('Testing GET /api/cafe', function(){

    describe('Testing GET /api/cafe with VALID ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return a status code of 200 and a cat cafe', done => {
        request.get(`${url}/api/cafe/${this.tempCafe._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Test Cafe');
          expect(res.body.address).to.equal('Test Address');
          done();
        });
      });
    });

    describe('Testing GET /api/cafe with INVALID ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return a status code of 404 and an error message', done => {
        request.get(`${url}/api/cafe/34`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });

    describe('Testing GET /api/cafe with NO ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(new Cafe(exampleCafeTwo).save())
        .then(() => done())
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return a status code of 200 and an array of docs', done => {
        request.get(`${url}/api/cafe/`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body instanceof Array).to.equal(true);
          expect(res.body.length).to.equal(2);
          expect(res.body[0].name).to.equal('Test Cafe');
          expect(res.body[1].name).to.equal('Test Cafe Two');
          done();
          this.tempCafe = res.body[0];
        });
      });
    });

  });

  describe('Testing PUT /api/cafe', function(){

    describe('Testing PUT /api/cafe with VALID BODY', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return status code 200 and a valid body', done => {
        request.put(`${url}/api/cafe/${this.tempCafe._id}`)
        .set('Content-type', 'application/json')
        .send({name: 'New Test Name', address: 'New Test Address'})
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('New Test Name');
          expect(res.body.address).to.equal('New Test Address');
          let testTimestamp = new Date(res.body.timestamp);
          expect(testTimestamp.toString()).to.equal(exampleCafe.timestamp.toString());
          done();
        });
      });
    });

    describe('Testing PUT /api/cafe with INVALID BODY', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return status code 400 and an error message', done => {
        request.put(`${url}/api/cafe/${this.tempCafe._id}`)
        .set('Content-type', 'application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('SyntaxError');
          this.tempCafe = res.body;
          done();
        });
      });
    });




    describe('Testing PUT /api/cafe with NO ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return a 404 status', done => {
        request.put(`${url}/api/cafe/34`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('Testing DELETE /api/cafe', function(){
    describe('Testing DELETE /api/cafe/ with VALID ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      it('Should return a status code of 204', done => {
        request.delete(`${url}/api/cafe/${this.tempCafe._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });

    });

    describe('Testing DELETE /api/cafe/ with INVALID ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return a status code of 404', done => {
        request.delete(`${url}/api/cafe/1224534`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('Testing DELETE /api/cafe/ with NO ID', function(){

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
        return;
      });

      after(done => {
        if(this.tempCafe) {
          Cafe.remove({})
          .then(() => done())
          .catch(done);
          return;
        }
        done();
      });

      it('Should return a status code of 404', done => {
        request.delete(`${url}/api/cafe/`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });


  });

  describe('Testing unregistered routes', function(){
    it('Should return a 404 status and an error message', function(done){
      request.get('localhost:3000/api/apples')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.text).to.equal('Cannot GET /api/apples\n');
        expect(err).to.not.equal(null);
        done();
        res.end();
      });
    });
  });
});
