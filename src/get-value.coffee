$ = window.jQuery

CHECKABLE = "input[type='checkbox'], input[type='radio']"
SELECTED = ":selected:not(:disabled)"
BUTTON = "input[type='button'], button"

getValue = ( el ) ->
  $el = $( el )
  if $el.is BUTTON
    null
  else if $el.is CHECKABLE
    if el.checked then el.value else null
  else if $el.is "select"
    $el.find( SELECTED ).map ( el ) ->
      el.value or el.innerHTML or null
  else
    el.value or null

module.exports = getValue