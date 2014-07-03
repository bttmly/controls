$ = window.jQuery

module.exports = ( el ) ->
  $el = $( el )
  if $el.is "[type='checkbox'], [type='radio']"
    if el.checked then el.value else null
  else if $el.is "select"
    $el
    .find( "option:selected" )
    .not( ":disabled" )
    .get()
    .map ( el ) ->
      el.value or el.innerHTML
  else if $el.is "input"
    el.value or null
  else
    null