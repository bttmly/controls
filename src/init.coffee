Controls = require "./controls.coffee"
$ = window.jQuery

CONTROL_TAGS = [ "input", "select", "textarea", "button" ].join ", "

module.exports = do ->

  prevControls = $.fn.controls

  $.fn.controls = ( opt = {} )->
    method = if @length is 1 then "find" else "filter"
    new Controls @[method]( CONTROL_TAGS ), opt

  $.fn.controls.noConflict = ->
    $.fn.controls = prevControls
    @

  undefined