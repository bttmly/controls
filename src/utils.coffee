demethodize = ( fn ) ->
  Function::call.bind( fn )

module.exports =
  map: demethodize Array::map
  slice: demethodize Array::slice
  reduce: demethodize Array::reduce
  objMap: ( obj, callback ) ->
    result = {}
    for key, value of obj
      result[key] = callback value, key, obj
    result
