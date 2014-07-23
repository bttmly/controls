$ = jQuery = window.jQuery
Controls = jQuery.Controls
Values = jQuery.Values
chai = window.chai
assert = chai.assert
expect = chai.expect
should = chai.should()

utils = require "./spec-utilities.coffee"
sameSelection = utils.areSameSelection
{ each, map, reduce, filter, every, some } = require "./array-generics.coffee"

tags = [ "input", "select", "button", "textarea" ].join ", "
first = ( arr ) -> arr[0]

trees = window.trees = []
trees.byId = ( id ) ->
  for tree in @
    return tree if tree.attr( "id" ) is id
  return null

htmlFiles = [
  "./spec/html/values.html"
  "./spec/html/mixed.html"
  "./spec/html/validation.html"
]

# get all the HTML documents we need
# then kick off the test suite by running mocha.run()
$.when.apply $, htmlFiles.map $.get
  .then ->
    [].push.apply trees, [].slice.call( arguments ).map( first ).map( $ )
    mocha.run()

describe "jQuery.fn.controls()", ->
  
  describe "basics", ->
    it "exists", ->
      expect( jQuery.fn.controls ).to.be.a "function"

    it "works", ->
      cSel = trees.byId( "values" ).controls()
      jSel = trees.byId( "values" ).find "input, button, select"
      expect( utils.areSameSelection cSel, jSel ).to.equal true

describe "Controls.validateElement()", ->

  valid = Controls.validateElement

  describe "validation against a passed in function", ->
    validatorA = ->
      "1" in @value
    validatorB = ( str ) ->
      str + @value is "abc123"
    thisIs = ( obj ) ->
      obj is @

    it "accepts a function", ->
      els = trees.byId( "validation" ).find( ".custom-validation" )
      expect( valid( els[0], validatorA ) ).to.equal true
      expect( valid( els[1], validatorA ) ).to.equal false

    it "accepts additional arguments", ->
      els = trees.byId( "validation" ).find( ".custom-validation" )
      expect( valid( els[0], validatorB, "abc" ) ).to.equal true
      expect( valid( els[1], validatorB, "abc" ) ).to.equal false

    it "calls the function with the element as 'this'", ->
      els = trees.byId( "validation" ).find( ".custom-validation" )
      expect( valid( els[0], thisIs, els[0] ) ).to.equal true

  describe "validation against a data-control-validation attribute", ->
    it "validates an input against preset attribute validators", ->
      els = trees.byId( "validation" ).find( ".attr-validation" )
      expect( valid( els[0] ) ).to.equal true
      expect( valid( els[1] ) ).to.equal false

  describe "validation against bound validators", ->

    xit "validates against all present attached validators", ->
      els = trees.byId( "validation" ).find( ".data-validation" )
      els.each ->
        $( @ ).data "validators", [ -> "1" in @value ]



describe "Control prototype methods", ->

  cSel = undefined
  jSel = undefined
  vSel = undefined
  qsa = undefined

  beforeEach ->
    jSel = trees.byId( "values" )
    cSel = trees.byId( "values" ).controls()
    qsa = Element::querySelectorAll.bind( trees.byId( "values" )[0] )

  describe "@filter()", ->
    it "accepts a selector", ->
      flt = cSel.filter( "button" )
      btn = jSel.find( "button" )
      expect( sameSelection flt, btn ).to.equal true
      expect( btn ).to.be.instanceof jQuery
      expect( flt ).to.be.instanceof Controls

    it "accepts an array of DOM elements", ->
      btn = qsa "button"
      flt = cSel.filter( "button" )
      expect( sameSelection flt, btn ).to.equal true
      expect( flt ).to.be.instanceof Controls

    it "accepts a function", ->
      flt = cSel.filter ->
        @tagName.toLowerCase() is "button"
      btn = qsa "button"
      expect( sameSelection flt, btn ).to.equal true
      expect( flt ).to.be.instanceof Controls

    it "accepts a jQuery selection", ->
      btn = jSel.find "button"
      flt = cSel.filter btn
      expect( sameSelection flt, btn ).to.equal true
      expect( flt ).to.be.instanceof Controls
      expect( btn ).to.be.instanceof jQuery

    xit "accepts a Controls selection"

  describe "@not()", ->
    it "accepts a selector", ->
      jNoInput = jSel.find( tags ).not "input"
      cNoInput = cSel.not "input"
      expect( sameSelection jNoInput, cNoInput ).to.equal true
      expect( cNoInput ).to.be.instanceof Controls
      expect( jNoInput ).to.be.instanceof jQuery

    it "accepts an array of DOM elements", ->
      inputs = jSel.find( "input" ).get()
      cNoInput = cSel.not inputs
      hasAnInput = some cNoInput, ( el ) ->
        el.tagName.toLowerCase() is "input"
      expect( hasAnInput ).to.equal false

    it "accepts a function", ->
      cEmptyValue = cSel.not ->
        @value is ""
      vEmptyValue = filter qsa( tags ), ( el ) ->
        el.value isnt ""
      expect( sameSelection cEmptyValue, vEmptyValue ).to.equal true

    it "accepts a jQuery selection", ->
      jEmptyValue = jSel.filter ->
        @value is ""
      cNoEmptyValue = jSel.not jEmptyValue
      hasEmptyValues = some cNoEmptyValue, ( el ) ->
        @value is ""
      expect( hasEmptyValues ).to.equal false

    xit "accepts a Controls selection"



  describe "@propValues()", ->

  describe "@values()", ->

  describe "@reset()", ->

  describe "@clear()", ->

  describe "@check", ->
  describe "@uncheck", ->
  describe "@require", ->
  describe "@unrequire", ->
  describe "@disable", ->
  describe "@enable", ->

  describe "@valid", ->

  describe "@bindValidator", ->

  describe "@labels", ->
  
  return


