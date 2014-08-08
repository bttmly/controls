'use strict';

var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var source = require( 'vinyl-source-stream' );
var browserify = require( 'browserify' );
var watchify = require( 'watchify' );

gulp.task( 'watch', function() {

  var items = [
    {
      name: 'lib',
      source: 'jq-controls.js',
      dest: './dist/',
      bundler: watchify( browserify({
        entries: './src/jquery-controls.coffee',
        cache: {},
        packageCache: {},
        fullPaths: true
      }))
    }, {
      name: 'spec',
      source: 'jq-controls-spec.js',
      dest: './spec/',
      bundler: watchify( browserify({
        entries: './spec/controls-spec.coffee',
        cache: {},
        packageCache: {},
        fullPaths: true
      }))
    }
  ];

  items.forEach( function( item ) {
    var rebundle = function() {
      var bundle = item.bundler.bundle()
        .on( 'error', function( err ) {
          gutil.log( err );
        })
        .on( 'time', function( time ) {
          gutil.log( time );
        })
        .pipe( source( item.source ) )
        .pipe( gulp.dest( item.dest ) );
      console.log( item.name + ' bundled.' );
      return bundle;
    };
    item.bundler.transform( 'coffeeify' );
    item.bundler.transform( 'brfs' );
    item.bundler.on( 'update', rebundle );
    rebundle();
  });

});
