Controls = require "./controls.coffee"
$ = window.jQuery

CONTROL_TAGS = [ "input", "select", "textarea", "button" ]

module.exports = do ->

  prevControls = $.fn.controls

  $.fn.controls = ->
    new Controls @find CONTROL_TAGS.join ", "

  $.fn.controls.noConflict = ->
    $.fn.controls = prevControls
    @

  undefined