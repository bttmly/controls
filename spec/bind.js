(function() {
  var ERROR_MESSAGE, bind, slice;

  ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";

  slice = Array.prototype.slice;

  bind = function(that) {
    var args, bound, target;
    target = this;
    if (typeof target !== "function") {
      throw new TypeError(ERROR_MESSAGE + target);
    }
    args = slice.call(arguments, 1);
    bound = function() {
      var F, result, self;
      if (this instanceof bound) {
        F = function() {};
        F.prototype = target.prototype;
        self = new F();
        result = target.apply(self, args.concat(slice.call(arguments)));
        if (Object(result) === result) {
          return result;
        }
        return self;
      } else {
        return target.apply(that, args.concat(slice.call(arguments)));
      }
    };
    return bound;
  };

  Function.prototype.bind = Function.prototype.bind || bind;

})();
