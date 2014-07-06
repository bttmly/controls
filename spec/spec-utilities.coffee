module.exports =
  areSameSelection: ( jqObjA, jqObjB ) ->
    return false unless jqObjA.length is jqObjB.length
    arrA = jqObjA.get()
    arrB = jqObjB.get()
    arrA.every ( el ) ->
      el in arrB

  el:
    input: ( opt = {} ) ->
      $ "<input type=#{ opt.type } value=#{ opt.value}>"

    select: ( options ) ->
      str = "<select>"
      options.forEach ( opt ) ->
        str += "<option value=#{ opt.value }>#{ opt.text }</option>"
      str += "</select>"
      $ str

    button: ( opt = {} ) ->
      $ "<button>#{ text }</button>"