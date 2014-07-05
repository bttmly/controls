{ slice } = require "./utils.coffee"

testEl = document.createElement "input"

html5Validation = ( inputType, value ) ->
  testEl.type = inputType
  testEl.value = value
  testEl.validity.valid

module.exports = v =

  notEmpty: ( el ) -> !!el.value

  notEmptyTrim: ( el ) -> !!el.value.trim()

  numeric: ( el ) -> /^\d+$/.test el.value

  alphanumeric: ( el ) -> /^[a-z0-9]+$/i.test el.value

  letters: ( el ) -> /^[a-z]+$/i.test el.value

  isValue: ( el, value  ) -> String( el.value ) is String( value )

  phone: ( el ) -> @allowed( "1234567890()-+# ", el )

  # .email() and .url() will throw in IE < 9 http://api.jquery.com/attr/
  email: ( el ) ->
    return false if not @notEmptyTrim( el )
    html5Validation( "email", el.value )

  url: ( el ) ->
    return false if not @notEmptyTrim( el )
    html5Validation( "url", el.value )

  list: ( el ) ->
    el.value in slice( el.list.options or [] ).map ( option ) ->
      option.value or option.innerHTML

  radio: ( el ) ->
    if ( el.name )
      return $( "input[type='radio'][name='#{ el.name }']" ).get().some ( input ) -> input.checked
    # false for unnamed elements
    else
      false

  checkbox: ( el, minChecked = 0, maxChecked = 50 ) ->
    if ( el.name )
      len = $( "input[type='checkbox'][name='#{ el.name }']" ).filter -> 
        $( this ).prop "checked"
      .length
      return minChecked <= len <= maxChecked
    # true for unnamed elements
    else
      true

  select: ( el, min = 1, max = 1 ) ->
    selected = filter el, ( opt ) -> opt.selected and not opt.disabled
    if min <= selected.length <= max then true else false

  allowed: ( el, allowedChars ) ->
      allowedChars = allowedChars.split( "" )
      str = el.value.split( "" )
      for char in str
        return false if char not in allowedChars
      return true

  notAllowed: ( el, notAllowedChars ) ->
    notAllowedChars = notAllowedChars.split( "" )
    str = el.value.split( "" )
    for char in notAllowedChars
      return false if char in str
    return true

  numberBetween: ( el, min, max ) ->
    Number( min ) <= Number( el.value ) <= Number( max )

  numberMax: ( el, max ) ->
    Number( el.value ) <= Number( max )

  numberMin: ( el, min ) ->
    Number( el.value ) >= Number( min )

  lengthBetween: ( el, min, max ) ->
    Number( min ) <= el.value.length <= Number( max )

  lengthMax: ( el, max ) ->
    el.value.length <= Number( max )

  lengthMin: ( el, min ) ->
    el.value.length >= Number( min )

  lengthIs: ( el, len ) ->
    el.value.length is Number( len )