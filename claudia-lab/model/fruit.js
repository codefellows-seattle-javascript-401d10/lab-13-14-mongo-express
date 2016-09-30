'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const debug = require('debug')('location: location-route');

const Location = require('./location.js');

const fruitSchema = Schema({
  name: {type: String, required: true},
  locations: [{type: Schema.Types.ObjectId, ref: 'location'}], //ref assigns a name, need ref to allow populate to work
});

//stores all fruit schemas in the collection 'fruit'
const Fruit = module.exports = mongoose.model('fruit', fruitSchema);

Fruit.findByIdAndAddLocation = function(id, location){
  return Fruit.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(fruit => { //make sure the list exists
    location.fruitID = fruit._id; //_id created by mongo
    this.tempFruit = fruit; //stores reference to fruit so it can be updated
    //create a location and save list
    return new Location(location).save();

  })
  .then( location => {
    this.tempFruit.locations.push(location._id); //push id to array of locations
    this.tempLocation = location; //save reference
    return this.tempFruit.save(); //save the list
  })
  .then( () => {
    return this.tempLocation; //return the fruit
  });
};

Fruit.findByIdAndRemoveLocation = function(locationId){
  return Location.findById(locationId) //returns location
  .then( location => {
    this.tempLocation = location; //gets reference to id at the location because its stored on the fruit and you need to remove if from location array on fruit
    return Location.remove(this.tempLocation); //remove location
  })
  .then( () => {
    debug('TEMPLOCATION', this.tempLocation);
    return Fruit.findById(this.tempLocation.fruitID);
  })
  .catch(err => Promise.reject(createError(404, err.message)))
  .then( fruit => {
    debug('FRUIT', fruit);
    for (var i = 0; i < fruit.locations.length; i++) {
      if (fruit.locations[i]._id === this.tempLocation.fruitID) {
        return fruit.locations.splice(i, 1);
      }
    }
    fruit.save();
  });
};

//populate happens in the routes, this is just creating the locations
//list has to have reference to all the locations that have been created
