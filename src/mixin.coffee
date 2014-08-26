$ = jQuery = window.jQuery
Controls = require "./controls.coffee"

BLACKLIST = [
  "constructor",
  "filter",
  "not",
  "slice",
  "pushStack",
  "end"
]

{ TAGS } = require "./selectors.coffee"

# make sure only contains CONTROLS

isControl = ( el ) -> $( el ).is TAGS

module.exports = mixin = ( obj, opt = {} ) ->
  unless obj instanceof $
    throw new TypeError "Controls mixin expects a jQuery selection"
  unless [].every.call obj, isControl
    throw new TypeError """
      All elements in the collection must be
      button, input, select, or textarea
    """
  Object.getOwnPropertyNames( Controls:: ).forEach ( method ) ->
    obj[method] = Controls::[method] unless method in BLACKLIST
  obj._controlsInit( opt )
  obj
