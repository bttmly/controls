(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, CHECKABLE_SELECTOR, Controls, Values, getValue, isValid, jQuery, propMap, reduce,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Values = require("./values.coffee");

isValid = require("./is-valid.coffee");

getValue = require("./get-value.coffee");

$ = jQuery = window.jQuery;

CHECKABLE_SELECTOR = "input[type='radio'], input[type='checkbox']";

reduce = Function.prototype.call.bind(Array.prototype.reduce);

propMap = function(jqCollection, keyProp, valProp) {
  return reduce(jqCollection, function(acc, el, i, arr) {
    if (keyProp in el) {
      acc.push({
        id: el[idProp],
        value: el[valProp]
      });
    }
    return acc;
  }, []);
};

Controls = (function(_super) {
  var bindValidator;

  __extends(Controls, _super);

  Controls.isValid = isValid;

  function Controls(nodes, opt) {
    if (opt == null) {
      opt = {};
    }
    this.identifyingProp = opt.idProp || "id";
    jQuery.fn.init.call(this, nodes);
    this.isValid = this.valid();
    this.on("change, input", (function(_this) {
      return function() {
        isValid = _this.valid();
        if (isValid !== _this.isValid()) {
          if (isValid) {
            _this.trigger("valid");
          } else {
            _this.trigger("invalid");
          }
          return _this.isValid = isValid;
        }
      };
    })(this));
    this.each(function() {
      return $(this).data("initialState", {
        disabled: this.prop("disabled"),
        required: this.prop("required"),
        value: (function() {
          if (this.is(CHECKABLE_SELECTOR)) {
            return this.prop("checked");
          } else if (this.is("select")) {
            return this.find("option:selected");
          } else if (this.is("input")) {
            return this.val();
          } else {
            return null;
          }
        })()
      });
    });
  }

  Controls.prototype.filter = function() {
    return Controls.__super__.filter.call(this, arguments).controls();
  };

  Controls.prototype.not = function() {
    return Controls.__super__.not.call(this, arguments).controls();
  };

  Controls.prototype.propValues = function(prop) {
    return new Values(propMap(this, this.idProp, prop));
  };

  Controls.prototype.values = function() {
    return this.propValues("value");
  };

  Controls.prototype.reset = function() {
    this.each(function() {});
    return this;
  };

  Controls.prototype.clear = function() {
    this.filter("select").find("option").removeAttr("selected");
    this.filter(CHECKABLE_SELECTOR).removeAttr("checked");
    this.not(CHECKABLE_SELECTOR).val("");
    return this;
  };

  Controls.prototype.valid = function() {
    return this.get().every(isValid);
  };

  bindValidator = function(fn) {};

  Controls.prototype.labels = function() {
    return reduce(this, function(acc, el) {
      return acc.add(el.labels);
    }, $());
  };

  return Controls;

})(jQuery);

module.exports = Controls;


},{"./get-value.coffee":2,"./is-valid.coffee":4,"./values.coffee":7}],2:[function(require,module,exports){
var $;

$ = window.jQuery;

module.exports = function(el) {
  var $el;
  $el = $(el);
  if ($el.is("[type='checkbox'], [type='radio']")) {
    if (el.checked) {
      return el.value;
    } else {
      return null;
    }
  } else if ($el.is("select")) {
    return $el.find("option:selected").not(":disabled").get().map(function(el) {
      return el.value || el.innerHTML;
    });
  } else if ($el.is("input")) {
    return el.value || null;
  } else {
    return null;
  }
};


},{}],3:[function(require,module,exports){
var $, CONTROL_TAGS, Controls;

Controls = require("./controls.coffee");

$ = window.jQuery;

CONTROL_TAGS = ["input", "select", "textarea", "button"];

module.exports = (function() {
  var prevControls;
  prevControls = $.fn.controls;
  $.fn.controls = function() {
    return new Controls(this.filter(CONTROL_TAGS));
  };
  $.fn.controls.noConflict = function() {
    $.fn.controls = prevControls;
    return this;
  };
  return void 0;
})();


},{"./controls.coffee":1}],4:[function(require,module,exports){
var getArgs, getMethod, jQuery, splitMethods, validations;

validations = require("./validations.coffee");

jQuery = window.jQuery;

splitMethods = function(str) {
  return str != null ? str.split("&&").map(function(m) {
    return m != null ? m.trim() : void 0;
  }) : void 0;
};

getMethod = function(str) {
  return str != null ? str.split("(")[0] : void 0;
};

getArgs = function(str) {
  var _ref;
  return str != null ? (_ref = str.match(/\(([^)]+)\)/)) != null ? _ref[1].split(",").map(function(arg) {
    return arg != null ? arg.trim().replace(/'/g, "") : void 0;
  }) : void 0 : void 0;
};

module.exports = function(el, customFn) {
  var attr, composed;
  if (el instanceof jQuery) {
    el = el[0];
  }
  if (customFn) {
    return customFn(el);
  } else if ((attr = el.dataset.controlValidation)) {
    composed = splitMethods(attr);
    return composed.every(function(str) {
      var args, method, sigLength;
      method = getMethod(str);
      args = getArgs(str) || [];
      sigLength = controlValidations[method].length;
      args.length = sigLength === 0 ? 0 : sigLength - 1;
      args.push(el);
      if (method in controlValidations) {
        return controlValidations[method].apply(null, args);
      } else {
        return false;
      }
    });
  } else {
    return el.validity.valid;
  }
};

module.exports = isValid;


},{"./validations.coffee":6}],5:[function(require,module,exports){
module.exports = (function() {
  require("./init.coffee");
  return {
    Controls: require("./controls.coffee"),
    Values: require("./values.coffee")
  };
})();


},{"./controls.coffee":1,"./init.coffee":3,"./values.coffee":7}],6:[function(require,module,exports){
var slice, v,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

slice = Function.prototype.call.bind(Array.prototype.slice);

module.exports = v = {
  notEmpty: function(el) {
    return !!el.value;
  },
  notEmptyTrim: function(el) {
    return !!el.value.trim();
  },
  numeric: function(el) {
    return /^\d+$/.test(el.value);
  },
  alphanumeric: function(el) {
    return /^[a-z0-9]+$/i.test(el.value);
  },
  letters: function(el) {
    return /^[a-z]+$/i.test(el.value);
  },
  isValue: function(el, value) {
    return String(el.value) === String(value);
  },
  phone: function(el) {
    return v.allowed("1234567890()-+# ", el);
  },
  email: function(el) {
    var input;
    if (!v.notEmptyTrim(el)) {
      return false;
    }
    input = document.createElement("input");
    input.type = "email";
    input.value = el.value;
    return input.validity.valid;
  },
  list: function(el) {
    var _ref;
    return _ref = el.value, __indexOf.call(slice(el.list.options || []).map(function(option) {
      return option.value || option.innerHTML;
    }), _ref) >= 0;
  },
  radio: function(el) {
    var name;
    if ((name = el.name)) {
      return $("input[type='radio'][name='" + name + "']").get().some(function(input) {
        return input.checked;
      });
    } else {
      return false;
    }
  },
  checkbox: function(el, minChecked, maxChecked) {
    var len, name;
    if (minChecked == null) {
      minChecked = 0;
    }
    if (maxChecked == null) {
      maxChecked = 50;
    }
    if ((name = el.name)) {
      len = $("input[type='checkbox'][name='" + name + "']").filter(function() {
        return $(this).prop("checked");
      }).length;
      return (minChecked <= len && len <= maxChecked);
    } else {
      return true;
    }
  },
  select: function(el, min, max) {
    var selected, _ref;
    if (min == null) {
      min = 1;
    }
    if (max == null) {
      max = 1;
    }
    selected = filter(el, function(opt) {
      return opt.selected && !opt.disabled;
    });
    if ((min <= (_ref = selected.length) && _ref <= max)) {
      return true;
    } else {
      return false;
    }
  },
  allowed: function(el, allowedChars) {
    var char, str, _i, _len;
    allowedChars = allowedChars.split("");
    str = el.value.split("");
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      char = str[_i];
      if (__indexOf.call(allowedChars, char) < 0) {
        return false;
      }
    }
    return true;
  },
  notAllowed: function(el, notAllowedChars) {
    var char, str, _i, _len;
    notAllowedChars = notAllowedChars.split("");
    str = el.value.split("");
    for (_i = 0, _len = notAllowedChars.length; _i < _len; _i++) {
      char = notAllowedChars[_i];
      if (__indexOf.call(str, char) >= 0) {
        return false;
      }
    }
    return true;
  },
  numberBetween: function(el, min, max) {
    var _ref;
    return (Number(min) <= (_ref = Number(el.value)) && _ref <= Number(max));
  },
  numberMax: function(el, max) {
    return Number(el.value) <= Number(max);
  },
  numberMin: function(el, min) {
    return Number(el.value) >= Number(min);
  },
  lengthBetween: function(el, min, max) {
    var _ref;
    return (Number(min) <= (_ref = el.value.length) && _ref <= Number(max));
  },
  lengthMax: function(el, max) {
    return el.value.length <= Number(max);
  },
  lengthMin: function(el, min) {
    return el.value.length >= Number(min);
  },
  lengthIs: function(el, len) {
    return el.value.length === Number(len);
  }
};


},{}],7:[function(require,module,exports){
var Values,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Values = (function(_super) {
  __extends(Values, _super);

  function Values(arr) {
    var item, _i, _len;
    if (Array.isArray(arr)) {
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        item = arr[_i];
        this.push(item);
      }
    } else {
      throw new TypeError("Pass an array to the ValueObject constructor!");
    }
  }

  Values.prototype.normal = function() {
    return [].concat(this);
  };

  Values.prototype.valueArray = function() {
    return this.map(function(pair) {
      return pair.value;
    });
  };

  Values.prototype.idArray = function() {
    return this.map(function(pair) {
      return pair.id;
    });
  };

  Values.prototype.idValuePair = function() {
    var pair, pairs, _i, _len;
    pairs = {};
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      pair = this[_i];
      pairs[pair.id] = pair.value;
    }
    return pairs;
  };

  Values.prototype.valueString = function(delimiter) {
    if (delimiter == null) {
      delimiter = ", ";
    }
    return this.valueArray().join(delimiter);
  };

  Values.prototype.valueArrayOne = function() {
    var values;
    values = this.valueArray();
    if (values.length > 1) {
      return values;
    } else {
      return values[0];
    }
  };

  Values.prototype.idArrayOne = function() {
    var values;
    values = this.idArray();
    if (values.length > 1) {
      return values;
    } else {
      return values[0];
    }
  };

  Values.prototype.at = function(i) {
    if (isNaN(Number(i))) {
      return this.idValuePair()[i];
    } else {
      return this[i].value;
    }
  };

  Values.prototype.first = function() {
    return this.at(0);
  };

  Values.prototype.last = function() {
    return this.at(this.length - 1);
  };

  Values.prototype.serialize = function() {
    return JSON.stringify(this.normal());
  };

  return Values;

})(Array);

module.exports = Values;


},{}]},{},[5])