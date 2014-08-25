require "./matches-polyfill.coffee"
Values = require "./values.coffee"
isValid = require "./is-valid.coffee"
getValue = require( "./get-value.coffee" ).getValueMappable
{ map, reduce, each, every, slice } = require "./utils.coffee"
{ CHECKABLE, BUTTON, TAGS } = require "./selectors.coffee"

jQuery = window.jQuery

propMap = ( jqCollection, keyProp, valProp ) ->
  jqCollection.get().reduce ( acc, el, i, arr ) ->
    if keyProp of el
      acc.push
        id: el[idProp]
        value: el[valProp]
    acc
  , []

getControlNodes = ( nodes ) ->
  reduce nodes, ( acc, node ) ->
    if node.matches TAGS
      # acc.concat node
      acc.push node
    else
      # acc.concat slice node.querySelectorAll TAGS
      [].push.apply slice node.querySelectorAll TAGS
    acc
  , []

validityListener = ( evt ) ->
  isValid = @valid()
  if isValid isnt @isValid()
    if isValid then @trigger "valid" else @trigger "invalid"
    @isValid = isValid


class Controls extends jQuery

  @validateElement = isValid

  # maybe we should filter for control tags in here.
  constructor: ( nodes = "", opt = {} ) ->
    unless @ instanceof Controls
      return new Controls jQuery nodes
    jQuery.fn.init.call @, getControlNodes nodes
    @_controlsInit opt

  _controlsInit: ( opt ) ->
    @identifyingProp = opt.idProp or "id"
    @isValid = @valid()

    @_validityListener = validityListener.bind @

    # set validity listener
    unless opt.noAutoValidate
      @startValidListening()

    # set base state for .reset()
    unless opt.noResetState
      @setResetState()

  startValidListening: ->
    @on "change, input", @_validityListener

  stopValidListening: ->
    @off "change, input", @_validityListener

  setResetState: ->
    @each ( i, el ) ->
      jQuery.data @, "resetState",
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
    jQuery.fn.filter.call( @, param ).controls()

  not: ( param ) ->
    jQuery.fn.not.call( @, param ).controls()

  propValues: ( prop ) ->
    new Values propMap @, @idProp, prop

  values: ->
    new Values @get().map getValue

  reset: ->
    @each ->
      data = jQuery.data @, "resetState"
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

  # adapted from space-pen
  pushStack: ( elems ) ->
    ret = jQuery.merge jQuery(), elems
    ret.prevObject = @
    ret.context = @context
    ret

  # adapted from space-pen
  end: ->
    @prevObject ? jQuery null

  # common attr convenience methods

  # TODO: Check for preferred jQuery way to do this
  #
  # check: -> @prop "checked", true
  # uncheck: -> @prop "checked", false
  # require: -> @prop "required", true
  # unrequire: -> @prop "required", false
  # disable: -> @prop "disabled", true
  # enable: -> @prop "disabled", false
  check: -> @attr "checked", true
  uncheck: -> @removeAttr "checked"
  require: -> @attr "required", true
  unrequire: -> @removeAttr "required"
  disable: -> @attr "disabled", true
  enable: -> @removeAttr "disabled"

  # common filter convenience methods
  buttons: -> @filter "button"
  inputs: -> @filter "input"
  selects: -> @filter "select"
  ofType: ( type ) -> @filter "[type=#{ type }]"

  valid: -> every @, Controls.validateElement

  bindValidator: ( fn ) ->

  labels: ->
    reduce @, ( acc, el ) ->
      acc.add( el.labels )
    , do jQuery

  asJQuery: -> jQuery @get()

  slice: -> jQuery.fn.slice.apply( @, arguments ).controls()
  eq: ( i ) ->  @slice i, 1
  first: -> @eq 0
  last: -> @eq @length - 1

module.exports = Controls
