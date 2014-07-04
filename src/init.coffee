Controls = require "./controls.coffee"
$ = window.jQuery

CONTROL_TAGS = [ "input", "select", "textarea", "button" ]

module.exports = do ->

  prevControls = $.fn.controls

  $.fn.controls = ->
    new Controls @filter CONTROL_TAGS

  $.fn.controls.noConflict = ->
    $.fn.controls = prevControls
    @

  undefined