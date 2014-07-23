require "./matches-polyfill.coffee"
Values = require "./values.coffee"
isValid = require "./is-valid.coffee"
getValue = require( "./get-value.coffee" ).getValueMappable
{ map, reduce, each, every } = require "./utils.coffee"

$ = jQuery = window.jQuery
CHECKABLE = "input[type='radio'], input[type='checkbox']"
BUTTON = "input[type='button'], button"
TAGS = "input, select, button, textarea"

# qsa = ( selector, context = document ) ->
#   [].slice.call context.querySelectorAll selector

propMap = ( jqCollection, keyProp, valProp ) ->
  jqCollection.get().reduce ( acc, el, i, arr ) ->
    if keyProp of el
      acc.push
        id: el[idProp]
        value: el[valProp]
    acc
  , []

class Controls extends jQuery

  @validateElement = isValid

  # maybe we should filter for control tags in here.
  constructor: ( nodes, opt = {} ) ->
    unless @ instanceof Controls and nodes
      return new Controls $ ""
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
      $.data @, "resetState",
        disabled: @disabled
        required: @required
        value: do =>
          if @matches CHECKABLE
            @checked
          else if @matches "select"
            reduce @querySelectorAll( "option" ), ( acc, el ) ->
              if el.selected is true
                acc.push el.value or el.innerHTML
              acc
            , []
          else if @matches "input"
            @value
          else
            null
      
  filter: ( param ) ->
    $.fn.filter.call( @, param )
    # @asJQuery().filter( param ).controls()

  not: ( param ) ->
    $.fn.not.call( @, param )
    # @asJQuery().not( param ).controls()

  propValues: ( prop ) ->
    new Values propMap @, @idProp, prop

  values: ->
    new Values @get().map getValue

  reset: ->
    @each ->
      data = $.data( @, "resetState" )
      @required = data.required
      @disabled = data.disabled
      if @matches CHECKABLE
        @checked = data.value
      else if @matches "select"
        each @querySelectorAll( "option" ), ( el ) =>
          if el.value in data.value
            el.selected = true
      else if @matches "input"
        @value = data.value
    @

  clear: ->
    @filter( "select" ).find( "option" ).removeAttr "selected"
    @filter( CHECKABLE ).removeAttr "checked"
    @not( CHECKABLE ).val ""
    @

  # common attr convenience methods
  check: -> @attr "checked", "checked"
  uncheck: -> @removeAttr "checked"
  require: -> @attr "required", "required"
  unrequire: -> @removeAttr "required"
  disable: -> @attr "disabled", "disabled"
  enable: -> @removeAttr "disabled"

  # common filter convenience methods
  buttons: -> @filter "button"
  inputs: -> @filter "input"
  selects: -> @filter "select"
  ofType: ( type ) -> @filter "[type=#{ type }]"

  valid: -> every @, isValid

  bindValidator: ( fn ) ->
  
  labels: ->
    reduce @, ( acc, el ) ->
      acc.add( el.labels )
    , do $

  asJQuery: ->
    $ @get()

module.exports = Controls