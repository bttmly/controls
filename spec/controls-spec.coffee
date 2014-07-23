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

TAGS = [ "input", "select", "button", "textarea" ].join ", "
CHECKABLE = [ "input[type='checkbox']", "input[type='radio']" ].join ", "
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
  "./spec/html/with-initial-state.html"
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
    it "validates against all present attached validators", ->
      els = trees.byId( "validation" ).find( ".data-validation" )
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
    jSel = trees.byId( "values" )
    cSel = trees.byId( "values" ).controls()
    qsa = Element::querySelectorAll.bind( trees.byId( "values" )[0] )

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
      els = trees.byId "initialState"
      ctls = els.controls()
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
      els = trees.byId "initialState"
      ctls = els.controls()
      ctls.clear()
      expect( every ctls.filter( "[type='text']" ), ( el ) ->
        el.value is ""
      ).to.equal true
      expect( every ctls.filter( CHECKABLE ), ( el ) ->
        el.checked is false
      )
      expect( every ctls.asJQuery().find( "option" ), ( el ) ->
        el.selected is false
      )

  describe "@propValues()", ->

  describe "@values()", ->


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



describe "jQuery traversal methods", ->
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

    ctls = undefined

    beforeEach ->
      ctls = trees.byId( "values" ).controls()

    methods.forEach ( method ) ->
      it "returns jQuery from @#{ method }()", ->
        selection = ctls[method]()
        expect( selection instanceof jQuery and selection not instanceof Controls )
          .to.be.true

    it "returns jQuery from @map()", ->
      mapResult = ctls.map ->
      expect( mapResult instanceof jQuery and mapResult not instanceof Controls )
        .to.equal true

  describe "subset and non-mutating methods return Controls", ->

    methods = [
      "slice"
      "first"
      "last"
      "filter"
      "not"
      "eq"
    ]

    ctls = undefined

    beforeEach ->
      ctls = trees.byId( "values" ).controls()

    methods.forEach ( method ) ->
      it "returns Controls from @#{ method }()", ->
        expect( ctls[method]() instanceof Controls ).to.be.true

    it "returns Controls from @each()", ->
      expect( ctls.each( -> ) instanceof Controls ).to.be.true