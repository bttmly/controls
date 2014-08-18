do ( Element = window.Element ) ->
  if Element
    Element::matches =
      Element::matches or
      Element::matchesSelector or
      Element::oMatchesSelector or
      Element::msMatchesSelector or
      Element::mozMatchesSelector or
      Element::webkitMatchesSelector or
      ( selector ) ->
        nodes = ( @parentNode or @document ).querySelectorAll( selector )
        ( return true if node is this ) for node in nodes
        return false
