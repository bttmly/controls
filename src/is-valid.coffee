validations = require "./validations.coffee"
{ jQuery } = window

callOn = ( obj, fn ) ->
  fn.call( obj )

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
      arg?.trim().replace /'/g, ""

isValid = ( el, customFn, args... ) ->
  $el = jQuery( el )
  validationAttr = $el.data "control-validation"
  validationFns = jQuery.data el, "controlValidators"

  if customFn and typeof customFn is "function"
    return !!customFn.apply( el, args )

  else if validationFns?.length
    return validationFns.every callOn.bind( null, el )

  else if validationAttr
    validators = splitMethods( validationAttr ).map ( fnCallStr ) ->
      method: getMethod( fnCallStr )
      args: getArgs( fnCallStr )
    return validators.every ( callDesc ) ->
      return false unless "method" of callDesc
      validations[callDesc.method].apply el, args

  else
    return el.validity?.valid

module.exports = isValid
