'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createError = require('http-errors');

const Hospital = require('./hospital.js');

const citySchema = Schema({
  name: {type: String, required: true},
  population: {type: Number, required: true},
  lat: {type: Number, required: true},
  lng: {type: Number, required: true},
  timestamp: {type: Date, required: true},
  rating: {type: Number, required: true},
  hospitals: [{type: Schema.Types.ObjectId, ref: 'hospital'}],
});

const City = module.exports = mongoose.model('city', citySchema);

City.findByIdAndAddHospital = function(id, hospital){
  return City.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(city => {
    hospital.cityID = city._id;
    this.tempCity = city;
    return new Hospital(hospital).save();
  })
  .then(hospital => {
    this.tempCity.hospitals.push(hospital._id);
    this.tempHospital = hospital;
    return this.tempCity.save();
  })
  .then(() => {
    return this.tempHospital;
  });
};
