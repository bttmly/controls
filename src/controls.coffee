Values = require "./values.coffee"
isValid = require "./is-valid.coffee"
getValue = require( "./get-value.coffee" ).getValueMappable
{ map, reduce } = require "./utils.coffee"

$ = jQuery = window.jQuery
CHECKABLE = "input[type='radio'], input[type='checkbox']"
BUTTON = "input[type='button'], button"

propMap = ( jqCollection, keyProp, valProp ) ->
  jqCollection.get().reduce ( acc, el, i, arr ) ->
    if keyProp of el
      acc.push 
        id: el[idProp]
        value: el[valProp]
    acc
  , []

class Controls extends jQuery

  @isValid: isValid

  # maybe we should filter for control tags in here.
  constructor: ( nodes, opt = {} ) ->
    jQuery.fn.init.call @, nodes
    @identifyingProp = opt.idProp or "id"
    @isValid = @valid()

    # set validity listener
    @on "change, input", =>
      isValid = @valid()
      if isValid isnt @isValid()
        if isValid then @trigger "valid" else @trigger "invalid"
        @isValid = isValid

    # set initial state data
    # refer to jq attr/prop to make this easier
    @each ( i, el ) ->
      ( -> 
        @data "initialValue", 
          disabled: @prop "disabled"
          required: @prop "required"
          value: do =>
            if @is CHECKABLE
              @prop "checked"
            else if @is "select"
              @find( "option:selected" ).get().map ( el ) ->
                el.value || el.innerHTML
            else if @is "input"
              @val()
            else
              null
      ).call $ el
  filter: ->
    super( arguments ).controls()

  not: ->
    super( arguments ).controls()

  propValues: ( prop ) ->
    new Values propMap @, @idProp, prop

  values: ->
    new Values @get().map getValue

  reset: ->
    @each ->
      # reset w .data( "initialState" )
    @

  clear: ->
    @filter( "select" ).find( "option" ).removeAttr "selected" 
    @filter( CHECKABLE ).removeAttr "checked" 
    @not( CHECKABLE ).val "" 
    @

  check: -> @attr "checked", "checked"
  uncheck: -> @removeAttr "checked"
  require: -> @attr "required", "required"
  unrequire: -> @removeAttr "required"
  disable: -> @attr "disabled", "disabled"
  enable: -> @removeAttr "disabled"

  valid: ->
    @get().every isValid

  bindValidator = ( fn ) ->
    
    # using .data() add a validation function to the element
  
  labels: ->
    reduce @, ( acc, el ) ->
      acc.add( el.labels )
    , do $

module.exports = Controls