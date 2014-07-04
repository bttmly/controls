slice = Function::call.bind Array::slice

module.exports = v =   
  notEmpty: ( el ) -> !!el.value

  notEmptyTrim: ( el ) -> !!el.value.trim()

  numeric: ( el ) -> /^\d+$/.test el.value

  alphanumeric: ( el ) -> /^[a-z0-9]+$/i.test el.value

  letters: ( el ) -> /^[a-z]+$/i.test el.value

  isValue: ( el, value  ) -> String( el.value ) is String( value )

  phone: ( el ) -> v.allowed( "1234567890()-+# ", el )

  email: ( el ) ->
    return false if not v.notEmptyTrim( el )
    input = document.createElement( "input" )
    input.type = "email"
    input.value = el.value
    input.validity.valid

  list: ( el ) ->
    el.value in slice( el.list.options or [] ).map ( option ) ->
      option.value or option.innerHTML

  radio: ( el ) ->
    if ( name = el.name )
      return $( "input[type='radio'][name='#{name}']" ).get().some ( input ) -> input.checked
    # won't validate unnamed radios
    else
      false

  checkbox: ( el, minChecked = 0, maxChecked = 50 ) ->
    if ( name = el.name )
      len = $( "input[type='checkbox'][name='#{name}']" ).filter -> 
        $( this ).prop "checked"
      .length
      return minChecked <= len <= maxChecked
    # will validate unnamed checkboxes
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