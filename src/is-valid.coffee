validations = require "./validations.coffee"
$ = jQuery = window.jQuery

# matches method calls
# splitMethods( "lengthMin( 8 ) && lengthMax( 12 )" ) => ["lengthMin( 8 )", "lengthMax( 12 )"]
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

isValid = ( el, customFn ) ->
  $el = $( el )
  validationAttr = $el.data "control-validation"
  validationFns = $el.data "validators"
  if customFn and typeof customFn is "function"
    console.log "a"
    return !!customFn el
  else if validationFns
    console.log "b"
    return validationFns.every ( fn ) ->
      fn( el )
  else if validationAttr
    console.log "c"
    validations = splitMethods( validationAttr ).map ( fnCallStr ) ->
      obj = {}
      obj.method = getMethod( fnCallStr )
      obj.args = getArgs( fnCallStr )
      obj
    return validations.every ( callDesc ) ->
      return false unless callDesc.method of validations
      validations[callDesc.method].apply null, [ el ].concat callDesc.args
  else
    console.log "d"
    return el.validity.valid
      
module.exports = isValid