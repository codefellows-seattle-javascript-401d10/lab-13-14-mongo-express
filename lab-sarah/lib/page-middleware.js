'use strict';

module.exports = function(req, res, next){
  //giving it a default query if the user didn't send a query
  //this middleware is only going to be used on routes that return arrays
  req.query.page = req.query.page || 1;
  req.query.pagesize = req.query.pagesize || 50;
  req.query.offset = 0;
  //so that if user gives page number of -1, will just go to first page
  if (req.query.page < 1) req.query.page = 1;
  if (req.query.pagesize < 1) req.query.pagesize = 1;
  if (req.query.offset < 0) req.query.pagesize = 0;
  next();
};
