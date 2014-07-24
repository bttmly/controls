demethodize = ( method ) ->
  Function::call.bind method

module.exports =
  each: demethodize Array::forEach
  map: demethodize Array::map
  reduce: demethodize Array::reduce
  filter: demethodize Array::filter
  every: demethodize Array::every
  some: demethodize Array::some
  slice: demethodize Array::slice