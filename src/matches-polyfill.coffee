do ( Element = window.Element ) ->
  if Element
    Element::matches =
      Element::matches or
      Element::matchesSelector or
      Element::mozMatchesSelector  or
      Element::msMatchesSelector or
      Element::oMatchesSelector or
      Element::webkitMatchesSelector or
      ( selector ) ->
        nodes = ( @parentNode or @document ).querySelectorAll( selector )
        i = 0
        while i < nodes.length
          return true if nodes[i] is this
          i += 1
        return false
