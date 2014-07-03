$ = jQuery = window.jQuery

propMap = ( jqCollection, keyProp, valProp ) ->
  jqCollection
  .get()
  .filter ( el ) ->
    keyProp in el
  .map ( el ) ->
    { el[key]}

class Controls extends jQuery

  constructor: ( nodes, opt = {} ) ->
    @identifyingProp = opt.idProp or "id"
    jQuery.fn.init.call @, nodes

  propValues: ( prop ) ->
    new Values propMap @, @idProp, prop

  values: ->
    @propValues "value"

  clear: ->
    @val ""

  filter: ->
    super.apply( arguments ).controls()

  without: ->
    @not jQuery.fn.filter( arguments ).get()