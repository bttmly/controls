var gulp = require( 'gulp' );
var coffeelint = require( 'gulp-coffeelint' );
var gutil = require( 'gulp-util' );
var source = require( 'vinyl-source-stream' );
var watchify = require( 'watchify' );

gulp.task( 'coffeelint', function() {
  gulp.src([ "./src/*.coffee", "./spec/*.coffee" ])
    .pipe( coffeelint() )
    .pipe( coffeelint.reporter() );
});

gulp.task( 'watch', function() {

  var items = [
    {
      name: 'lib',
      source: 'jq-controls.js',
      dest: './',
      bundler: watchify('./src/jquery-controls.coffee'),
    }, {
      name: 'spec',
      source: 'jq-controls-spec.js',
      dest: './spec/',
      bundler: watchify( './spec/controls-spec.coffee' )
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
      console.log( item.name + " bundled." );
      return bundle;
    };
    item.bundler.transform( 'coffeeify' );
    item.bundler.on( 'update', rebundle );
    rebundle();
  });

});