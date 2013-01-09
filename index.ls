


require! defaults
require! throttle

module.exports = scroll-over-factory



# @signatures
#     node      options  callback
# 1.  <DOMNode> <Object> <Function> -> ScrollOver
#
#    node      callback
# 2. <DOMNode> <Function> -> ScrollOver


# @param  node          <DOMNode>
# @param  options       <Object>
#         windowPoint:  <String> start | middle | end
#         orientation:  <String> vertical | horizontal
#         throttleMs:   <Number>
# @param  callback      <Function>

function scroll-over-factory(node, ...rest)
  rest.unshift({}) if rest.length is 1
  new ScrollOver(node, ...rest)



class ScrollOver

  (@node, options, @callback)->
    @options = defaults options, { window-point:\start, orientation:\vertical, throttle-ms:10 }
    @last-cross-direction = null

    window.add-event-listener \scroll, throttle(@options.throttle-ms, @refresh)
    if @options.window-point isnt \start
      window.add-event-listener \resize, throttle(@options.throttle-ms, @refresh)

    @refresh!



  refresh: ~>
    @cross @check-cross @calc-node-offset(@node, @options.window-point, @options.orientation)



  cross: (in-direction)->
    if in-direction
      @last-cross-direction = in-direction
      @callback.call null, in-direction, @node




  check-cross: (distance-from-window)->
    if distance-from-window < 0 and @last-cross-direction isnt \inward  then return \inward
    if distance-from-window > 0 and @last-cross-direction isnt \outward then return \outward
    return no



  calc-node-offset: (node, window-point, orientation)->
    switch window-point
    when \start   then return node-offset!
    when \middle  then return node-offset! - (window-size! / 2)
    when \end     then return node-offset! - window-size!
    else # undefined, shouldn't happen, keyword assertion made during instantiation

    function node-offset
      node.getBoundingClientRect![(if orientation is \vertical then \top else \left)]

    function window-size
      window[(if orientation is \vertical then \innerHeight else \innerWidth)]
