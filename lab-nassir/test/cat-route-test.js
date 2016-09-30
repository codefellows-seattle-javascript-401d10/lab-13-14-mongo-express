'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/cattest';

const expect = require('chai').expect;
const request = require('superagent');
const Cafe = require('../model/cafe');
const Cat = require('../model/cat');

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleCafe = {
  name: 'TestCafe',
  address: '123 Test Street',
  timestamp: new Date(),
};

const exampleCat = {
  name: 'Testy',
  breed: 'Testhair',
  timestamp: new Date(),
};

describe('Testing cat routes', function(){

  describe('Testing POST routes', function(){

    describe('Testing with a VALID ID and VALID BODY', () => {

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Cafe.remove({}),
          Cat.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a status of 200 and a cat', done => {
        request.post(`${url}/api/cafe/${this.tempCafe._id}/cat`)
        .send(exampleCat)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleCat.name);
          done();
        });
      });

    });

    describe('Testing with a VALID ID and INVALID BODY', () => {

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Cafe.remove({}),
          Cat.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a status of 400 and SyntaxError', done => {
        request.post(`${url}/api/cafe/${this.tempCafe._id}/cat`)
        .set('Content-type', 'application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('SyntaxError');
          done();
        });
      });

    });

    describe('Testing with a INVALID ID and VALID BODY', () => {

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          this.tempCafe = cafe;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Cafe.remove({}),
          Cat.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a status of 404 and NotFoundError', done => {
        request.post(`${url}/api/cafe/1234/cat`)
        .send(exampleCat)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });

    });

  });

  describe('Testing GET routes', function(){

    describe('Testing GET with VALID ID', () => {

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          exampleCat.cafeId = cafe._id;
          this.tempCafe = cafe;
          return new Cat(exampleCat).save();
        })
        .then(cat => {
          this.tempCafe.cats.push(cat._id);
          this.tempCat = cat;
          this.tempCafe.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Cafe.remove({}),
          Cat.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a status of 200 and a cat', done => {
        request.get(`${url}/api/cafe/${this.tempCat.cafeId}/cat/${this.tempCat._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.tempCat.name);
          done();
        });
      });
    });

    describe('Testing GET with INVALID CAT ID', () => {

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          exampleCat.cafeId = cafe._id;
          this.tempCafe = cafe;
          return new Cat(exampleCat).save();
        })
        .then(cat => {
          this.tempCafe.cats.push(cat._id);
          this.tempCat = cat;
          this.tempCafe.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Cafe.remove({}),
          Cat.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a status of 404 and NotFoundError', done => {
        request.get(`${url}/api/cafe/${this.tempCat.cafeId}/cat/1234`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });


    describe('Testing GET with INVALID CAFE ID', () => {

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          exampleCat.cafeId = cafe._id;
          this.tempCafe = cafe;
          return new Cat(exampleCat).save();
        })
        .then(cat => {
          this.tempCafe.cats.push(cat._id);
          this.tempCat = cat;
          this.tempCafe.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Cafe.remove({}),
          Cat.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a status of 404 and NotFoundError', done => {
        request.get(`${url}/api/cafe/1234/cat/${this.tempCat._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.text).to.equal('NotFoundError');
          done();
        });
      });
    });
  });

  describe('Testing DELETE routes', function(){

    describe('Testing DELETE with VALID CAFE ID and VALID CAT ID', () => {

      before(done => {
        new Cafe(exampleCafe).save()
        .then(cafe => {
          exampleCat.cafeId = cafe._id;
          this.tempCafe = cafe;
          return new Cat(exampleCat).save();
        })
        .then(cat => {
          this.tempCafe.cats.push(cat._id);
          this.tempCat = cat;
          this.tempCafe.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Cafe.remove({}),
          Cat.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('Should return a status of 204 and then doublecheck to ensure the ID has been removed from the cats array', done => {
        let tempId = this.tempCat._id;
        request.delete(`${url}/api/cafe/${this.tempCat.cafeId}/cat/${this.tempCat._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          request.get(`${url}/api/cafe/${this.tempCat.cafeId}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.cats.indexOf(tempId)).to.equal(-1);
            done();
          });
        });
      });
    });
  });
});
