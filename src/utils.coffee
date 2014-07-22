demethodize = ( fn ) ->
  Function::call.bind( fn )

module.exports = 
  map: demethodize [].map
  slice: demethodize [].slice
  reduce: demethodize [].reduce
  objMap: ( obj, callback ) ->
    result = {}
    for key, value of obj
      result[key] = callback value, key, obj
    result
