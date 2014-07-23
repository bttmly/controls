validations = require "./validations.coffee"
$ = jQuery = window.jQuery

# matches method calls
# splitMethods( "lengthMin( 8 ) && lengthMax( 12 )" ) =>
# ["lengthMin( 8 )", "lengthMax( 12 )"]
splitMethods = ( str ) ->
  str?.split( "&&" ).map ( m ) -> m?.trim()

# gets method names
# getMethod( "lengthMin( 8 )" ) => "lengthMin"
getMethod = ( str ) ->
  str?.split( "(" )[0]

# gets arguments
# getArgs( "methodName( arg1, arg2 )" ) => ["arg1", "arg2"]
getArgs = ( str ) ->
  str?.match( /\(([^)]+)\)/ )?[ 1 ]
    .split ","
    .map ( arg ) ->
      arg?.trim().replace(/'/g, "")

isValid = ( el, customFn, args... ) ->
  $el = $( el )
  validationAttr = $el.data "control-validation"
  validationFns = $el.data "validators"
  if customFn and typeof customFn is "function"
    return !!customFn.apply( el, args )
  else if validationFns
    return validationFns.every ( fn ) ->
      fn( el )
  else if validationAttr
    validators = splitMethods( validationAttr ).map ( fnCallStr ) ->
      method: getMethod( fnCallStr )
      args: getArgs( fnCallStr )
    return validators.every ( callDesc ) ->
      return false unless "method" of callDesc
      validations[callDesc.method].apply el, args
  else
    return el.validity.valid
      
module.exports = isValid