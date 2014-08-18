page = require( "webpage" ).create()

startTime = null

# in ms
minute = 60 * 1000

getTests = ( suite, tests ) ->
  tests or= []
  [].push.apply tests, suite.tests
  if suite?.suites?.length
    for suite in suite.suites
      getTests( suite, tests )
  tests

getPasses = ->
  page.evaluate ->
    Number document.querySelector( ".passes em" ).innerHTML

getFails = ->
  page.evaluate ->
    Number document.querySelector( ".failures em" ).innerHTML

totalTests = ->
  page.evaluate ->

      getTests = ( suite, tests ) ->
        tests or= []
        [].push.apply tests, suite.tests
        if suite?.suites?.length
          for suite in suite.suites
            getTests( suite, tests )
        tests

    getTests( mocha.suite ).length

isOk = -> getFails() is 0

isDone = ->
  page.evaluate ->
    mocha.suite.pending is false

waitUntilDone = ->
  if isDone()
      console.log "#{ getPasses() } tests passing."
      console.log "#{ getFails() } tests failing."
    if isOk()
      console.log "Success!"
      phantom.exit()
    else
      console.log "Failed."
      phantom.exit 1
  else
    if Date.now() - startTime > minute
      console.log "Specs timed out"
      phantom.exit 1
    else
      console.log "reset"
      setTimeout waitUntilDone, 10

page.open 'http://localhost:3000/', ( status ) ->
  startTime = Date.now()
  if status is 'success'
    setTimeout waitUntilDone, 1000
  else
    phantom.exit 1
