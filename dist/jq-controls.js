(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BUTTON, CHECKABLE, Controls, TAGS, Values, each, every, getControlNodes, getValue, isValid, jQuery, map, propMap, reduce, slice, validityListener, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

require("./matches-polyfill.coffee");

Values = require("./values.coffee");

isValid = require("./is-valid.coffee");

getValue = require("./get-value.coffee").getValueMappable;

_ref = require("./utils.coffee"), map = _ref.map, reduce = _ref.reduce, each = _ref.each, every = _ref.every, slice = _ref.slice;

_ref1 = require("./selectors.coffee"), CHECKABLE = _ref1.CHECKABLE, BUTTON = _ref1.BUTTON, TAGS = _ref1.TAGS;

jQuery = window.jQuery;

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

getControlNodes = function(nodes) {
  return reduce(nodes, function(acc, node) {
    if (node.matches(TAGS)) {
      acc.push(node);
    } else {
      [].push.apply(slice(node.querySelectorAll(TAGS)));
    }
    return acc;
  }, []);
};

validityListener = function(evt) {
  isValid = this.valid();
  if (isValid !== this.isValid()) {
    if (isValid) {
      this.trigger("valid");
    } else {
      this.trigger("invalid");
    }
    return this.isValid = isValid;
  }
};

Controls = (function(_super) {
  __extends(Controls, _super);

  Controls.validateElement = isValid;

  function Controls(nodes, opt) {
    if (nodes == null) {
      nodes = "";
    }
    if (opt == null) {
      opt = {};
    }
    if (!(this instanceof Controls)) {
      return new Controls(jQuery(nodes));
    }
    jQuery.fn.init.call(this, getControlNodes(nodes));
    this._controlsInit(opt);
  }

  Controls.prototype._controlsInit = function(opt) {
    this.identifyingProp = opt.idProp || "id";
    this.isValid = this.valid();
    this._validityListener = validityListener.bind(this);
    if (!opt.noAutoValidate) {
      this.startValidListening();
    }
    if (!opt.noResetState) {
      return this.setResetState();
    }
  };

  Controls.prototype.startValidListening = function() {
    return this.on("change, input", this._validityListener);
  };

  Controls.prototype.stopValidListening = function() {
    return this.off("change, input", this._validityListener);
  };

  Controls.prototype.setResetState = function() {
    return this.each(function(i, el) {
      return jQuery.data(this, "resetState", {
        disabled: this.disabled,
        required: this.required,
        value: (function(_this) {
          return function() {
            if (_this.matches(CHECKABLE)) {
              return _this.checked;
            } else if (_this.matches("select")) {
              return reduce(_this.querySelectorAll("option"), function(acc, el) {
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
        })(this)()
      });
    });
  };

  Controls.prototype.filter = function(param) {
    return jQuery.fn.filter.call(this, param).controls();
  };

  Controls.prototype.not = function(param) {
    return jQuery.fn.not.call(this, param).controls();
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
      data = jQuery.data(this, "resetState");
      this.required = data.required;
      this.disabled = data.disabled;
      if (this.matches(CHECKABLE)) {
        return this.checked = data.value;
      } else if (this.matches("select")) {
        return each(this.querySelectorAll("option"), function(el) {
          var _ref2;
          if (_ref2 = el.value, __indexOf.call(data.value, _ref2) >= 0) {
            return el.selected = true;
          }
        });
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

  Controls.prototype.pushStack = function(elems) {
    var ret;
    ret = jQuery.merge(jQuery(), elems);
    ret.prevObject = this;
    ret.context = this.context;
    return ret;
  };

  Controls.prototype.end = function() {
    var _ref2;
    return (_ref2 = this.prevObject) != null ? _ref2 : jQuery(null);
  };

  Controls.prototype.check = function() {
    return this.attr("checked", true);
  };

  Controls.prototype.uncheck = function() {
    return this.removeAttr("checked");
  };

  Controls.prototype.require = function() {
    return this.attr("required", true);
  };

  Controls.prototype.unrequire = function() {
    return this.removeAttr("required");
  };

  Controls.prototype.disable = function() {
    return this.attr("disabled", true);
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

  Controls.prototype.ofType = function() {
    var selector, types;
    types = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    selector = types.map(function(type) {
      return "[type=" + type + "]";
    }).join(", ");
    return this.filter(selector);
  };

  Controls.prototype.valid = function() {
    return every(this, Controls.validateElement);
  };

  Controls.prototype.bindValidator = function(fn) {
    return void 0;
  };

  Controls.prototype.labels = function() {
    return reduce(this, function(acc, el) {
      return acc.add(el.labels);
    }, jQuery());
  };

  Controls.prototype.asJQuery = function() {
    return jQuery(this.get());
  };

  Controls.prototype.slice = function() {
    return jQuery.fn.slice.apply(this, arguments).controls();
  };

  Controls.prototype.eq = function(i) {
    return this.slice(i, 1);
  };

  Controls.prototype.first = function() {
    return this.eq(0);
  };

  Controls.prototype.last = function() {
    return this.eq(this.length - 1);
  };

  return Controls;

})(jQuery);

module.exports = Controls;



},{"./get-value.coffee":2,"./is-valid.coffee":4,"./matches-polyfill.coffee":6,"./selectors.coffee":8,"./utils.coffee":9,"./values.coffee":11}],2:[function(require,module,exports){
var BUTTON, CHECKABLE, SELECTED, getValue, jQuery, _ref;

jQuery = window.jQuery;

_ref = require("./selectors.coffee"), CHECKABLE = _ref.CHECKABLE, SELECTED = _ref.SELECTED, BUTTON = _ref.BUTTON;

getValue = function(el) {
  var $el;
  $el = jQuery(el);
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



},{"./selectors.coffee":8}],3:[function(require,module,exports){
var CONTROL_TAGS, Controls, mixinControls;

Controls = require("./controls.coffee");

mixinControls = require("./mixin.coffee");

CONTROL_TAGS = ["input", "select", "textarea", "button"].join(", ");

module.exports = (function($) {
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
  $.fn.mixinControls = function(opt) {
    if (opt == null) {
      opt = {};
    }
    return mixinControls(this, opt);
  };
  return void 0;
})(window.jQuery);



},{"./controls.coffee":1,"./mixin.coffee":7}],4:[function(require,module,exports){
var callOn, getArgs, getMethod, isValid, jQuery, splitMethods, validations,
  __slice = [].slice;

validations = require("./validations.coffee");

jQuery = window.jQuery;

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
  var $el, args, customFn, el, validationAttr, validationFns, validators, _ref;
  el = arguments[0], customFn = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  $el = jQuery(el);
  validationAttr = $el.data("control-validation");
  validationFns = jQuery.data(el, "controlValidators");
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
    return (_ref = el.validity) != null ? _ref.valid : void 0;
  }
};

module.exports = isValid;



},{"./validations.coffee":10}],5:[function(require,module,exports){
module.exports = (function($) {
  require("./init.coffee");
  $.Controls = require("./controls.coffee");
  $.Values = require("./values.coffee");
  return void 0;
})(window.jQuery);



},{"./controls.coffee":1,"./init.coffee":3,"./values.coffee":11}],6:[function(require,module,exports){
(function(Element) {
  if (Element && !Element.prototype.matches) {
    return Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function(selector) {
      var node, nodes, _i, _len;
      nodes = (this.parentNode || this.document).querySelectorAll(selector);
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        if (node === this) {
          return true;
        }
      }
      return false;
    };
  }
})(window.Element);

module.exports = void 0;



},{}],7:[function(require,module,exports){
var BLACKLIST, Controls, TAGS, isControl, jQuery, mixin,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

jQuery = window.jQuery;

Controls = require("./controls.coffee");

BLACKLIST = ["constructor", "filter", "not", "slice", "pushStack", "end"];

TAGS = require("./selectors.coffee").TAGS;

isControl = function(el) {
  return jQuery(el).is(TAGS);
};

module.exports = mixin = function(obj, opt) {
  if (opt == null) {
    opt = {};
  }
  if (!(obj instanceof jQuery)) {
    throw new TypeError("Controls mixin expects a jQuery selection");
  }
  if (![].every.call(obj, isControl)) {
    throw new TypeError("All elements in the collection must be\nbutton, input, select, or textarea");
  }
  Object.getOwnPropertyNames(Controls.prototype).forEach(function(method) {
    if (__indexOf.call(BLACKLIST, method) < 0) {
      return obj[method] = Controls.prototype[method];
    }
  });
  obj._controlsInit(opt);
  return obj;
};



},{"./controls.coffee":1,"./selectors.coffee":8}],8:[function(require,module,exports){
module.exports = {
  CHECKABLE: "input[type='radio'], input[type='checkbox']",
  BUTTON: "input[type='button'], button",
  TAGS: "input, select, button, textarea",
  RADIO: "[type='radio']",
  CHECK: "[type='checkbox']"
};



},{}],9:[function(require,module,exports){
var arrayMethods, demethodize, utils;

demethodize = function(method) {
  return Function.prototype.call.bind(method);
};

arrayMethods = ["map", "some", "every", "slice", "filter", "reduce", "forEach"];

utils = {
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

arrayMethods.forEach(function(method) {
  return utils[method] = demethodize(Array.prototype[method]);
});

utils.each = utils.forEach;

module.exports = utils;



},{}],10:[function(require,module,exports){
var CHECK, RADIO, document, html5Validation, jQuery, slice, v, _ref,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

slice = require("./utils.coffee").slice;

_ref = require("./selectors.coffee"), CHECK = _ref.CHECK, RADIO = _ref.RADIO;

document = window.document, jQuery = window.jQuery;

html5Validation = (function() {
  var testEl;
  testEl = document.createElement("input");
  return function(type, value) {
    testEl.type = type;
    testEl.value = value;
    testEl.required = true;
    return testEl.validity.valid;
  };
})();

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
    var _ref1;
    return _ref1 = this.value, __indexOf.call(slice(this.list.options || []).map(function(option) {
      return option.value || option.innerHTML;
    }), _ref1) >= 0;
  },
  radio: function() {
    if (this.name) {
      return jQuery("" + RADIO + "[name='" + this.name + "']").get().some(function(input) {
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
      len = jQuery("" + CHECK + "[name='" + this.name + "']").filter(function() {
        return jQuery(this).prop("checked");
      }).length;
      return (minChecked <= len && len <= maxChecked);
    } else {
      return true;
    }
  },
  select: function(min, max) {
    var selected, _ref1;
    if (min == null) {
      min = 1;
    }
    if (max == null) {
      max = 1;
    }
    selected = filter(this(function(opt) {
      return opt.selected && !opt.disabled;
    }));
    if ((min <= (_ref1 = selected.length) && _ref1 <= max)) {
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
    var _ref1;
    return (Number(min) <= (_ref1 = Number(this.value)) && _ref1 <= Number(max));
  },
  numberMax: function(max) {
    return Number(this.value) <= Number(max);
  },
  numberMin: function(min) {
    return Number(this.value) >= Number(min);
  },
  lengthBetween: function(min, max) {
    var _ref1;
    return (Number(min) <= (_ref1 = this.value.length) && _ref1 <= Number(max));
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



},{"./selectors.coffee":8,"./utils.coffee":9}],11:[function(require,module,exports){
var Values;

module.exports = Values = (function() {
  function Values(items) {
    if (!Array.isArray(items)) {
      throw new TypeError();
    }
    this.push.apply(this, items);
  }

  Values.prototype.normal = function() {
    return this.map(function(obj) {
      return {
        id: obj.id,
        value: obj.value
      };
    });
  };

  Values.prototype.valueArray = function() {
    return this.map(function(obj) {
      return obj.value;
    });
  };

  Values.prototype.idArray = function() {
    return this.map(function(obj) {
      return obj.id;
    });
  };

  Values.prototype.idValueMap = function() {
    return this.reduce(function(acc, obj) {
      acc[obj.id] = obj.value;
      return acc;
    }, {});
  };

  Values.prototype.valueString = function(delimiter) {
    if (delimiter == null) {
      delimiter = ", ";
    }
    return this.valueArray().join(delimiter);
  };

  Values.prototype.valueArrayOne = function() {
    var result;
    result = this.valueArray();
    if (result.length > 1) {
      return result;
    } else {
      return result[0];
    }
  };

  Values.prototype.idArrayOne = function() {
    var result;
    result = this.idArray();
    if (result.length > 1) {
      return result;
    } else {
      return result[0];
    }
  };

  Values.prototype.at = function(i) {
    var obj, _i, _len;
    if (isNaN(Number(i))) {
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        obj = this[_i];
        if (obj.id === i) {
          return obj;
        }
      }
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

})();



},{}]},{},[5]);
