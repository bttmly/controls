validations = require "./validations"

splitMethods = ( str ) ->
  str?.split( "&&" ).map ( m ) -> m?.trim()

getMethod = ( str ) ->
  str?.split( "(" )[0]

getArgs = ( str ) ->
  str?.match( /\(([^)]+)\)/ )?[ 1 ].split( "," ).map ( arg ) -> arg?.trim().replace(/'/g, "")

module.exports = ( el, customFn ) ->
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