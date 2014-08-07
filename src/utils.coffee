demethodize = ( method ) ->
  Function::call.bind method

arrayMethods = [
  "map"
  "some"
  "every"
  "slice"
  "filter"
  "reduce"
  "forEach"
]

utils =
  objMap: ( obj, callback ) ->
    result = {}
    for key, value of obj
      result[key] = callback value, key, obj
    result


arrayMethods.forEach ( method ) ->
  utils[method] = demethodize Array::[method]

utils.each = utils.forEach

module.exports = utils
