"use strict";

const gulp = require('gulp'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  source = require('vinyl-source-stream'),
  babel = require('gulp-babel')
;

gulp.task('client', () => {
  return browserify('./src/client/init.js')
    .transform('babelify', {
      presets: ['es2015']
    })
    .bundle()
    .pipe(source('client.bundle.js'))
    .pipe(gulp.dest('./static/build'))
    .pipe(buffer())
  ;
});

gulp.task('shared', () => {
  return gulp.src('./src/shared/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build/shared'))
    ;
});

gulp.task('ws-server', () => {
  return gulp.src('./src/ws-server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build/ws-server'))
  ;
});

gulp.task('http-server', () => {
  return gulp.src('./src/http-server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build/http-server'))
  ;
});