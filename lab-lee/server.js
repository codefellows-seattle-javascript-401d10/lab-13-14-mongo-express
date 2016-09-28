'use strict';

// npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('fowl:server');

// app modules
const fowlRouter = require('./route/fowl-route');

// module constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/fowldev';

// connect to database
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// app middleware
const app = express();
app.use(morgan('dev'));
app.use(cors());

// routes
app.use(fowlRouter);

const server = module.exports = app.listen(PORT, function() {
  debug(`server up at ${PORT}`);
});

server.isRunning = true;
