Promise = require "bluebird"
# mocha = require "mocha"
# chai = require "chai"

# make sure we're using the same jQuery here as in the lib.
# DON'T require it.
$ = jQuery = window.jQuery

utils = require "./spec-utilities.coffee"

assert = chai.assert
expect = chai.expect
should = chai.should()

window.trees = []
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
  it "exists", ->
    expect( jQuery.fn.controls ).to.be.a "function"

  it "works", ->
    cSel = trees[0].controls()
    jSel = trees[0].filter( "input, button, select" )
    expect( utils.areSameSelection cSel, jSel ).to.equal true

  it "produces Control objects"

  # Controls instance should be instanceof jQuery

  # Controls instance should contain only control elements.
  
  # Controls instance should have all the methods
  
  

