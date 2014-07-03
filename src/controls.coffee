Values = require "./values.coffee"
isValid = require "./is-valid.coffee"
getValue = require "./get-value.coffee"

$ = jQuery = window.jQuery
CHECKABLE_SELECTOR = "input[type='radio'], input[type='checkbox']"
reduce = Function::call.bind Array::reduce

propMap = ( jqCollection, keyProp, valProp ) ->
  reduce jqCollection, ( acc, el, i, arr ) ->
    if keyProp of el
      acc.push 
        id: el[idProp]
        value: el[valProp]
    acc
  , []

class Controls extends jQuery

  @isValid: isValid

  constructor: ( nodes, opt = {} ) ->
    @identifyingProp = opt.idProp or "id"
    jQuery.fn.init.call @, nodes
    @isValid = @valid()

    # set validity listener
    @on "change, input", =>
      isValid = @valid()
      if isValid isnt @isValid()
        if isValid then @trigger "valid" else @trigger "invalid"
        @isValid = isValid

    # set initial state data
    @each ->
      $( @ ).data "initialState",
          disabled: @prop "disabled"
          required: @prop "required"
          value: do ->
            if @is CHECKABLE_SELECTOR
              @prop "checked"
            else if @is "select"
              @find( "option:selected" )
            else if @is "input"
              @val()
            else
              null

  filter: ->
    super( arguments ).controls()

  not: ->
    super( arguments ).controls()

  propValues: ( prop ) ->
    new Values propMap @, @idProp, prop

  values: ->
    @propValues "value"

  reset: ->
    @each ->
      # reset w .data( "initialState" )
    @

  # potential performance hazard ()
  clear: ->
    @filter( "select" ).find( "option" ).removeAttr "selected" 
    @filter( CHECKABLE_SELECTOR ).removeAttr "checked" 
    @not( CHECKABLE_SELECTOR ).val "" 
    @

  valid: ->
    @get().every isValid

  bindValidator = ( fn ) ->
    # using .data() add a validation function to the element
  
  labels: ->
    reduce @, ( acc, el ) ->
      acc.add( el.labels )
    , do $

module.exports = Controls