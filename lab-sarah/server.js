'use strict';

//npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('dog:server');
const errorMiddleware = require('./lib/error-middleware');

//app modules
const parkRouter = require('./route/park-route.js');

//module constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/dogdev';

//connect to database
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//app middleware
const app = express();
app.use(cors());
app.use(morgan('dev'));

//routes
app.use(parkRouter);
app.use(errorMiddleware);

const server = module.exports = app.listen(PORT, function(){
  debug(`server up ${PORT}`);
});

server.isRunning = true;
