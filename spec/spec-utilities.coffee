module.exports =
  areSameSelection: ( objA, objB ) ->
    return false unless objA.length is objB.length
    slice = Function::call.bind Array::slice
    arrA = $.unique slice objA
    arrB = $.unique slice objB
    arrA.every ( el ) ->
      el in arrB

  

