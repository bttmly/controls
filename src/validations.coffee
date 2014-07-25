{ slice } = require "./utils.coffee"
{ CHECK, RADIO } = require "./selectors.coffee"

$ = jQuery = window.jQuery
document = window.document

html5Validation = do ->
  testEl = document.createElement "input"
  ( inputType, value ) ->
    testEl.type = inputType
    testEl.value = value
    testEl.required = true
    testEl.validity.valid

module.exports = v =

  notEmpty: -> !!@value

  notEmptyTrim: -> !!@value.trim()

  numeric: -> /^\d+$/.test @value

  alphanumeric: -> /^[a-z0-9]+$/i.test @value

  letters: -> /^[a-z]+$/i.test @value

  isValue: ( value  ) -> String( @value ) is String( value )

  phone: -> v.allowed.call @, "1234567890()-+# "

  # .email() and .url() will throw in IE < 9 http://api.jquery.com/attr/
  email: ->
    return false if not v.notEmptyTrim @
    html5Validation( "email", @value )

  url: ->
    return false if not v.notEmptyTrim @
    html5Validation( "url", @value )

  list: ->
    @value in slice( @list.options or [] ).map ( option ) ->
      option.value or option.innerHTML

  radio: ->
    if ( @name )
      $( "#{ RADIO }[name='#{ @name }']" ).get()
        .some ( input ) -> input.checked
    # false for unnamed elements
    else
      false

  checkbox: ( minChecked = 0, maxChecked = 50 ) ->
    if ( @name )
      len = $( "#{ CHECK }[name='#{ @name }']" ).filter -> 
        $( this ).prop "checked"
      .length
      minChecked <= len <= maxChecked
    # true for unnamed elements
    else
      true

  select: ( min = 1, max = 1 ) ->
    selected = filter @ ( opt ) -> opt.selected and not opt.disabled
    if min <= selected.length <= max then true else false

  allowed: ( allowedChars ) ->
    allowedChars = allowedChars.split ""
    str = @value.split ""
    for char in str
      return false if char not in allowedChars
    return true

  notAllowed: ( notAllowedChars ) ->
    notAllowedChars = notAllowedChars.split ""
    str = @value.split ""
    for char in notAllowedChars
      return false if char in str
    return true

  numberBetween: ( min, max ) ->
    Number( min ) <= Number( @value ) <= Number( max )

  numberMax: ( max ) ->
    Number( @value ) <= Number( max )

  numberMin: ( min ) ->
    Number( @value ) >= Number( min )

  lengthBetween: ( min, max ) ->
    Number( min ) <= @value.length <= Number( max )

  lengthMax: ( max ) ->
    @value.length <= Number( max )

  lengthMin: ( min ) ->
    @value.length >= Number( min )

  lengthIs: ( len ) ->
    @value.length is Number( len )