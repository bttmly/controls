class Values extends Array
  constructor: ( items ) ->
    throw new TypeError() unless Array.isArray items
    @push.apply @, items

  normal: ->
    [].concat @

  valueArray: ->
    @map ( pair ) -> pair.value

  idArray: ->
    @map ( pair ) -> pair.id

  idValuePair: ->
    @reduce ( obj, pair ) ->
      obj[ pair.id ] = pair.value
      obj
    , {}

  valueString: ( delimiter = ", " ) ->
    @valueArray().join( delimiter )

  valueArrayOne: ->
    values = @valueArray()
    if values.length > 1 then values else values[0]

  idArrayOne: ->
    values = @idArray()
    if values.length > 1 then values else values[0]

  at: ( i ) ->
    if isNaN Number i
      @idValuePair()[i]
    else
      @[i].value

  first: ->
    @at 0

  last: ->
    @at @length - 1

  serialize: -> JSON.stringify @normal()


module.exports = Values
