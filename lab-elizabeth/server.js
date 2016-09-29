'use strict';

// npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('series:server');

// app modules
const seriesRouter = require('./route/series-router');

// module constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb:/localhost/seriesdev';

// connect to database
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// app middleware
const app = express();
app.use(cors());
app.use(morgan('dev'));

// routes
app.use(seriesRouter);

const server = module.exports = app.listen(PORT, function(){
  debug(`server up! <(0v0)> ${PORT}`);
});

server.isRunning = true;
