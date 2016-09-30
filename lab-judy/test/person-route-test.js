'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/persontest';

const expect = require('chai').expect;
const request = require('superagent');

const List = require('../model/list.js');
const Person = require('../model/person.js');


require('../server.js');

const url = `http://localhost:${PORT}`;

const examplePerson = {
  lastName: 'vue',
  location: 'seattle'
};

const exampleList = {
  name: 'judy',
  age: 11,
  timestamp: new Date()
};

describe('testing person routes', function(){

  //POST 200 and 400 tests
  describe('testing POST requests', function(){
    describe('with valid list id and person body', () => {
      before(done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          List.remove({}),
          Person.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

      //POST 200 test
      it('should return a person with status 200', done => {
        request.post(`${url}/api/list/${this.tempList.id}/person`)
        .send(examplePerson)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.lastName).to.equal(examplePerson.lastName);
          expect(res.body.listID).to.equal(this.tempList._id.toString());
          done();
        });
      });

      //POST 400 test
      it('should return 400 for invalid body provided', done => {
        request.post(`${url}/api/list/${this.tempList.id}/person`)
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });


  });

  //GET tests 200 and 404
  describe('testing GET requests', function(){
    before(done => {
      new List(exampleList).save()
      .then( list => {
        this.tempList = list;
        return List.findByIdAndAddPerson(list._id, examplePerson);
      })
      .then( person => {
        this.tempPerson = person;
        done();
      })
      .catch(done);
    });

    after(done => {
      Promise.all([
        List.remove({}),
        Person.remove({})
      ])
      .then(() => done())
      .catch(done);
    });

    describe('valid and invalid request', () => {

      //GET 200 test
      it('should return status 200 and person body', done => {
        request.get(`${url}/api/list/person/${this.tempPerson._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.lastName).to.equal(examplePerson.lastName);
          expect(res.body.location).to.equal(examplePerson.location);
          done();
        });
      });

      //GET 404 test
      it('should return status 404 for invalid request', done => {
        request.get(`${url}/api/list/person/badid#`)
        .end((err, res) => {
          expect(res.status).equal(404);
          done();
        });
      });
    });
  });


  //DELETE tests 204 and 404
  describe('testing DELETE requests', function(){
    before(done => {
      new List(exampleList).save()
      .then( list => {
        this.tempList = list;
        return List.findByIdAndAddPerson(list._id, examplePerson);
      })
      .then( person => {
        this.tempPerson = person;
        done();
      })
      .catch(done);
    });

    after(done => {
      List.remove({})
      .then(() => done())
      .catch(done);
    });

    //DELETE 204 test
    it('should delete person with valid ID', done => {
      request.delete(`${url}/api/list/${this.tempList._id}/person/${this.tempPerson._id}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(204);
        done();
      });
    });

    //DELETE 404 test
    it('should return status 404 for delete request with invalid ID', done => {
      request.delete(`${url}/api/list/${this.tempList._id}/person/badid#`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

});
