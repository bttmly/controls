demethodize = ( method ) ->
  Function::call.bind method

module.exports =
  map: demethodize Array::map
  some: demethodize Array::some
  every: demethodize Array::every
  slice: demethodize Array::slice
  each: demethodize Array::forEach
  reduce: demethodize Array::reduce
  filter: demethodize Array::filter
