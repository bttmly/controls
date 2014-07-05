demethodize: ( fn ) ->
  Function::call.bind( fn )

module.exports = 
  slice: demethodize [].slice
  reduce: demethodize [].reduce
