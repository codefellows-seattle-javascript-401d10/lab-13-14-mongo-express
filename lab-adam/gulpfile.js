'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');


gulp.task('test', function(){
  gulp.src(`${__dirname}/test/*-test.js`, {read: false})
  .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', () => {
  return gulp.src(['**/*.js','!node_modules/**'])
  .pipe(eslint());
});

gulp.task('default', ['test', 'lint'], function () {
  console.log('Tests & Linter run successfully!');
});
