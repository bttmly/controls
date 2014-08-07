slice = Function::call.bind Array::slice

module.exports =
  sameSelection: ( objA, objB ) ->
    return false unless objA.length is objB.length
    arrA = $.unique slice objA
    arrB = $.unique slice objB
    arrA.every ( el ) ->
      el in arrB



