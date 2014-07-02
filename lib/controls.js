"use strict";

var Values = require( "./value.js" );
var CONTROL_TAGS = [ "input", "select", "button", "textarea" ];
var $ = window.jQuery;

function propToPropMap( jqCollection, keyProp, valProp ){
  return jqCollection.get()
  .filter( function( el ){
    return ( keyProp in el );
  }).map( function( el ) {
    var o = {};
    o[el[keyProp]] = el[valProp];
    return o;
    // return { el[keyProp] : el[valProp] };
  });
}

// Control constructor
function Controls( nodes ) {
  this.idProp = "id";
  // Pass nodes through jQuery constructor to build a jQuery object.
  $.fn.init.apply( this, nodes );
}

// Set up prototype chain such that Controls inherits from jQuery
Controls.prototype = Object.create( $.prototype );

// Set the correct constructor property on Controls.prototype
Controls.prototype.constructor = Controls;

// Methods that return property maps (Values objects).
Controls.prototype.propValues = function( prop ) {
  return new Values( propToPropMap( this, this.idProp, prop ) );
};

Controls.prototype.values = function() {
  return this.propValues( "value" );
};

Controls.prototype.areDisabled = function() {
  return this.propValues( "disabled" );
};

Controls.prototype.areRequired = function() {
  return this.propValues( "required" );
};

Controls.prototype.areChecked = function() {
  return this.propValues( "checked" );
};

Controls.prototype.clear = function() {
  this.val( "" );
};

Controls.prototype.enable = function() {
  this.removeAttr( "disabled" );
};

Controls.prototype.disable = function() {
  $( this ).attr( "disabled", "disabled" );
};

Controls.prototype.uncheck = function() {
  $( this ).removeAttr( "checked" );
};

Controls.prototype.check = function() {
  $( this ).attr( "checked", "checked" );
};

Controls.prototype.unrequire = function() {
  $( this ).removeAttr( "required" );
};

Controls.prototype.require = function() {
  $( this ).attr( "required", "require" );
};

// override $.fn.filter so that it returns controls instance
Controls.prototype.filter = function() {
  return $.fn.filter.apply( this, arguments ).controls();
};

module.exports = {
  init: function() {
    $.fn.controls = function(){
      var nodes = $( this ).find( CONTROL_TAGS.join( ", " ) ).get();
      return new Controls( nodes );
    };
  },
  Controls: Controls
};
