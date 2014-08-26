(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var demethodize;

demethodize = function(method) {
  return Function.prototype.call.bind(method);
};

module.exports = {
  map: demethodize(Array.prototype.map),
  some: demethodize(Array.prototype.some),
  every: demethodize(Array.prototype.every),
  slice: demethodize(Array.prototype.slice),
  each: demethodize(Array.prototype.forEach),
  reduce: demethodize(Array.prototype.reduce),
  filter: demethodize(Array.prototype.filter)
};



},{}],2:[function(require,module,exports){
var BUTTON, CHECK, CHECKABLE, Controls, RADIO, TAGS, Values, every, expect, filter, first, fs, jQuery, last, map, reduce, sameSelection, sinon, slice, some, trees, type, _ref, _ref1,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

require("../src/jquery-controls.coffee");



jQuery = window.jQuery;

Controls = jQuery.Controls, Values = jQuery.Values;

sinon = window.sinon;

expect = window.chai.expect;

sameSelection = require("./spec-utilities.coffee").sameSelection;

_ref = require("./array-generics.coffee"), map = _ref.map, some = _ref.some, every = _ref.every, slice = _ref.slice, filter = _ref.filter, reduce = _ref.reduce;

_ref1 = require("./selectors.coffee"), CHECKABLE = _ref1.CHECKABLE, BUTTON = _ref1.BUTTON, TAGS = _ref1.TAGS, RADIO = _ref1.RADIO, CHECK = _ref1.CHECK;

type = function() {
  var arg, str, _i, _len;
  str = [];
  for (_i = 0, _len = arguments.length; _i < _len; _i++) {
    arg = arguments[_i];
    str.push("[type=" + arg + "]");
  }
  return str.join(", ");
};

first = function(arr) {
  return arr[0];
};

last = function(arr) {
  return arr[arr.length - 1];
};

trees = window.trees = (function() {
  var storage;
  storage = {};
  return {
    byId: function(id) {
      if (storage[id]) {
        return $.parseHTML(storage[id])[0];
      } else {
        return null;
      }
    },
    addTree: function(htmlStr) {
      var id;
      id = $(htmlStr).attr("id");
      return storage[id] = htmlStr;
    }
  };
})();

["<div class=\"wrapper\" id=\"values\">\n\n  <div class=\"inputs\">\n    <input type=\"text\" value=\"text\">\n    <input type=\"email\" value=\"email\">\n    <input type=\"url\" value=\"url\">\n  </div>\n\n  <div class=\"checkboxes\">\n    <input type=\"checkbox\" name=\"checkbox\" value=\"checkbox-1\">\n    <input type=\"checkbox\" name=\"checkbox\" value=\"checkbox-2\" checked>\n    <input type=\"checkbox\" name=\"checkbox\" value=\"checkbox-3\">\n    <input type=\"checkbox\" name=\"checkbox\" value=\"checkbox-4\" checked>\n  </div>\n\n  <div class=\"radios\">\n    <input type=\"radio\" name=\"radio\" value=\"radio-1\">\n    <input type=\"radio\" name=\"radio\" value=\"radio-2\">\n    <input type=\"radio\" name=\"radio\" value=\"radio-3\" checked>\n    <input type=\"radio\" name=\"radio\" value=\"radio-4\">\n  </div>\n\n  <div class=\"select-single\">\n    <select>\n      <option value=\"ss-value-1\">1</option>\n      <option value=\"ss-value-2\">2</option>\n      <option value=\"ss-value-3\" selected>3</option>\n    </select>\n  </div>\n\n  <div class=\"select-multiple\">\n    <select multiple>\n      <option value=\"ss-value-1\">1</option>\n      <option value=\"ss-value-2\" selected>2</option>\n      <option value=\"ss-value-3\">3</option>\n      <option value=\"ss-value-4\" selected>4</option>\n    </select>\n  </div>\n\n  <div class=\"buttons\">\n    <button></button>\n    <button></button>\n    <button></button>\n  </div>\n\n\n</div>", "<div class=\"wrapper\" id=\"mixed\">\n\n  <h1>Heading 1</h1>\n\n  <button>Button</button>\n\n  <ul>\n    <li>List item 1</li>\n    <li>List item 2</li>\n  </ul>\n\n  <input type=\"text\">\n\n  <h2>Heading 2</h2>\n\n  <select>\n    <option>One</option>\n    <option>Two</option>\n  </select>\n\n  <p>A paragraph, <span>and a span</span>.</p>\n\n  <textarea>\n    Textarea\n  </textarea>\n  \n</div>", "<div class=\"wrapper\" id=\"validation\">\n\n  <input class=\"custom-validation valid\" type=\"text\" value=\"123\">\n  <input class=\"custom-validation invalid\" type=\"text\" value=\"abc\">\n\n  <input class=\"attr-validation valid\" data-control-validation=\"numeric\" type=\"text\" value=\"123\">\n  <input class=\"attr-validation invalid\" data-control-validation=\"numeric\" type=\"text\" value=\"abc\">\n\n  <input class=\"data-validation valid\" type=\"text\" value=\"123\">\n  <input class=\"data-validation invalid\" type=\"text\" value=\"abc\">\n\n  <input class=\"html5-validation valid\" type=\"text\" value=\"123\" required>\n  <input class=\"html5-validation invalid\" type=\"text\" value=\"\" required>\n\n</div>", "<div class=\"wrapper\" id=\"initialState\">\n\n  <div class=\"inputs\">\n    <input id=\"text1\" type=\"text\" value=\"one\">\n    <input id=\"text2\" type=\"text\" value=\"two\" required>\n    <input id=\"text3\" type=\"text\" value=\"three\" disabled>\n    <input id=\"text4\" type=\"text\" value=\"four\" required disabled>\n  </div>\n  \n  <div class=\"checkboxes\">\n    <input id=\"check1\" type=\"checkbox\" name=\"checkbox\" value=\"one\" checked>\n    <input id=\"check2\" type=\"checkbox\" name=\"checkbox\" value=\"two\" checked>\n  </div>\n\n  <div class=\"radios\">\n    <input id=\"check1\" type=\"radio\" name=\"radio\" value=\"one\" checked>\n  </div>\n\n  <div class=\"select-single\">\n    <select>\n      <option value=\"one\">1</option>\n      <option value=\"two\" selected>2</option>\n    </select>\n  </div>\n\n  <div class=\"select-multiple\">\n    <select multiple>\n      <option value=\"one\" selected>1</option>\n      <option value=\"two\" selected>2</option>\n    </select>\n  </div>\n\n</div>", "<div id=\"with-labels\">\n\n  <label class=\"lbl\" id=\"wrapping\">\n    Check this box\n    <input value=\"this-thing\" type=\"checkbox\" id=\"inside-label\">\n  </label>\n\n  <label class=\"lbl\" for=\"outside-label\" id=\"not-wrapping\">\n    Check this other box\n  </label>\n  <input value=\"that-thing\" type=\"checkbox\" id=\"outside-label\">\n\n  <label for=\"nothing\">This label isn't for anything</label>\n\n</div>"].map(trees.addTree.bind(trees));

describe("jQuery.fn.controls()", function() {
  return describe("basics", function() {
    it("exists", function() {
      return expect(jQuery.fn.controls).to.be.a("function");
    });
    return it("works", function() {
      var cSel, jSel, root;
      root = trees.byId("values");
      cSel = $(root).controls();
      jSel = $(root).find("input, button, select");
      return expect(sameSelection(cSel, jSel)).to.equal(true);
    });
  });
});

describe("Controls.validateElement()", function() {
  var root, valid;
  valid = Controls.validateElement;
  root = null;
  beforeEach(function() {
    return root = trees.byId("validation");
  });
  describe("validation against a passed in function", function() {
    var thisIs, validatorA, validatorB;
    validatorA = function() {
      return __indexOf.call(this.value, "1") >= 0;
    };
    validatorB = function(str) {
      return str + this.value === "abc123";
    };
    thisIs = function(obj) {
      return obj === this;
    };
    it("accepts a function", function() {
      var els;
      els = $(root).find(".custom-validation");
      expect(valid(els[0], validatorA)).to.equal(true);
      return expect(valid(els[1], validatorA)).to.equal(false);
    });
    it("accepts additional arguments", function() {
      var els;
      els = $(root).find(".custom-validation");
      expect(valid(els[0], validatorB, "abc")).to.equal(true);
      return expect(valid(els[1], validatorB, "abc")).to.equal(false);
    });
    return it("calls the function with the element as 'this'", function() {
      var els;
      els = $(root).find(".custom-validation");
      return expect(valid(els[0], thisIs, els[0])).to.equal(true);
    });
  });
  describe("validation against a data-control-validation attribute", function() {
    return it("validates an input against preset attribute validators", function() {
      var els;
      els = $(root).find(".attr-validation");
      expect(valid(els[0])).to.equal(true);
      return expect(valid(els[1])).to.equal(false);
    });
  });
  return describe("validation against bound validators", function() {
    return it("validates against all present attached validators", function() {
      var els;
      els = $(root).find(".data-validation");
      $.data(els[0], "controlValidators", [
        (function() {
          return this.value === "123";
        }), (function() {
          return this.value !== "abc";
        })
      ]);
      $.data(els[1], "controlValidators", [
        (function() {
          return this.value !== "abc";
        }), (function() {
          return this.value === "abc";
        })
      ]);
      expect(valid(els[0])).to.equal(true);
      expect(valid(els[1])).to.equal(false);
      $.data(els[0], "controlValidators", "");
      return $.data(els[1], "controlValidators", "");
    });
  });
});

describe("Control prototype methods", function() {
  var cSel, jSel, qsa, vSel;
  cSel = void 0;
  jSel = void 0;
  vSel = void 0;
  qsa = void 0;
  beforeEach(function() {
    var root;
    root = trees.byId("values");
    jSel = $(root);
    cSel = $(root).controls();
    return qsa = Element.prototype.querySelectorAll.bind(root);
  });
  describe("@filter()", function() {
    it("returns a Controls instance", function() {
      return expect(cSel.filter("button")).to.be["instanceof"](Controls);
    });
    it("accepts a selector", function() {
      var btn, flt;
      flt = cSel.filter("button");
      btn = jSel.find("button");
      return expect(sameSelection(flt, btn)).to.equal(true);
    });
    it("accepts an array of DOM elements", function() {
      var btn, flt;
      btn = qsa("button");
      flt = cSel.filter("button");
      return expect(sameSelection(flt, btn)).to.equal(true);
    });
    it("accepts a function", function() {
      var btn, flt;
      flt = cSel.filter(function() {
        return this.tagName.toLowerCase() === "button";
      });
      btn = qsa("button");
      return expect(sameSelection(flt, btn)).to.equal(true);
    });
    it("accepts a jQuery selection", function() {
      var btn, flt;
      btn = jSel.find("button");
      flt = cSel.filter(btn);
      return expect(sameSelection(flt, btn)).to.equal(true);
    });
    return xit("accepts a Controls selection");
  });
  describe("@not()", function() {
    it("returns a Controls instance", function() {
      return expect(cSel.not("input")).to.be["instanceof"](Controls);
    });
    it("accepts a selector", function() {
      var cNoInput, jNoInput;
      jNoInput = jSel.find(TAGS).not("input");
      cNoInput = cSel.not("input");
      return expect(sameSelection(jNoInput, cNoInput)).to.equal(true);
    });
    it("accepts an array of DOM elements", function() {
      var cNoInput, hasAnInput, inputs;
      inputs = jSel.find("input").get();
      cNoInput = cSel.not(inputs);
      hasAnInput = some(cNoInput, function(el) {
        return el.tagName.toLowerCase() === "input";
      });
      return expect(hasAnInput).to.equal(false);
    });
    it("accepts a function", function() {
      var cEmptyValue, vEmptyValue;
      cEmptyValue = cSel.not(function() {
        return this.value === "";
      });
      vEmptyValue = filter(qsa(TAGS), function(el) {
        return el.value !== "";
      });
      return expect(sameSelection(cEmptyValue, vEmptyValue)).to.equal(true);
    });
    it("accepts a jQuery selection", function() {
      var cNoEmptyValue, hasEmptyValues, jEmptyValue;
      jEmptyValue = jSel.filter(function() {
        return this.value === "";
      });
      cNoEmptyValue = jSel.not(jEmptyValue);
      hasEmptyValues = some(cNoEmptyValue, function(el) {
        return this.value === "";
      });
      return expect(hasEmptyValues).to.equal(false);
    });
    return xit("accepts a Controls selection");
  });
  describe("@reset()", function() {
    return it("resets disabled, required, and value to their resetState", function() {
      var ctls, els, root, t1, t2, t3, t4;
      root = trees.byId("initialState");
      els = $(root);
      ctls = $(root).controls();
      t1 = els.find("#text1")[0];
      t2 = els.find("#text2")[0];
      t3 = els.find("#text3")[0];
      t4 = els.find("#text4")[0];
      t1.value = "";
      t2.value = "";
      t2.required = false;
      t3.value = "";
      t3.disabled = false;
      t4.value = "";
      t4.required = false;
      t4.disabled = false;
      ctls.reset();
      expect(t1.value).to.equal("one");
      expect(t2.value).to.equal("two");
      expect(t2.required).to.equal(true);
      expect(t3.value).to.equal("three");
      expect(t3.disabled).to.equal(true);
      expect(t4.value).to.equal("four");
      expect(t4.required).to.equal(true);
      return expect(t4.disabled).to.equal(true);
    });
  });
  describe("@clear()", function() {
    return it("clears values, checked, and selected", function() {
      var ctls, els, root;
      root = trees.byId("initialState");
      els = $(root);
      ctls = $(root).controls();
      ctls.clear();
      expect(every(ctls.filter("[type='text']"), function(el) {
        return el.value === "";
      })).to.equal(true);
      expect(every(ctls.filter(CHECKABLE), function(el) {
        return el.checked === false;
      })).to.equal(true);
      return expect(every(ctls.asJQuery().find("option"), function(el) {
        return el.selected === false;
      })).to.equal(true);
    });
  });
  describe("@propValues()", function() {});
  describe("@values()", function() {});
  describe("@check", function() {
    return it("checks all checkable inputs", function() {
      cSel.check();
      return expect(every(cSel.filter(CHECKABLE), function(el) {
        return el.checked === true;
      })).to.equal(true);
    });
  });
  describe("@uncheck", function() {
    return it("unchecks all checkable inputs", function() {
      cSel.check();
      cSel.uncheck();
      return expect(every(cSel.filter(CHECKABLE), function(el) {
        return $(el).prop("checked") === false;
      })).to.equal(true);
    });
  });
  describe("@require", function() {
    return it("makes all selected controls required", function() {
      cSel.require();
      return expect(every(cSel.not("button"), function(el) {
        return el.required === true;
      })).to.equal(true);
    });
  });
  describe("@unrequire", function() {
    return it("makes all selected controls not required", function() {
      cSel.require();
      expect(every(cSel.not("button"), function(el) {
        return el.required === true;
      })).to.equal(true);
      cSel.unrequire();
      return expect(every(cSel, function(el) {
        return el.required === false;
      })).to.equal(true);
    });
  });
  describe("@disable", function() {
    return it("makes selected controls disabled", function() {
      cSel.disable();
      return expect(every(cSel.not("button"), function(el) {
        return el.disabled === true;
      })).to.equal(true);
    });
  });
  describe("@enable", function() {
    return it("makes selected controls enabled", function() {
      cSel.disable();
      expect(every(cSel.not("button"), function(el) {
        return el.disabled === true;
      })).to.equal(true);
      cSel.enable();
      return expect(every(cSel.not("button"), function(el) {
        return el.disabled === false;
      })).to.equal(true);
    });
  });
  describe("@labels", function() {
    return it("selects the labels of the controls", function() {
      var lbls, root;
      root = trees.byId("with-labels");
      lbls = reduce(root.querySelectorAll("input"), function(acc, el) {
        if (el.labels) {
          [].push.apply(acc, slice(el.labels));
        }
        return acc;
      }, []);
      return expect(sameSelection($(root).controls().labels(), lbls)).to.be["true"];
    });
  });
  describe("@valid", function() {
    it("delegates to Controls.validateElement", function() {
      var stub;
      stub = sinon.stub(Controls, "validateElement");
      cSel.valid();
      expect(stub.called).to.be["true"];
      return stub.restore();
    });
    it("returns true when each element passes Controls.validateElement", function() {
      var stub;
      stub = sinon.stub(Controls, "validateElement", function() {
        return true;
      });
      expect(cSel.valid()).to.be["true"];
      expect(stub.callCount).to.equal(cSel.length);
      return stub.restore();
    });
    return it("returns false when any element fails Controls.validateElement", function() {
      var stub;
      stub = sinon.stub(Controls, "validateElement", function() {
        return false;
      });
      expect(cSel.valid()).to.be["false"];
      expect(stub.callCount).to.equal(1);
      return stub.restore();
    });
  });
  describe("@bindValidator", function() {
    return it("");
  });
});

describe("jQuery traversal methods", function() {
  var ctls, root;
  root = void 0;
  ctls = void 0;
  beforeEach(function() {
    root = trees.byId("values");
    return ctls = $(root).controls();
  });
  describe("mutating methods return jQuery", function() {
    var methods;
    methods = ["add", "addBack", "andSelf", "children", "closest", "contents", "end", "find", "next", "nextAll", "nextUntil", "offsetParent", "parent", "parents", "parentsUntil", "prev", "prevAll", "prevUntil", "siblings"];
    methods.forEach(function(method) {
      return it("returns jQuery from @" + method + "()", function() {
        var selection;
        selection = ctls[method]();
        expect(selection).to.be["instanceof"](jQuery);
        return expect(selection).to.not.be instanceof Controls;
      });
    });
    return it("returns jQuery from @map()", function() {
      var mapResult;
      mapResult = ctls.map(function() {});
      expect(mapResult).to.be["instanceof"](jQuery);
      return expect(mapResult).to.not.be instanceof Controls;
    });
  });
  describe("subset methods return Controls", function() {
    var methods;
    methods = ["slice", "first", "last", "filter", "not", "eq"];
    return methods.forEach(function(method) {
      return it("returns Controls from @" + method + "()", function() {
        return expect(ctls[method]()).to.be["instanceof"](Controls);
      });
    });
  });
  return describe("each returns Controls", function() {
    return it("returns Controls from @each()", function() {
      return expect(ctls.each(function() {})).to.be["instanceof"](Controls);
    });
  });
});

describe("$.fn.mixinControls", function() {
  var BLACKLIST, ctls, root;
  BLACKLIST = ["constructor", "filter", "not", "slice", "pushStack", "end"];
  root = void 0;
  ctls = void 0;
  beforeEach(function() {
    root = trees.byId("values");
    return ctls = $(root).mixinControls();
  });
  return it("Should have all methods from Control.prototype except the blacklisted ones", function() {
    return Object.getOwnPropertyNames(Controls.prototype).every(function(method) {
      if (__indexOf.call(BLACKLIST, method) >= 0) {
        return ctls[method] === $.fn[method];
      } else {
        return ctls[method] === Controls.prototype[method];
      }
    });
  });
});

if (typeof window !== "undefined" && window !== null ? window.mochaPhantomJS : void 0) {
  window.mochaPhantomJS.run();
} else if (mocha) {
  mocha.run();
} else {
  throw new Error("No Mocha!");
}



},{"../src/jquery-controls.coffee":9,"./array-generics.coffee":1,"./selectors.coffee":3,"./spec-utilities.coffee":4}],3:[function(require,module,exports){
module.exports = {
  CHECKABLE: "input[type='radio'], input[type='checkbox']",
  BUTTON: "input[type='button'], button",
  TAGS: "input, select, button, textarea",
  RADIO: "[type='radio']",
  CHECK: "[type='checkbox']"
};



},{}],4:[function(require,module,exports){
var slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

slice = Function.prototype.call.bind(Array.prototype.slice);

module.exports = {
  sameSelection: function(objA, objB) {
    var arrA, arrB;
    if (objA.length !== objB.length) {
      return false;
    }
    arrA = $.unique(slice(objA));
    arrB = $.unique(slice(objB));
    return arrA.every(function(el) {
      return __indexOf.call(arrB, el) >= 0;
    });
  }
};



},{}],5:[function(require,module,exports){
var $, BUTTON, CHECKABLE, Controls, TAGS, Values, each, every, getControlNodes, getValue, isValid, jQuery, map, propMap, reduce, slice, validityListener, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

require("./matches-polyfill.coffee");

Values = require("./values.coffee");

isValid = require("./is-valid.coffee");

getValue = require("./get-value.coffee").getValueMappable;

_ref = require("./utils.coffee"), map = _ref.map, reduce = _ref.reduce, each = _ref.each, every = _ref.every, slice = _ref.slice;

_ref1 = require("./selectors.coffee"), CHECKABLE = _ref1.CHECKABLE, BUTTON = _ref1.BUTTON, TAGS = _ref1.TAGS;

$ = jQuery = window.jQuery;

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
        return each(this.querySelectorAll("option"), (function(_this) {
          return function(el) {
            var _ref2;
            if (_ref2 = el.value, __indexOf.call(data.value, _ref2) >= 0) {
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

  Controls.prototype.ofType = function(type) {
    return this.filter("[type=" + type + "]");
  };

  Controls.prototype.valid = function() {
    return every(this, Controls.validateElement);
  };

  Controls.prototype.bindValidator = function(fn) {};

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



},{"./get-value.coffee":6,"./is-valid.coffee":8,"./matches-polyfill.coffee":10,"./selectors.coffee":12,"./utils.coffee":13,"./values.coffee":15}],6:[function(require,module,exports){
var $, BUTTON, CHECKABLE, SELECTED, getValue, jQuery, _ref;

$ = jQuery = window.jQuery;

_ref = require("./selectors.coffee"), CHECKABLE = _ref.CHECKABLE, SELECTED = _ref.SELECTED, BUTTON = _ref.BUTTON;

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



},{"./selectors.coffee":12}],7:[function(require,module,exports){
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



},{"./controls.coffee":5,"./mixin.coffee":11}],8:[function(require,module,exports){
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
  validationFns = $.data(el, "controlValidators");
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



},{"./validations.coffee":14}],9:[function(require,module,exports){
module.exports = (function($) {
  require("./init.coffee");
  $.Controls = require("./controls.coffee");
  $.Values = require("./values.coffee");
  return void 0;
})(window.jQuery);



},{"./controls.coffee":5,"./init.coffee":7,"./values.coffee":15}],10:[function(require,module,exports){
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



},{}],11:[function(require,module,exports){
var $, BLACKLIST, Controls, jQuery, mixin,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$ = jQuery = window.jQuery;

Controls = require("./controls.coffee");

BLACKLIST = ["constructor", "filter", "not", "slice", "pushStack", "end"];

module.exports = mixin = function(obj, opt) {
  console.log(obj instanceof jQuery);
  Object.getOwnPropertyNames(Controls.prototype).forEach(function(method) {
    if (__indexOf.call(BLACKLIST, method) < 0) {
      return obj[method] = Controls.prototype[method];
    }
  });
  return obj;
};



},{"./controls.coffee":5}],12:[function(require,module,exports){
module.exports = {
  CHECKABLE: "input[type='radio'], input[type='checkbox']",
  BUTTON: "input[type='button'], button",
  TAGS: "input, select, button, textarea",
  RADIO: "[type='radio']",
  CHECK: "[type='checkbox']"
};



},{}],13:[function(require,module,exports){
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



},{}],14:[function(require,module,exports){
var $, CHECK, RADIO, document, html5Validation, jQuery, slice, v, _ref,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

slice = require("./utils.coffee").slice;

_ref = require("./selectors.coffee"), CHECK = _ref.CHECK, RADIO = _ref.RADIO;

$ = jQuery = window.jQuery;

document = window.document;

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
      return $("" + RADIO + "[name='" + this.name + "']").get().some(function(input) {
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
      len = $("" + CHECK + "[name='" + this.name + "']").filter(function() {
        return $(this).prop("checked");
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



},{"./selectors.coffee":12,"./utils.coffee":13}],15:[function(require,module,exports){
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



},{}]},{},[2]);
