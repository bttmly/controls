validations = require "./validations.coffee"
jQuery = window.jQuery

splitMethods = ( str ) ->
  str?.split( "&&" ).map ( m ) -> m?.trim()

getMethod = ( str ) ->
  str?.split( "(" )[0]

# matches arguments 
# getArgs( "methodName( arg1, arg2 )" ) => " arg1, arg2 "
getArgs = ( str ) ->
  str?.match( /\(([^)]+)\)/ )?[ 1 ].split( "," ).map ( arg ) -> arg?.trim().replace(/'/g, "")

# this is broken right now
module.exports = ( el, customFn ) ->
  el = el[0] if el instanceof jQuery
  if customFn
    return customFn( el )
  else if ( attr = el.dataset.controlValidation )
    composed = splitMethods( attr )
    return composed.every ( str ) ->
      method = getMethod( str )
      args = getArgs( str ) or []
      sigLength = controlValidations[method].length
      args.length = if sigLength is 0 then 0 else sigLength - 1
      args.push( el )
      if method of controlValidations
        controlValidations[method].apply( null, args )
      else
        return false
  else
    el.validity.valid
      
module.exports = isValid