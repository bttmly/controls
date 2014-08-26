'use strict';

var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var source = require( 'vinyl-source-stream' );
var browserify = require( 'browserify' );
var watchify = require( 'watchify' );
var gulpIstanbul = require( 'gulp-istanbul' );
var istanbul = require( 'istanbul' )
var mochaPhantomJS = require( 'gulp-mocha-phantomjs' );

gulp.task( 'bad-test', function () {
  gulp.src([ './spec/spec-runner.html' ])
    .pipe( mochaPhantomJS() )
    .pipe( gulpIstanbul.writeReports() )
    .on( 'end', function () {
      process.exit( 0 );
    });

});

gulp.task( 'build-test', function () {
  function bundle () {
    return browserify({
      entries: ['./spec/controls-spec.coffee'],
      extensions: ['.coffee'],
      debug: true
    }).bundle()
      .pipe( source( 'jq-controls-spec.js' ) )
      .pipe( gulp.dest( './spec' ) )
      .on( 'end', function () { console.log( 'Bundled.' ); } );
  }

  return bundle();
});


// gulp.task( 'watch', function() {

//   var items = [
//     {
//       name: 'lib',
//       source: 'jq-controls.js',
//       dest: './dist/',
//       bundler: watchify( browserify({
//         entries: './src/jquery-controls.coffee',
//         cache: {},
//         packageCache: {},
//         fullPaths: true
//       }))
//     }, {
//       name: 'spec',
//       source: 'jq-controls-spec.js',
//       dest: './spec/',
//       bundler: watchify( browserify({
//         entries: './spec/controls-spec.coffee',
//         cache: {},
//         packageCache: {},
//         fullPaths: true
//       }))
//     }
//   ];

//   items.forEach( function( item ) {
//     var rebundle = function() {
//       var bundle = item.bundler.bundle()
//         .on( 'error', function( err ) {
//           gutil.log( err );
//         })
//         .on( 'time', function( time ) {
//           gutil.log( time );
//         })
//         .pipe( source( item.source ) )
//         .pipe( gulp.dest( item.dest ) );
//       console.log( item.name + ' bundled.' );
//       return bundle;
//     };
//     item.bundler.transform( 'coffeeify' );
//     item.bundler.transform( 'brfs' );
//     item.bundler.on( 'update', rebundle );
//     rebundle();
//   });

// });
