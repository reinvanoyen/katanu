"use strict";

const gulp = require('gulp'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  source = require('vinyl-source-stream')
;

gulp.task( 'javascript', () => {

  return browserify( './src/client.js' )
    .transform( 'babelify', {
      presets: ['es2015']
    } )
    .bundle()
    .pipe(source('client.bundle.js'))
    .pipe( gulp.dest( './build/js' ) )
    .pipe( buffer() )
  ;
} );