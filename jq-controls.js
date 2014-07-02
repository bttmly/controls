var CONTROL_TAGS = [ "input", "select", "button", "textarea" ].join( ", " );


$.fn.controls = function(){
  var nodes = [];
  $( this ).each( function( el ){
    $( this ).find( CONTROL_TAGS ).each( function( i, el ){
      nodes.push( el );
    });
  })
  return new Controls( nodes );
};

var filter = Function.prototype.call.bind( Array.prototype.filter );
var map = Function.prototype.call.bind( Array.prototype.map );

propToPropMap = function( nodes, keyProp, valProp ){
  return filter( nodes, function( el ){
    return ( keyProp in el );
  }).map( nodes, function( el ) {
    return { el[keyProp] : el[valProp] };
  });
};

// Controls constructor
var Controls = function( nodes ){
  this.idProp = "id";
  // Pass nodes through jQuery constructor to build a jQuery object.
  jQuery.fn.init.apply( this, nodes );
}

// Set up prototype chain such that Controls inherits from jQuery
Controls.prototype = Object.create( jQuery.prototype );

// Set the correct constructor property on Controls.prototype
Controls.prototype.constructor = Controls;


Controls.prototype.values = function() {
  return new Values( propToPropMap( this, this.idProp, "value" ) );
};

Controls.prototype.disabled = function() {
  return new Values( propToPropMap( this, this.idProp, "disabled" ) );
};

Controls.prototype.required = function() {
  return new Values( propToPropMap( this, this.idProp, "required" ) );
};

Controls.prototype.checked = function() {
  return new Values( propToPropMap( this, this.idProp, "checked" ) );
};

Controls.prototype.clear = function() {
  this.each( function( i, el ) {
    this.value = "";
  });
};

Controls.prototype.enable = function() {};
Controls.prototype.disable = function() {};
Controls.prototype.check = function() {};
Controls.prototype.uncheck = function() {};




// Values constructor
var Values = function( controls ){

};

Values.prototype.valueArray = function(){

};

