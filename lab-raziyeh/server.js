'use strict';

// npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('customer:server');

// app modules 
const customerRouter = require('./route/customer-route.js');
const orderRouter = require('./route/order-route.js');
const errorMiddleware = require('./lib/error-middleware.js');

// module constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/customerdev';

// connect to database
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// app middleware
const app = express();
app.use(cors());
app.use(morgan('dev'));

// routes
app.use(customerRouter);
app.use(orderRouter);

//it's important that errorMiddleware be added after model router'
app.use(errorMiddleware);

const server = module.exports = app.listen(PORT, function(){
  debug(`server up on ${PORT}`);
});

server.isRunning = true; 