# phantomJS lacks Function::bind
Function::bind = Function::bind or require "./bind.coffee"

require "../src/jquery-controls.coffee"

fs = require "fs"
sinon = require "sinon"
expect = require( "chai" ).expect

# { expect } = window.chai
{ jQuery } = window
{ Controls, Values } = jQuery



{ sameSelection } = require "./spec-utilities.coffee"

{ map
  some
  every
  slice
  filter
  reduce } = require "./array-generics.coffee"

{ CHECKABLE
  BUTTON
  TAGS
  RADIO
  CHECK } = require "./selectors.coffee"

type = ->
  str = []
  for arg in arguments
    str.push "[type=#{ arg }]"
  str.join ", "

first = ( arr ) -> arr[ 0 ]
last = ( arr ) -> arr[ arr.length - 1 ]

trees = window.trees = do ->
  storage = {}
  byId: ( id ) ->
    if storage[id] then $.parseHTML( storage[id] )[0] else null
  addTree: ( htmlStr ) ->
    id = $( htmlStr ).attr "id"
    storage[id] = htmlStr

[
  fs.readFileSync "#{ __dirname }/html/values.html", "utf8"
  fs.readFileSync "#{ __dirname }/html/mixed.html", "utf8"
  fs.readFileSync "#{ __dirname }/html/validation.html", "utf8"
  fs.readFileSync "#{ __dirname }/html/with-initial-state.html", "utf8"
  fs.readFileSync "#{ __dirname }/html/with-labels.html", "utf8"
].map trees.addTree.bind trees

describe "jQuery.fn.controls()", ->

  describe "basics", ->
    it "exists", ->
      expect( jQuery.fn.controls ).to.be.a "function"

    it "works", ->
      root = trees.byId( "values" )
      cSel = $( root ).controls()
      jSel = $( root ).find "input, button, select"
      expect( sameSelection cSel, jSel ).to.equal true

describe "Controls.validateElement()", ->

  valid = Controls.validateElement

  root = null

  beforeEach ->
    root = trees.byId "validation"

  describe "validation against a passed in function", ->
    validatorA = ->
      "1" in @value
    validatorB = ( str ) ->
      str + @value is "abc123"
    thisIs = ( obj ) ->
      obj is @

    it "accepts a function", ->
      els = $( root ).find( ".custom-validation" )
      expect( valid( els[0], validatorA ) ).to.equal true
      expect( valid( els[1], validatorA ) ).to.equal false

    it "accepts additional arguments", ->
      els = $( root ).find( ".custom-validation" )
      expect( valid( els[0], validatorB, "abc" ) ).to.equal true
      expect( valid( els[1], validatorB, "abc" ) ).to.equal false

    it "calls the function with the element as 'this'", ->
      els = $( root ).find( ".custom-validation" )
      expect( valid( els[0], thisIs, els[0] ) ).to.equal true

  describe "validation against a data-control-validation attribute", ->
    it "validates an input against preset attribute validators", ->
      els = $( root ).find( ".attr-validation" )
      expect( valid( els[0] ) ).to.equal true
      expect( valid( els[1] ) ).to.equal false

  describe "validation against bound validators", ->
    it "validates against all present attached validators", ->
      els = $( root ).find( ".data-validation" )
      $.data els[0], "controlValidators", [
        ( -> @value == "123" )
        ( -> @value != "abc" )
      ]
      $.data els[1], "controlValidators", [
        ( -> @value != "abc" )
        ( -> @value == "abc" )
      ]
      expect( valid( els[0] ) ).to.equal true
      expect( valid( els[1] ) ).to.equal false
      $.data els[0], "controlValidators", ""
      $.data els[1], "controlValidators", ""

  # describe "validation with HTML5"

describe "Control prototype methods", ->

  cSel = undefined
  jSel = undefined
  vSel = undefined
  qsa = undefined

  beforeEach ->
    root = trees.byId( "values" )
    jSel = $( root )
    cSel = $( root ).controls()
    qsa = Element::querySelectorAll.bind( root )

  describe "@filter()", ->
    it "returns a Controls instance", ->
      expect( cSel.filter "button" ).to.be.instanceof Controls

    it "accepts a selector", ->
      flt = cSel.filter "button"
      btn = jSel.find "button"
      expect( sameSelection flt, btn ).to.equal true

    it "accepts an array of DOM elements", ->
      btn = qsa "button"
      flt = cSel.filter "button"
      expect( sameSelection flt, btn ).to.equal true

    it "accepts a function", ->
      flt = cSel.filter ->
        @tagName.toLowerCase() is "button"
      btn = qsa "button"
      expect( sameSelection flt, btn ).to.equal true

    it "accepts a jQuery selection", ->
      btn = jSel.find "button"
      flt = cSel.filter btn
      expect( sameSelection flt, btn ).to.equal true

    xit "accepts a Controls selection"

  describe "@not()", ->

    it "returns a Controls instance", ->
      expect( cSel.not "input" ).to.be.instanceof Controls

    it "accepts a selector", ->
      jNoInput = jSel.find( TAGS ).not "input"
      cNoInput = cSel.not "input"
      expect( sameSelection jNoInput, cNoInput ).to.equal true

    it "accepts an array of DOM elements", ->
      inputs = jSel.find( "input" ).get()
      cNoInput = cSel.not inputs
      hasAnInput = some cNoInput, ( el ) ->
        el.tagName.toLowerCase() is "input"
      expect( hasAnInput ).to.equal false

    it "accepts a function", ->
      cEmptyValue = cSel.not ->
        @value is ""
      vEmptyValue = filter qsa( TAGS ), ( el ) ->
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

  describe "@reset()", ->
    it "resets disabled, required, and value to their resetState", ->
      root = trees.byId "initialState"
      els = $( root )
      ctls = $( root ).controls()
      t1 = els.find( "#text1" )[0]
      t2 = els.find( "#text2" )[0]
      t3 = els.find( "#text3" )[0]
      t4 = els.find( "#text4" )[0]
      t1.value = ""
      t2.value = ""
      t2.required = false
      t3.value = ""
      t3.disabled = false
      t4.value = ""
      t4.required = false
      t4.disabled = false
      ctls.reset()
      expect( t1.value ).to.equal "one"
      expect( t2.value ).to.equal "two"
      expect( t2.required ).to.equal true
      expect( t3.value ).to.equal "three"
      expect( t3.disabled ).to.equal true
      expect( t4.value ).to.equal "four"
      expect( t4.required ).to.equal true
      expect( t4.disabled ).to.equal true

  describe "@clear()", ->
    it "clears values, checked, and selected", ->
      root = trees.byId "initialState"
      els = $( root )
      ctls = $( root ).controls()
      ctls.clear()
      expect every ctls.filter( "[type='text']" ), ( el ) ->
        el.value is ""
      .to.equal true

      expect every ctls.filter( CHECKABLE ), ( el ) ->
        el.checked is false
      .to.equal true

      expect every ctls.asJQuery().find( "option" ), ( el ) ->
        el.selected is false
      .to.equal true

  describe "@propValues()", ->

  describe "@values()", ->

  describe "@check", ->
    it "checks all checkable inputs", ->
      cSel.check()

      expect every cSel.filter( CHECKABLE ), ( el ) ->
        el.checked is true
      .to.equal true

  describe "@uncheck", ->
    it "unchecks all checkable inputs", ->

      cSel.check()
      cSel.uncheck()

      expect every cSel.filter( CHECKABLE ), ( el ) ->
        $( el ).prop( "checked" ) is false
      .to.equal true

  describe "@require", ->
    it "makes all selected controls required", ->
      cSel.require()

      expect every cSel.not( "button" ), ( el ) ->
        el.required is true
      .to.equal true

  describe "@unrequire", ->
    it "makes all selected controls not required", ->
      cSel.require()

      expect every cSel.not( "button" ), ( el ) ->
        el.required is true
      .to.equal true

      cSel.unrequire()

      expect every cSel, ( el ) ->
        el.required is false
      .to.equal true


  describe "@disable", ->
    it "makes selected controls disabled", ->
      cSel.disable()
      expect every cSel.not( "button" ), ( el ) ->
        el.disabled is true
      .to.equal true


  describe "@enable", ->
    it "makes selected controls enabled", ->
      cSel.disable()
      expect every cSel.not( "button" ), ( el ) ->
        el.disabled is true
      .to.equal true

      cSel.enable()
      expect every cSel.not( "button" ), ( el ) ->
        el.disabled is false
      .to.equal true


  describe "@labels", ->
    it "selects the labels of the controls", ->
      root = trees.byId "with-labels"
      lbls = reduce root.querySelectorAll( "input" ), ( acc, el ) ->
        if el.labels
          [].push.apply acc, slice el.labels
        acc
      , []
      expect( sameSelection $( root ).controls().labels(), lbls ).to.be.true


  describe "@valid", ->

    it "delegates to Controls.validateElement", ->
      stub = sinon.stub Controls, "validateElement"
      cSel.valid()
      expect( stub.called ).to.be.true
      stub.restore()

    it "returns true when each element passes Controls.validateElement", ->
      stub = sinon.stub Controls, "validateElement", -> true
      expect( cSel.valid() ).to.be.true
      expect( stub.callCount ).to.equal cSel.length
      stub.restore()

    it "returns false when any element fails Controls.validateElement", ->
      stub = sinon.stub Controls, "validateElement", -> false
      expect( cSel.valid() ).to.be.false
      expect( stub.callCount ).to.equal 1
      stub.restore()

  describe "@bindValidator", ->

    it ""

  return

describe "jQuery traversal methods", ->

  root = undefined
  ctls = undefined
  beforeEach ->
    root = trees.byId "values"
    ctls = $( root ).controls()

  describe "mutating methods return jQuery", ->
    methods = [
      "add"
      "addBack"
      "andSelf"
      "children"
      "closest"
      "contents"
      "end"
      "find"
      "next"
      "nextAll"
      "nextUntil"
      "offsetParent"
      "parent"
      "parents"
      "parentsUntil"
      "prev"
      "prevAll"
      "prevUntil"
      "siblings"
    ]

    methods.forEach ( method ) ->
      it "returns jQuery from @#{ method }()", ->
        selection = ctls[method]()
        expect( selection ).to.be.instanceof jQuery
        expect( selection ).to.not.be instanceof Controls

    it "returns jQuery from @map()", ->
      mapResult = ctls.map ->
      expect( mapResult ).to.be.instanceof jQuery
      expect( mapResult ).to.not.be instanceof Controls

  describe "subset methods return Controls", ->

    methods = [
      "slice"
      "first"
      "last"
      "filter"
      "not"
      "eq"
    ]

    methods.forEach ( method ) ->
      it "returns Controls from @#{ method }()", ->
        expect( ctls[method]() ).to.be.instanceof Controls

  describe "each returns Controls", ->
    it "returns Controls from @each()", ->
      expect( ctls.each( -> ) ).to.be.instanceof Controls

describe "$.fn.mixinControls", ->

  BLACKLIST = [
    "constructor",
    "filter",
    "not",
    "slice",
    "pushStack",
    "end"
  ]

  root = undefined
  ctls = undefined
  beforeEach ->
    root = trees.byId "values"
    ctls = $( root ).filter( TAGS ).mixinControls()

  it "Should have all methods from Control.prototype except the blacklisted ones", ->

    Object.getOwnPropertyNames( Controls:: ).every ( method ) ->
      if method in BLACKLIST
        ctls[method] is $.fn[method]
      else
        ctls[method] is Controls::[method]
