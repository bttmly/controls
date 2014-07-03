var browserify = require( "browserify" );
var coffeeify = require( "coffeeify" );
var fs = require( "fs" );

var b = browserify();
b.add( "./src/package.coffee" );
b.transform( coffeeify );
b.bundle( function( err, src ) {
  if ( err ) {
    console.log( "Bundling error!" );
    throw err;
  }
  fs.writeFile( "./jq-controls.js", src, function( err ) {
    if ( err ) {
      console.log( "Write error!" );
      throw err;
    }
    console.log( "Build complete" );
  });
});