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

module.exports = mixin = ( obj, opt ) ->
  console.log obj instanceof jQuery
  # unless obj instanceof $
  #   throw new TypeError "Controls mixin expects a jQuery selection"
  Object.getOwnPropertyNames( Controls:: ).forEach ( method ) ->
    obj[method] = Controls::[method] unless method in BLACKLIST
  obj
