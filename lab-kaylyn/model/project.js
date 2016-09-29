'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = Schema({
  projectName: {type: String, required: true},
  aboutProject: {type: String, required: true},
  projectLink: {type: String, required: true},
  portfolioID: {type: Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('project', projectSchema);
