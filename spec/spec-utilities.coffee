module.exports =
  areSameSelection: ( jqObjA, jqObjB ) ->
    return false unless jqObjA.length is jqObjB.length
    arrA = $.unique do jqObjA.get 
    arrB = $.unique do jqObjB.get
    arrA.every ( el ) ->
      el in arrB

  

