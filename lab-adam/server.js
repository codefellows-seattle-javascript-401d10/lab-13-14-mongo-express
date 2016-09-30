'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('city:server');
const cityRouter = require('./route/city-route.js');
const errorHandler = require('./lib/error-handler.js');
const hospitalRouter = require('./route/hospital-route.js');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/citydev';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// middleware
const app = express();
app.use(cors());
app.use(morgan('dev'));

// routes
app.use(cityRouter);
app.use(hospitalRouter);
app.use(errorHandler);

app.get('/', function(req, res){
  res.sendfile(`${__dirname}/public/index.html`);
});

const server = module.exports = app.listen(PORT, function(){
  debug(`server up at ${PORT}`);
});

server.isRunning = true;
