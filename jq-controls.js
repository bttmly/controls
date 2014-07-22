(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, BUTTON, CHECKABLE, Controls, Values, getValue, isValid, jQuery, map, propMap, reduce, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Values = require("./values.coffee");

isValid = require("./is-valid.coffee");

getValue = require("./get-value.coffee").getValueMappable;

_ref = require("./utils.coffee"), map = _ref.map, reduce = _ref.reduce;

$ = jQuery = window.jQuery;

CHECKABLE = "input[type='radio'], input[type='checkbox']";

BUTTON = "input[type='button'], button";

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
  var bindValidator;

  __extends(Controls, _super);

  Controls.isValid = isValid;

  function Controls(nodes, opt) {
    if (opt == null) {
      opt = {};
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
      return (function() {
        return this.data("initialValue", {
          disabled: this.prop("disabled"),
          required: this.prop("required"),
          value: (function(_this) {
            return function() {
              if (_this.is(CHECKABLE)) {
                return _this.prop("checked");
              } else if (_this.is("select")) {
                return _this.find("option:selected").get().map(function(el) {
                  return el.value || el.innerHTML;
                });
              } else if (_this.is("input")) {
                return _this.val();
              } else {
                return null;
              }
            };
          })(this)()
        });
      }).call($(el));
    });
  }

  Controls.prototype.filter = function() {
    return $.fn.filter.apply($(this.get()), arguments).controls();
  };

  Controls.prototype.not = function() {
    return $.fn.not.apply($(this.get()), arguments).controls();
  };

  Controls.prototype.propValues = function(prop) {
    return new Values(propMap(this, this.idProp, prop));
  };

  Controls.prototype.values = function() {
    return new Values(this.get().map(getValue));
  };

  Controls.prototype.reset = function() {
    this.each(function() {});
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


},{"./get-value.coffee":2,"./is-valid.coffee":4,"./utils.coffee":6,"./values.coffee":8}],2:[function(require,module,exports){
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
      return el.value || el.innerHTML;
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
  $.fn.controls = function() {
    var method;
    method = this.length === 1 ? "find" : "filter";
    return new Controls(this[method](CONTROL_TAGS));
  };
  $.fn.controls.noConflict = function() {
    $.fn.controls = prevControls;
    return this;
  };
  return void 0;
})();


},{"./controls.coffee":1}],4:[function(require,module,exports){
var $, getArgs, getMethod, isValid, jQuery, splitMethods, validations;

validations = require("./validations.coffee");

$ = jQuery = window.jQuery;

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

isValid = function(el, customFn) {
  var $el, validationAttr, validationFns;
  $el = $(el);
  validationAttr = $el.data("control-validation");
  validationFns = $el.data("validators");
  if (customFn && typeof customFn === "function") {
    console.log("a");
    return !!customFn(el);
  } else if (validationFns) {
    console.log("b");
    return validationFns.every(function(fn) {
      return fn(el);
    });
  } else if (validationAttr) {
    console.log("c");
    validations = splitMethods(validationAttr).map(function(fnCallStr) {
      var obj;
      obj = {};
      obj.method = getMethod(fnCallStr);
      obj.args = getArgs(fnCallStr);
      return obj;
    });
    return validations.every(function(callDesc) {
      if (!(callDesc.method in validations)) {
        return false;
      }
      return validations[callDesc.method].apply(null, [el].concat(callDesc.args));
    });
  } else {
    console.log("d");
    return el.validity.valid;
  }
};

module.exports = isValid;


},{"./validations.coffee":7}],5:[function(require,module,exports){
module.exports = (function() {
  require("./init.coffee");
  $.Controls = require("./controls.coffee");
  $.Values = require("./values.coffee");
  return void 0;
})();


},{"./controls.coffee":1,"./init.coffee":3,"./values.coffee":8}],6:[function(require,module,exports){
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


},{}],7:[function(require,module,exports){
var html5Validation, slice, testEl, v,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

slice = require("./utils.coffee").slice;

testEl = document.createElement("input");

html5Validation = function(inputType, value) {
  testEl.type = inputType;
  testEl.value = value;
  return testEl.validity.valid;
};

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
    return this.allowed(el, "1234567890()-+# ");
  },
  email: function(el) {
    if (!this.notEmptyTrim(el)) {
      return false;
    }
    return html5Validation("email", el.value);
  },
  url: function(el) {
    if (!this.notEmptyTrim(el)) {
      return false;
    }
    return html5Validation("url", el.value);
  },
  list: function(el) {
    var _ref;
    return _ref = el.value, __indexOf.call(slice(el.list.options || []).map(function(option) {
      return option.value || option.innerHTML;
    }), _ref) >= 0;
  },
  radio: function(el) {
    if (el.name) {
      return $("input[type='radio'][name='" + el.name + "']").get().some(function(input) {
        return input.checked;
      });
    } else {
      return false;
    }
  },
  checkbox: function(el, minChecked, maxChecked) {
    var len;
    if (minChecked == null) {
      minChecked = 0;
    }
    if (maxChecked == null) {
      maxChecked = 50;
    }
    if (el.name) {
      len = $("input[type='checkbox'][name='" + el.name + "']").filter(function() {
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


},{"./utils.coffee":6}],8:[function(require,module,exports){
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