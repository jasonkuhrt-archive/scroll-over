(function(){
  var defaults, throttle, ScrollOver, slice$ = [].slice;
  defaults = require('defaults');
  throttle = require('throttle');
  module.exports = scrollOverFactory;
  function scrollOverFactory(node){
    var rest;
    rest = slice$.call(arguments, 1);
    if (rest.length === 1) {
      rest.unshift({});
    }
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args), t;
      return (t = typeof result)  == "object" || t == "function" ? result || child : child;
  })(ScrollOver, [node].concat(slice$.call(rest)), function(){});
  }
  ScrollOver = (function(){
    ScrollOver.displayName = 'ScrollOver';
    var prototype = ScrollOver.prototype, constructor = ScrollOver;
    function ScrollOver(node, options, callback){
      this.node = node;
      this.callback = callback;
      this.refresh = bind$(this, 'refresh', prototype);
      this.options = defaults(options, {
        windowPoint: 'start',
        orientation: 'vertical',
        throttleMs: 10
      });
      this.lastCrossDirection = null;
      window.addEventListener('scroll', throttle(this.options.throttleMs, this.refresh));
      if (this.options.windowPoint !== 'start') {
        window.addEventListener('resize', throttle(this.options.throttleMs, this.refresh));
      }
      this.refresh();
    }
    prototype.refresh = function(){
      return this.cross(this.checkCross(this.calcNodeOffset(this.node, this.options.windowPoint, this.options.orientation)));
    };
    prototype.cross = function(inDirection){
      if (inDirection) {
        this.lastCrossDirection = inDirection;
        return this.callback.call(null, inDirection, this.node);
      }
    };
    prototype.checkCross = function(distanceFromWindow){
      if (distanceFromWindow < 0 && this.lastCrossDirection !== 'inward') {
        return 'inward';
      }
      if (distanceFromWindow > 0 && this.lastCrossDirection !== 'outward') {
        return 'outward';
      }
      return false;
    };
    prototype.calcNodeOffset = function(node, windowPoint, orientation){
      switch (windowPoint) {
      case 'start':
        return nodeOffset();
      case 'middle':
        return nodeOffset() - windowSize() / 2;
      case 'end':
        return nodeOffset() - windowSize();
      }
      function nodeOffset(){
        return node.getBoundingClientRect()[orientation === 'vertical' ? 'top' : 'left'];
      }
      function windowSize(){
        return window[orientation === 'vertical' ? 'innerHeight' : 'innerWidth'];
      }
      return windowSize;
    };
    return ScrollOver;
  }());
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
