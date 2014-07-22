Promise = require "bluebird"

$ = jQuery = window.jQuery
# mocha = window.mocha

Control = $.Control
Values = $.Values

utils = require "./spec-utilities.coffee"

assert = chai.assert
expect = chai.expect
should = chai.should()

trees = window.trees = []
trees.byId = ( id ) ->
  for tree in @
    return tree if tree.attr( "id" ) is id
  return null

htmlFiles = [ 
  "./spec/html/values.html"
  "./spec/html/mixed.html"
]

# get all the HTML documents we need
# then kick off the test suite by running mocha.run()
Promise.all( 
  htmlFiles
  .map $.get 
  .map Promise.resolve  
).then ( data ) ->
  [].push.apply trees, data.map $
  mocha.run()

describe "jQuery.fn.controls()", ->
  
  describe "basics", ->
    it "exists", ->
      expect( jQuery.fn.controls ).to.be.a "function"

    it "works", ->
      cSel = trees.byId( "values" ).controls()
      jSel = trees.byId( "values" ).find "input, button, select"

      console.log cSel
      console.log jSel


      expect( utils.areSameSelection cSel, jSel ).to.equal true

  # it "produces Control objects"

describe "Control prototype methods", ->

  describe "@filter()", ->

  describe "@not()", ->

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


