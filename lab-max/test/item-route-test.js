'use strict';

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/storetest';

const expect = require('chai').expect;
const debug = require('debug')('store:item-test');
const request = require('superagent');
const Store = require('../model/store.js');
const Item = require('../model/item.js');
const server = require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleItem = {
  name: 'soccer shoes',
  itemType: 'shoes',
  price: 50,
};

const exampleStore = {
  name: 'nike',
  timestamp: new Date(),
  year: 1964,
  storeType: 'sporting goods',
};

describe('testing item routes', function(){

  before((done) => {
    debug('before module item-router-test');
    if (! server.isRunning) {
      server.listen(PORT, () => {
        server.isRunning = true;
        debug(`server up ::: ${PORT}`);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    debug('after module item-router-test');
    if (server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        debug('server down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST requests', function(){
    describe('with valid store id and item', () => {

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
          Item.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return an item', done => {
        request.post(`${url}/api/store/${this.tempStore._id}/item`)
        .send(exampleItem)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleItem.name);
          expect(res.body.storeID).to.equal(this.tempStore._id.toString());
          done();
        });
      });
    });

    describe('with invalid body', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return with a 400 error for bad request', done => {
        request.post(`${url}/api/store/${this.tempStore._id}/item`)
        .send('{')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(this.tempStore.items.length).to.equal(0);
          done();
        });
      });
    });

    describe('with invalid store id', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });


      it('should respond with a 404 error for storeID not found', done => {
        request.post(`${url}/api/store/_1111/item`)
        .send(exampleItem)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('testing GET requests', function(){
    describe('testing with valid store id and body', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          exampleItem.storeID = store._id;
          this.tempStore = store;
          return new Item(exampleItem).save();
        })
        .then(item => {
          this.tempStore.items.push(item._id);
          this.tempItem = item;
          this.tempStore.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
          Item.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return an item', done => {
        request.get(`${url}/api/store/${this.tempItem.storeID}/item/${this.tempItem._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('soccer shoes');
          expect(res.body.itemType).to.equal('shoes');
          expect(res.body.price).to.equal(50);
          done();
        });
      });
    });

    describe('testing with invalid item id', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          this.tempStore = store;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return with a 404 error for item not found', done => {
        request.get(`${url}/api/store/${this.tempStore._id}/item/_1111`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('testing PUT requests', function(){
    describe('with a valid store id and item id', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          exampleItem.storeID = store._id;
          this.tempStore = store;
          return new Item(exampleItem).save();
        })
        .then(item => {
          this.tempStore.items.push(item._id);
          this.tempItem = item;
          this.tempStore.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
          Item.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return an update item', done => {
        let updateItem = {
          name: 'shirt',
          itemType: 'apparel',
          price: 10,
        };
        request.put(`${url}/api/store/${this.tempStore._id}/item/${this.tempItem._id}`)
        .send(updateItem)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('shirt');
          expect(res.body.itemType).to.equal('apparel');
          expect(res.body.price).to.equal(10);
          done();
        });
      });
    });

    describe('testing invalid request', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          exampleItem.storeID = store._id;
          this.tempStore = store;
          return new Item(exampleItem).save();
        })
        .then(item => {
          this.tempStore.items.push(item._id);
          this.tempItem = item;
          this.tempStore.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
          Item.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should respond with a 400 error for invalid body', done => {
        request.put(`${url}/api/store/${this.tempStore._id}/item/${this.tempItem._id}`)
        .set('Content-Type', 'application/json')
        .send('{')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('testing invalid request', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          exampleItem.storeID = store._id;
          this.tempStore = store;
          return new Item(exampleItem).save();
        })
        .then(item => {
          this.tempStore.items.push(item._id);
          this.tempItem = item;
          this.tempStore.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
          Item.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should respond with a 404 error for invalid item id', done => {
        let updateItem = {
          name: 'sock',
          itemType: 'apparel',
          price: 5,
        };
        request.put(`${url}/api/store/${this.tempStore._id}/item/_1111`)
        .send(updateItem)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('testing DELETE requests', function(){
    describe('testing valid request', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          exampleItem.storeID = store._id;
          this.tempStore = store;
          return new Item(exampleItem).save();
        })
        .then(item => {
          debug(item + ' new Item');
          this.tempStore.items.push(item._id);
          debug(this.tempStore + ' store array');
          this.tempItem = item;
          this.tempStore.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
          Item.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should delete an item', done => {
        request.delete(`${url}/api/store/${this.tempStore._id}/item/${this.tempItem._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    describe('testing invalid request', function(){

      before(done => {
        new Store(exampleStore).save()
        .then(store => {
          exampleItem.storeID = store._id;
          this.tempStore = store;
          return new Item(exampleItem).save();
        })
        .then(item => {
          this.tempStore.items.push(item._id);
          this.tempItem = item;
          this.tempStore.save();
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Store.remove({}),
          Item.remove({}),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should return with a 404 error for id not found', done => {
        request.delete(`${url}/api/store/${this.tempStore._id}/item/_11111`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
