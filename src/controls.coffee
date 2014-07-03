Values = require "./values"
isValid = require "./is-valid"

$ = jQuery = window.jQuery

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
    @on "change", ( evt ) =>
      isValid = @valid()
      if isValid isnt @isValid()
        if isValid then @trigger "valid" else @trigger "invalid"
        @isValid = isValid

  propValues: ( prop ) ->
    new Values propMap @, @idProp, prop

  values: ->
    @propValues "value"

  clear: ->
    @val ""

  filter: ->
    super( arguments ).controls()

  without: ->
    @not @filter( arguments ).get()

  valid: ->
    @get().every isValid


module.exports = Controls