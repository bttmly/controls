Controls = require "./controls.coffee"
$ = window.jQuery

CONTROL_TAGS = [ "input", "select", "textarea", "button" ]

module.exports = ->
  $.fn.controls = ->
    new Controls @filter CONTROL_TAGS
