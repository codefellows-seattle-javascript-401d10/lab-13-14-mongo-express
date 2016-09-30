'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');

const Person = require('./person.js');

const listSchema = Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  timestamp: {type: Date, required: true},
  persons: [{type: Schema.Types.ObjectId, ref: 'person'}]
});

const List = module.exports = mongoose.model('list', listSchema);

List.findByIdAndAddPerson = function(id, person){
  return List.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(list => {
    person.listID = list._id;
    this.tempList = list;
    return new Person(person).save();
  })
  .then((person) => {
    this.tempList.persons.push(person._id);
    this.tempPerson = person;
    return this.tempList.save();
  })
  .then( () => {
    return this.tempPerson;
  });
};

List.findByIdAndDeletePerson = function(ListID, personID){
  return List.findById(ListID)
  .then (list => {
    for (var i = 0; i < list.persons.length; i++){
      if (list.persons[i]._id === personID){
        list.persons.splice(i, 1);
      }
    }
    return Person.findByIdAndRemove(personID);
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};
