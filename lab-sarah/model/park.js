'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');
const debug = require('debug')('park:park-model');

//have to have access to the dog in order to make park, because you can't have park without dogs

const Dog = require('./dog.js');

const parkSchema = Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  //should be using the dog constructor
  //the ref is going to be what allows populate to do its job
  dogs: [{type: Schema.Types.ObjectId, ref: 'dog'}],
});

const Park = module.exports = mongoose.model('park', parkSchema);

//adds static method to Park
Park.findByIdAndAddDog = function(id, dog){
  debug('hit findByIdAndAddDog');
  //this next line returns a promise
  return Park.findById(id)
  //if we don't find park, reject
  .catch(err => Promise.reject(createError(404, err.message)))
  //if we do find park, then create the dog
  .then(park => {
    //the parkID of the dog is set to the id given to dog by mongoose
    dog.parkID = park._id;
    this.tempPark = park;
    //create a dog within that park, and then update that park so it has that dog
    return new Dog(dog).save();
  })
  .then((dog) => {
    //every time you make a dog, push the dog into the Park array, so you know with Parks have which dogs
    this.tempPark.dogs.push(dog._id);
    this.tempDog = dog;
    return this.tempPark.save();
  })
  .then(() => {
    return this.tempDog;
  });
};

Park.findByIdAndDeleteDog = function(dogid){
  debug('hit findByIdAndDeleteDog', dogid);

  return Dog.findById(dogid)
  .then(dog => {
    this.tempDog = dog;
    return dog.remove(this.tempDog)
    .then(() => {
      return Park.findById(this.tempDog.parkID);
    })
    .catch(err => Promise.reject(createError(404, err.message)))
    .then(park => {
      park.dogs = park.dogs.filter(_dogId => {
        if (_dogId.toString() === dogid) return false;
        return true;
      });
      return park.save();
    });
  });

};

//This is the file where you make all your static methods, to handle the logic for adding and deleting and updating dogs.
