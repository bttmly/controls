(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, BUTTON, CHECKABLE, Controls, Values, getValue, isValid, jQuery, map, propMap, qsa, reduce, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

require("./matches-polyfill.coffee");

Values = require("./values.coffee");

isValid = require("./is-valid.coffee");

getValue = require("./get-value.coffee").getValueMappable;

_ref = require("./utils.coffee"), map = _ref.map, reduce = _ref.reduce;

$ = jQuery = window.jQuery;

CHECKABLE = "input[type='radio'], input[type='checkbox']";

BUTTON = "input[type='button'], button";

qsa = function(selector, context) {
  if (context == null) {
    context = document;
  }
  return [].slice.call(context.querySelectorAll(selector));
};

propMap = function(jqCollection, keyProp, valProp) {
  return jqCollection.get().reduce(function(acc, el, i, arr) {
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
  __extends(Controls, _super);

  Controls.validateElement = isValid;

  function Controls(nodes, opt) {
    if (opt == null) {
      opt = {};
    }
    if (!this instanceof Controls || !nodes) {
      return new Controls($(""));
    }
    jQuery.fn.init.call(this, nodes);
    this.identifyingProp = opt.idProp || "id";
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
    this.each(function(i, el) {
      var data;
      data = {
        disabled: Boolean(this.disabled),
        required: Boolean(this.required),
        value: String((function(_this) {
          return function() {
            if (_this.matches(CHECKABLE)) {
              return _this.checked;
            } else if (_this.matches("select")) {
              return qsa("option", _this).reduce(function(acc, el) {
                if (el.selected === true) {
                  acc.push(el.value || el.innerHTML);
                }
                return acc;
              }, []);
            } else if (_this.matches("input")) {
              return _this.value;
            } else {
              return null;
            }
          };
        })(this)())
      };
      return $.data(this, "resetState", data);
    });
  }

  Controls.prototype.filter = function(param) {
    return $.fn.filter.call(this, param);
  };

  Controls.prototype.not = function(param) {
    return $.fn.not.call(this, param);
  };

  Controls.prototype.propValues = function(prop) {
    return new Values(propMap(this, this.idProp, prop));
  };

  Controls.prototype.values = function() {
    return new Values(this.get().map(getValue));
  };

  Controls.prototype.reset = function() {
    this.each(function() {
      var data;
      data = $.data(this, "resetState");
      this.required = data.required;
      this.disabled = data.disabled;
      if (this.matches(CHECKABLE)) {
        return this.checked = data.value;
      } else if (this.matches("select")) {
        return qsa("option", this).forEach((function(_this) {
          return function(el) {
            var _ref1;
            if (_ref1 = el.value, __indexOf.call(data.value, _ref1) >= 0) {
              return el.selected = true;
            }
          };
        })(this));
      } else if (this.matches("input")) {
        return this.value = data.value;
      }
    });
    return this;
  };

  Controls.prototype.clear = function() {
    this.filter("select").find("option").removeAttr("selected");
    this.filter(CHECKABLE).removeAttr("checked");
    this.not(CHECKABLE).val("");
    return this;
  };

  Controls.prototype.check = function() {
    return this.attr("checked", "checked");
  };

  Controls.prototype.uncheck = function() {
    return this.removeAttr("checked");
  };

  Controls.prototype.require = function() {
    return this.attr("required", "required");
  };

  Controls.prototype.unrequire = function() {
    return this.removeAttr("required");
  };

  Controls.prototype.disable = function() {
    return this.attr("disabled", "disabled");
  };

  Controls.prototype.enable = function() {
    return this.removeAttr("disabled");
  };

  Controls.prototype.buttons = function() {
    return this.filter("button");
  };

  Controls.prototype.inputs = function() {
    return this.filter("input");
  };

  Controls.prototype.selects = function() {
    return this.filter("select");
  };

  Controls.prototype.ofType = function(type) {
    return this.filter("[type=" + type + "]");
  };

  Controls.prototype.every = function(cb) {};

  Controls.prototype.some = function() {
    return function(cb) {};
  };

  Controls.prototype.valid = function() {
    return this.every(isValid);
  };

  Controls.prototype.bindValidator = function(fn) {};

  Controls.prototype.labels = function() {
    return reduce(this, function(acc, el) {
      return acc.add(el.labels);
    }, $());
  };

  Controls.prototype.asJQuery = function() {
    return $(this.get());
  };

  return Controls;

})(jQuery);

module.exports = Controls;


},{"./get-value.coffee":2,"./is-valid.coffee":4,"./matches-polyfill.coffee":6,"./utils.coffee":7,"./values.coffee":9}],2:[function(require,module,exports){
var $, BUTTON, CHECKABLE, SELECTED, getValue;

$ = window.jQuery;

CHECKABLE = "input[type='checkbox'], input[type='radio']";

SELECTED = ":selected:not(:disabled)";

BUTTON = "input[type='button'], button";

getValue = function(el) {
  var $el;
  $el = $(el);
  if ($el.is(BUTTON)) {
    return null;
  } else if ($el.is(CHECKABLE)) {
    if (el.checked) {
      return el.value;
    } else {
      return null;
    }
  } else if ($el.is("select")) {
    return $el.find(SELECTED).map(function(el) {
      return el.value || el.innerHTML || null;
    });
  } else {
    return el.value || null;
  }
};

module.exports = getValue;


},{}],3:[function(require,module,exports){
var $, CONTROL_TAGS, Controls;

Controls = require("./controls.coffee");

$ = window.jQuery;

CONTROL_TAGS = ["input", "select", "textarea", "button"].join(", ");

module.exports = (function() {
  var prevControls;
  prevControls = $.fn.controls;
  $.fn.controls = function(opt) {
    var method;
    if (opt == null) {
      opt = {};
    }
    method = this.length === 1 ? "find" : "filter";
    return new Controls(this[method](CONTROL_TAGS), opt);
  };
  $.fn.controls.noConflict = function() {
    $.fn.controls = prevControls;
    return this;
  };
  return void 0;
})();


},{"./controls.coffee":1}],4:[function(require,module,exports){
var $, callOn, getArgs, getMethod, isValid, jQuery, splitMethods, validations,
  __slice = [].slice;

validations = require("./validations.coffee");

$ = jQuery = window.jQuery;

callOn = function(obj, fn) {
  return fn.call(obj);
};

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

isValid = function() {
  var $el, args, customFn, el, validationAttr, validationFns, validators;
  el = arguments[0], customFn = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  $el = $(el);
  validationAttr = $el.data("control-validation");
  validationFns = el._controlValidators;
  if (customFn && typeof customFn === "function") {
    return !!customFn.apply(el, args);
  } else if (validationFns != null ? validationFns.length : void 0) {
    return validationFns.every(callOn.bind(null, el));
  } else if (validationAttr) {
    validators = splitMethods(validationAttr).map(function(fnCallStr) {
      return {
        method: getMethod(fnCallStr),
        args: getArgs(fnCallStr)
      };
    });
    return validators.every(function(callDesc) {
      if (!("method" in callDesc)) {
        return false;
      }
      return validations[callDesc.method].apply(el, args);
    });
  } else {
    return el.validity.valid;
  }
};

module.exports = isValid;


},{"./validations.coffee":8}],5:[function(require,module,exports){
module.exports = (function() {
  require("./init.coffee");
  $.Controls = require("./controls.coffee");
  $.Values = require("./values.coffee");
  return void 0;
})();


},{"./controls.coffee":1,"./init.coffee":3,"./values.coffee":9}],6:[function(require,module,exports){
(function(Element) {
  if (Element) {
    return Element.prototype.matches = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(selector) {
      var i, nodes;
      nodes = (this.parentNode || this.document).querySelectorAll(selector);
      i = 0;
      while (i < nodes.length) {
        if (nodes[i] === this) {
          return true;
        }
        i += 1;
      }
      return false;
    };
  }
})(window.Element);


},{}],7:[function(require,module,exports){
var demethodize;

demethodize = function(fn) {
  return Function.prototype.call.bind(fn);
};

module.exports = {
  map: demethodize(Array.prototype.map),
  slice: demethodize(Array.prototype.slice),
  reduce: demethodize(Array.prototype.reduce),
  objMap: function(obj, callback) {
    var key, result, value;
    result = {};
    for (key in obj) {
      value = obj[key];
      result[key] = callback(value, key, obj);
    }
    return result;
  }
};


},{}],8:[function(require,module,exports){
var $, document, html5Validation, jQuery, slice, typeCheck, typeRadio, v,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

slice = require("./utils.coffee").slice;

$ = jQuery = window.jQuery;

document = window.document;

html5Validation = (function() {
  var testEl;
  testEl = document.createElement("input");
  return function(inputType, value) {
    testEl.type = inputType;
    testEl.value = value;
    return testEl.validity.valid;
  };
})();

typeRadio = "[type='radio']";

typeCheck = "[type='checkbox']";

module.exports = v = {
  notEmpty: function() {
    return !!this.value;
  },
  notEmptyTrim: function() {
    return !!this.value.trim();
  },
  numeric: function() {
    return /^\d+$/.test(this.value);
  },
  alphanumeric: function() {
    return /^[a-z0-9]+$/i.test(this.value);
  },
  letters: function() {
    return /^[a-z]+$/i.test(this.value);
  },
  isValue: function(value) {
    return String(this.value) === String(value);
  },
  phone: function() {
    return v.allowed.call(this, "1234567890()-+# ");
  },
  email: function() {
    if (!v.notEmptyTrim(this)) {
      return false;
    }
    return html5Validation("email", this.value);
  },
  url: function() {
    if (!v.notEmptyTrim(this)) {
      return false;
    }
    return html5Validation("url", this.value);
  },
  list: function() {
    var _ref;
    return _ref = this.value, __indexOf.call(slice(this.list.options || []).map(function(option) {
      return option.value || option.innerHTML;
    }), _ref) >= 0;
  },
  radio: function() {
    if (this.name) {
      return $("" + typeRadio + "[name='" + this.name + "']").get().some(function(input) {
        return input.checked;
      });
    } else {
      return false;
    }
  },
  checkbox: function(minChecked, maxChecked) {
    var len;
    if (minChecked == null) {
      minChecked = 0;
    }
    if (maxChecked == null) {
      maxChecked = 50;
    }
    if (this.name) {
      len = $("" + typeCheck + "[name='" + this.name + "']").filter(function() {
        return $(this).prop("checked");
      }).length;
      return (minChecked <= len && len <= maxChecked);
    } else {
      return true;
    }
  },
  select: function(min, max) {
    var selected, _ref;
    if (min == null) {
      min = 1;
    }
    if (max == null) {
      max = 1;
    }
    selected = filter(this(function(opt) {
      return opt.selected && !opt.disabled;
    }));
    if ((min <= (_ref = selected.length) && _ref <= max)) {
      return true;
    } else {
      return false;
    }
  },
  allowed: function(allowedChars) {
    var char, str, _i, _len;
    allowedChars = allowedChars.split("");
    str = this.value.split("");
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      char = str[_i];
      if (__indexOf.call(allowedChars, char) < 0) {
        return false;
      }
    }
    return true;
  },
  notAllowed: function(notAllowedChars) {
    var char, str, _i, _len;
    notAllowedChars = notAllowedChars.split("");
    str = this.value.split("");
    for (_i = 0, _len = notAllowedChars.length; _i < _len; _i++) {
      char = notAllowedChars[_i];
      if (__indexOf.call(str, char) >= 0) {
        return false;
      }
    }
    return true;
  },
  numberBetween: function(min, max) {
    var _ref;
    return (Number(min) <= (_ref = Number(this.value)) && _ref <= Number(max));
  },
  numberMax: function(max) {
    return Number(this.value) <= Number(max);
  },
  numberMin: function(min) {
    return Number(this.value) >= Number(min);
  },
  lengthBetween: function(min, max) {
    var _ref;
    return (Number(min) <= (_ref = this.value.length) && _ref <= Number(max));
  },
  lengthMax: function(max) {
    return this.value.length <= Number(max);
  },
  lengthMin: function(min) {
    return this.value.length >= Number(min);
  },
  lengthIs: function(len) {
    return this.value.length === Number(len);
  }
};


},{"./utils.coffee":7}],9:[function(require,module,exports){
var Values,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Values = (function(_super) {
  __extends(Values, _super);

  function Values(items) {
    if (!Array.isArray(items)) {
      throw new TypeError();
    }
    this.push.apply(this, items);
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