module.exports = class Values extends Array
  constructor: ( items ) ->
    throw new TypeError( "Values constructor requires an array" ) unless Array.isArray items
    @push.apply @, items

  normal: ->
    @map ( obj ) ->
      id: obj.id
      value: obj.value

  valueArray: ->
    @map ( obj ) -> obj.value

  idArray: ->
    @map ( obj ) -> obj.id

  idValueMap: ->
    @reduce ( acc, obj ) ->
      acc[ obj.id ] = obj.value
      acc
    , {}

  valueString: ( delimiter = ", " ) ->
    @valueArray().join delimiter

  valueArrayOne: ->
    result = @valueArray()
    if result.length > 1 then result else result[0]

  idArrayOne: ->
    result = @idArray()
    if result.length > 1 then result else result[0]

  at: ( i ) ->
    if isNaN Number i
      for obj in @
        return obj if obj.id is i
    else
      return @[i].value

  first: -> @at 0

  last: -> @at @length - 1

  serialize: -> JSON.stringify @normal()
