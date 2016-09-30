'use strict';

//only routes that return arrays use this
module.exports = function(req, res, next) {
  req.query.page = req.query.page || 1; //gives it a default query
  req.query.pagesize = req.query.pagesize || 50; //default
  req.query. offset = 0;
  if (req.query.page < 0) req.query.pagesize = 1; //user gan't give a negative page or size
  if (req.query.pagesize < 1) req.query.pagesize = 1;
  if (req.query.offset < 0) req.query.pagesize = 0;
  next();
};
