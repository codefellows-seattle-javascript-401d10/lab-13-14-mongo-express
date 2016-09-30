'use strict';

//npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('park:server');

//app modules
//HAVE TO REQUIRE IN ALL ROUTERS TO SERVER
const parkRouter = require('./route/park-route.js');
const dogRouter = require('./route/dog-route.js');
const errorMiddleware = require('./lib/error-middleware');

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
app.use(dogRouter);
app.use(errorMiddleware);

const server = module.exports = app.listen(PORT, function(){
  debug(`server up ${PORT}`);
});

server.isRunning = true;
