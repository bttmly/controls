Values = require "./values"
isValid = require "./is-valid"
getValue = require "./get-value"

$ = jQuery = window.jQuery
CHECKABLE_SELECTOR = "input[type='radio'], input[type='checkbox']"

propMap = ( jqCollection, keyProp, valProp ) ->
  jqCollection
  .get()
  # use reduce to avoid filter() and map()
  .reduce ( acc, el, i, arr ) ->
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
      if @is CHECKABLE_SELECTOR

      else if @is "select"

      else if @is "input"
    @

  clear: ->
    @filter( "select" ).find( "option" ).removeAttr "selected" 
    @filter( CHECKABLE_SELECTOR ).removeAttr "checked" 
    @not( CHECKABLE_SELECTOR ).val "" 
    @



  valid: ->
    @get().every isValid


module.exports = Controls