class ValueObject extends Array
  constructor: ( arr ) ->
    if Array.isArray arr
      @push item for item in arr
    else
      throw new TypeError( "Pass an array to the ValueObject constructor!" )

  normal: ->
    [].concat @

  valueArray: ->
    @map ( pair ) -> pair.value

  idArray: ->
    @map ( pair ) -> pair.id

  idValuePair: ->
    pairs = {}
    pairs[ pair.id ] = pair.value for pair in @
    pairs

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


module.exports = ValueObject