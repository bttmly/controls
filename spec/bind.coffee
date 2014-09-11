# adapted from the es5-polyfill bind polyfill
# https://github.com/es-shims/es5-shim/blob/master/es5-shim.js

ERROR_MESSAGE = "Function.prototype.bind called on incompatible "
slice = Array::slice

bind = ( that ) ->
  target = this
  if typeof target isnt "function"
    throw new TypeError ERROR_MESSAGE + target
  args = slice.call arguments, 1

  bound = ->
    if this instanceof bound
      F = ->
      F.prototype = target.prototype
      self = new F()
      result = target.apply self, args.concat slice.call arguments
      if Object( result ) is result
        return result
      return self
    else
      return target.apply that, args.concat slice.call arguments

  bound

module.exports = bind
