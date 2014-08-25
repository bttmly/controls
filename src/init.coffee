Controls = require "./controls.coffee"
mixinControls = require "./mixin.coffee"
CONTROL_TAGS = [ "input", "select", "textarea", "button" ].join ", "

module.exports = do ( $ = window.jQuery ) ->

  prevControls = $.fn.controls

  $.fn.controls = ( opt = {} )->
    method = if @length is 1 then "find" else "filter"
    new Controls @[method]( CONTROL_TAGS ), opt

  $.fn.controls.noConflict = ->
    $.fn.controls = prevControls
    @

  $.fn.mixinControls = ( opt = {} )->
    mixinControls( @, opt )

  undefined
