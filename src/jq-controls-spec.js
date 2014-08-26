(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        return ctls[method] !== Controls.prototype[method];
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



},{"../src/jquery-controls.coffee":9,"./array-generics.coffee":2,"./selectors.coffee":3,"./spec-utilities.coffee":4}],2:[function(require,module,exports){
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



},{}],3:[function(require,module,exports){
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



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uaWNrYm90dG9tbGV5L0RvY3VtZW50cy9kZXYvZXhwZXJpbWVudHMvanF1ZXJ5LWNvbnRyb2xzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmlja2JvdHRvbWxleS9Eb2N1bWVudHMvZGV2L2V4cGVyaW1lbnRzL2pxdWVyeS1jb250cm9scy9zcGVjL2NvbnRyb2xzLXNwZWMuY29mZmVlIiwiL1VzZXJzL25pY2tib3R0b21sZXkvRG9jdW1lbnRzL2Rldi9leHBlcmltZW50cy9qcXVlcnktY29udHJvbHMvc3BlYy9hcnJheS1nZW5lcmljcy5jb2ZmZWUiLCIvVXNlcnMvbmlja2JvdHRvbWxleS9Eb2N1bWVudHMvZGV2L2V4cGVyaW1lbnRzL2pxdWVyeS1jb250cm9scy9zcGVjL3NlbGVjdG9ycy5jb2ZmZWUiLCIvVXNlcnMvbmlja2JvdHRvbWxleS9Eb2N1bWVudHMvZGV2L2V4cGVyaW1lbnRzL2pxdWVyeS1jb250cm9scy9zcGVjL3NwZWMtdXRpbGl0aWVzLmNvZmZlZSIsIi9Vc2Vycy9uaWNrYm90dG9tbGV5L0RvY3VtZW50cy9kZXYvZXhwZXJpbWVudHMvanF1ZXJ5LWNvbnRyb2xzL3NyYy9jb250cm9scy5jb2ZmZWUiLCIvVXNlcnMvbmlja2JvdHRvbWxleS9Eb2N1bWVudHMvZGV2L2V4cGVyaW1lbnRzL2pxdWVyeS1jb250cm9scy9zcmMvZ2V0LXZhbHVlLmNvZmZlZSIsIi9Vc2Vycy9uaWNrYm90dG9tbGV5L0RvY3VtZW50cy9kZXYvZXhwZXJpbWVudHMvanF1ZXJ5LWNvbnRyb2xzL3NyYy9pbml0LmNvZmZlZSIsIi9Vc2Vycy9uaWNrYm90dG9tbGV5L0RvY3VtZW50cy9kZXYvZXhwZXJpbWVudHMvanF1ZXJ5LWNvbnRyb2xzL3NyYy9pcy12YWxpZC5jb2ZmZWUiLCIvVXNlcnMvbmlja2JvdHRvbWxleS9Eb2N1bWVudHMvZGV2L2V4cGVyaW1lbnRzL2pxdWVyeS1jb250cm9scy9zcmMvanF1ZXJ5LWNvbnRyb2xzLmNvZmZlZSIsIi9Vc2Vycy9uaWNrYm90dG9tbGV5L0RvY3VtZW50cy9kZXYvZXhwZXJpbWVudHMvanF1ZXJ5LWNvbnRyb2xzL3NyYy9tYXRjaGVzLXBvbHlmaWxsLmNvZmZlZSIsIi9Vc2Vycy9uaWNrYm90dG9tbGV5L0RvY3VtZW50cy9kZXYvZXhwZXJpbWVudHMvanF1ZXJ5LWNvbnRyb2xzL3NyYy9taXhpbi5jb2ZmZWUiLCIvVXNlcnMvbmlja2JvdHRvbWxleS9Eb2N1bWVudHMvZGV2L2V4cGVyaW1lbnRzL2pxdWVyeS1jb250cm9scy9zcmMvc2VsZWN0b3JzLmNvZmZlZSIsIi9Vc2Vycy9uaWNrYm90dG9tbGV5L0RvY3VtZW50cy9kZXYvZXhwZXJpbWVudHMvanF1ZXJ5LWNvbnRyb2xzL3NyYy91dGlscy5jb2ZmZWUiLCIvVXNlcnMvbmlja2JvdHRvbWxleS9Eb2N1bWVudHMvZGV2L2V4cGVyaW1lbnRzL2pxdWVyeS1jb250cm9scy9zcmMvdmFsaWRhdGlvbnMuY29mZmVlIiwiL1VzZXJzL25pY2tib3R0b21sZXkvRG9jdW1lbnRzL2Rldi9leHBlcmltZW50cy9qcXVlcnktY29udHJvbHMvc3JjL3ZhbHVlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLGlMQUFBO0VBQUEscUpBQUE7O0FBQUEsT0FBQSxDQUFRLCtCQUFSLENBQUEsQ0FBQTs7QUFBQSxFQUVBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLE1BSUEsR0FBUyxNQUFNLENBQUMsTUFKaEIsQ0FBQTs7QUFBQSxrQkFLRSxRQUFGLEVBQVksZ0JBQUEsTUFMWixDQUFBOztBQUFBLEtBTUEsR0FBUSxNQUFNLENBQUMsS0FOZixDQUFBOztBQUFBLFNBT2EsTUFBTSxDQUFDLEtBQWxCLE1BUEYsQ0FBQTs7QUFBQSxnQkFTb0IsT0FBQSxDQUFRLHlCQUFSLEVBQWxCLGFBVEYsQ0FBQTs7QUFBQSxPQWdCYSxPQUFBLENBQVEs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LENBQUEsRUFBRCxDQUFJLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBZCxFQUFIO0VBQUEsQ0F6Q04sQ0FBQTs7QUFBQSxtQkEyQ0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtXQUFHLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFmLEVBQUg7RUFBQSxDQTNDWCxDQUFBOztnQkFBQTs7SUFERixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUgXCIuLi9zcmMvanF1ZXJ5LWNvbnRyb2xzLmNvZmZlZVwiXG5cbmZzID0gcmVxdWlyZSBcImZzXCJcblxualF1ZXJ5ID0gd2luZG93LmpRdWVyeVxueyBDb250cm9scywgVmFsdWVzIH0gPSBqUXVlcnlcbnNpbm9uID0gd2luZG93LnNpbm9uXG57IGV4cGVjdCB9ID0gd2luZG93LmNoYWlcblxueyBzYW1lU2VsZWN0aW9uIH0gPSByZXF1aXJlIFwiLi9zcGVjLXV0aWxpdGllcy5jb2ZmZWVcIlxuXG57IG1hcFxuICBzb21lXG4gIGV2ZXJ5XG4gIHNsaWNlXG4gIGZpbHRlclxuICByZWR1Y2UgfSA9IHJlcXVpcmUgXCIuL2FycmF5LWdlbmVyaWNzLmNvZmZlZVwiXG5cbnsgQ0hFQ0tBQkxFXG4gIEJVVFRPTlxuICBUQUdTXG4gIFJBRElPXG4gIENIRUNLIH0gPSByZXF1aXJlIFwiLi9zZWxlY3RvcnMuY29mZmVlXCJcblxudHlwZSA9IC0+XG4gIHN0ciA9IFtdXG4gIGZvciBhcmcgaW4gYXJndW1lbnRzXG4gICAgc3RyLnB1c2ggXCJbdHlwZT0jeyBhcmcgfV1cIlxuICBzdHIuam9pbiBcIiwgXCJcblxuZmlyc3QgPSAoIGFyciApIC0+IGFyclsgMCBdXG5sYXN0ID0gKCBhcnIgKSAtPiBhcnJbIGFyci5sZW5ndGggLSAxIF1cblxuIyBodG1sRmlsZXMgPSBbXG4jICAgXCIuL3NwZWMvaHRtbC92YWx1ZXMuaHRtbFwiXG4jICAgXCIuL3NwZWMvaHRtbC9taXhlZC5odG1sXCJcbiMgICBcIi4vc3BlYy9odG1sL3ZhbGlkYXRpb24uaHRtbFwiXG4jICAgXCIuL3NwZWMvaHRtbC93aXRoLWluaXRpYWwtc3RhdGUuaHRtbFwiXG4jICAgXCIuL3NwZWMvaHRtbC93aXRoLWxhYmVscy5odG1sXCJcbiMgXVxuI1xudHJlZXMgPSB3aW5kb3cudHJlZXMgPSBkbyAtPlxuICBzdG9yYWdlID0ge31cbiAgYnlJZDogKCBpZCApIC0+XG4gICAgaWYgc3RvcmFnZVtpZF0gdGhlbiAkLnBhcnNlSFRNTCggc3RvcmFnZVtpZF0gKVswXSBlbHNlIG51bGxcbiAgYWRkVHJlZTogKCBodG1sU3RyICkgLT5cbiAgICBpZCA9ICQoIGh0bWxTdHIgKS5hdHRyIFwiaWRcIlxuICAgIHN0b3JhZ2VbaWRdID0gaHRtbFN0clxuXG5bXG4gIGZzLnJlYWRGaWxlU3luYyBcIiN7IF9fZGlybmFtZSB9L2h0bWwvdmFsdWVzLmh0bWxcIiwgXCJ1dGY4XCJcbiAgZnMucmVhZEZpbGVTeW5jIFwiI3sgX19kaXJuYW1lIH0vaHRtbC9taXhlZC5odG1sXCIsIFwidXRmOFwiXG4gIGZzLnJlYWRGaWxlU3luYyBcIiN7IF9fZGlybmFtZSB9L2h0bWwvdmFsaWRhdGlvbi5odG1sXCIsIFwidXRmOFwiXG4gIGZzLnJlYWRGaWxlU3luYyBcIiN7IF9fZGlybmFtZSB9L2h0bWwvd2l0aC1pbml0aWFsLXN0YXRlLmh0bWxcIiwgXCJ1dGY4XCJcbiAgZnMucmVhZEZpbGVTeW5jIFwiI3sgX19kaXJuYW1lIH0vaHRtbC93aXRoLWxhYmVscy5odG1sXCIsIFwidXRmOFwiXG5dLm1hcCB0cmVlcy5hZGRUcmVlLmJpbmQgdHJlZXNcblxuIyAkLndoZW4uYXBwbHkgJCwgaHRtbEZpbGVzLm1hcCAkLmdldFxuIyAgIC50aGVuIC0+XG4jICAgICBzbGljZSggYXJndW1lbnRzICkubWFwKCBmaXJzdCApLm1hcCggdHJlZXMuYWRkVHJlZSApXG5cblxuZGVzY3JpYmUgXCJqUXVlcnkuZm4uY29udHJvbHMoKVwiLCAtPlxuXG4gIGRlc2NyaWJlIFwiYmFzaWNzXCIsIC0+XG4gICAgaXQgXCJleGlzdHNcIiwgLT5cbiAgICAgIGV4cGVjdCggalF1ZXJ5LmZuLmNvbnRyb2xzICkudG8uYmUuYSBcImZ1bmN0aW9uXCJcblxuICAgIGl0IFwid29ya3NcIiwgLT5cbiAgICAgIHJvb3QgPSB0cmVlcy5ieUlkKCBcInZhbHVlc1wiIClcbiAgICAgIGNTZWwgPSAkKCByb290ICkuY29udHJvbHMoKVxuICAgICAgalNlbCA9ICQoIHJvb3QgKS5maW5kIFwiaW5wdXQsIGJ1dHRvbiwgc2VsZWN0XCJcbiAgICAgIGV4cGVjdCggc2FtZVNlbGVjdGlvbiBjU2VsLCBqU2VsICkudG8uZXF1YWwgdHJ1ZVxuXG5kZXNjcmliZSBcIkNvbnRyb2xzLnZhbGlkYXRlRWxlbWVudCgpXCIsIC0+XG5cbiAgdmFsaWQgPSBDb250cm9scy52YWxpZGF0ZUVsZW1lbnRcblxuICByb290ID0gbnVsbFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICByb290ID0gdHJlZXMuYnlJZCBcInZhbGlkYXRpb25cIlxuXG4gIGRlc2NyaWJlIFwidmFsaWRhdGlvbiBhZ2FpbnN0IGEgcGFzc2VkIGluIGZ1bmN0aW9uXCIsIC0+XG4gICAgdmFsaWRhdG9yQSA9IC0+XG4gICAgICBcIjFcIiBpbiBAdmFsdWVcbiAgICB2YWxpZGF0b3JCID0gKCBzdHIgKSAtPlxuICAgICAgc3RyICsgQHZhbHVlIGlzIFwiYWJjMTIzXCJcbiAgICB0aGlzSXMgPSAoIG9iaiApIC0+XG4gICAgICBvYmogaXMgQFxuXG4gICAgaXQgXCJhY2NlcHRzIGEgZnVuY3Rpb25cIiwgLT5cbiAgICAgIGVscyA9ICQoIHJvb3QgKS5maW5kKCBcIi5jdXN0b20tdmFsaWRhdGlvblwiIClcbiAgICAgIGV4cGVjdCggdmFsaWQoIGVsc1swXSwgdmFsaWRhdG9yQSApICkudG8uZXF1YWwgdHJ1ZVxuICAgICAgZXhwZWN0KCB2YWxpZCggZWxzWzFdLCB2YWxpZGF0b3JBICkgKS50by5lcXVhbCBmYWxzZVxuXG4gICAgaXQgXCJhY2NlcHRzIGFkZGl0aW9uYWwgYXJndW1lbnRzXCIsIC0+XG4gICAgICBlbHMgPSAkKCByb290ICkuZmluZCggXCIuY3VzdG9tLXZhbGlkYXRpb25cIiApXG4gICAgICBleHBlY3QoIHZhbGlkKCBlbHNbMF0sIHZhbGlkYXRvckIsIFwiYWJjXCIgKSApLnRvLmVxdWFsIHRydWVcbiAgICAgIGV4cGVjdCggdmFsaWQoIGVsc1sxXSwgdmFsaWRhdG9yQiwgXCJhYmNcIiApICkudG8uZXF1YWwgZmFsc2VcblxuICAgIGl0IFwiY2FsbHMgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIGVsZW1lbnQgYXMgJ3RoaXMnXCIsIC0+XG4gICAgICBlbHMgPSAkKCByb290ICkuZmluZCggXCIuY3VzdG9tLXZhbGlkYXRpb25cIiApXG4gICAgICBleHBlY3QoIHZhbGlkKCBlbHNbMF0sIHRoaXNJcywgZWxzWzBdICkgKS50by5lcXVhbCB0cnVlXG5cbiAgZGVzY3JpYmUgXCJ2YWxpZGF0aW9uIGFnYWluc3QgYSBkYXRhLWNvbnRyb2wtdmFsaWRhdGlvbiBhdHRyaWJ1dGVcIiwgLT5cbiAgICBpdCBcInZhbGlkYXRlcyBhbiBpbnB1dCBhZ2FpbnN0IHByZXNldCBhdHRyaWJ1dGUgdmFsaWRhdG9yc1wiLCAtPlxuICAgICAgZWxzID0gJCggcm9vdCApLmZpbmQoIFwiLmF0dHItdmFsaWRhdGlvblwiIClcbiAgICAgIGV4cGVjdCggdmFsaWQoIGVsc1swXSApICkudG8uZXF1YWwgdHJ1ZVxuICAgICAgZXhwZWN0KCB2YWxpZCggZWxzWzFdICkgKS50by5lcXVhbCBmYWxzZVxuXG4gIGRlc2NyaWJlIFwidmFsaWRhdGlvbiBhZ2FpbnN0IGJvdW5kIHZhbGlkYXRvcnNcIiwgLT5cbiAgICBpdCBcInZhbGlkYXRlcyBhZ2FpbnN0IGFsbCBwcmVzZW50IGF0dGFjaGVkIHZhbGlkYXRvcnNcIiwgLT5cbiAgICAgIGVscyA9ICQoIHJvb3QgKS5maW5kKCBcIi5kYXRhLXZhbGlkYXRpb25cIiApXG4gICAgICAkLmRhdGEgZWxzWzBdLCBcImNvbnRyb2xWYWxpZGF0b3JzXCIsIFtcbiAgICAgICAgKCAtPiBAdmFsdWUgPT0gXCIxMjNcIiApXG4gICAgICAgICggLT4gQHZhbHVlICE9IFwiYWJjXCIgKVxuICAgICAgXVxuICAgICAgJC5kYXRhIGVsc1sxXSwgXCJjb250cm9sVmFsaWRhdG9yc1wiLCBbXG4gICAgICAgICggLT4gQHZhbHVlICE9IFwiYWJjXCIgKVxuICAgICAgICAoIC0+IEB2YWx1ZSA9PSBcImFiY1wiIClcbiAgICAgIF1cbiAgICAgIGV4cGVjdCggdmFsaWQoIGVsc1swXSApICkudG8uZXF1YWwgdHJ1ZVxuICAgICAgZXhwZWN0KCB2YWxpZCggZWxzWzFdICkgKS50by5lcXVhbCBmYWxzZVxuICAgICAgJC5kYXRhIGVsc1swXSwgXCJjb250cm9sVmFsaWRhdG9yc1wiLCBcIlwiXG4gICAgICAkLmRhdGEgZWxzWzFdLCBcImNvbnRyb2xWYWxpZGF0b3JzXCIsIFwiXCJcblxuICAjIGRlc2NyaWJlIFwidmFsaWRhdGlvbiB3aXRoIEhUTUw1XCJcblxuZGVzY3JpYmUgXCJDb250cm9sIHByb3RvdHlwZSBtZXRob2RzXCIsIC0+XG5cbiAgY1NlbCA9IHVuZGVmaW5lZFxuICBqU2VsID0gdW5kZWZpbmVkXG4gIHZTZWwgPSB1bmRlZmluZWRcbiAgcXNhID0gdW5kZWZpbmVkXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHJvb3QgPSB0cmVlcy5ieUlkKCBcInZhbHVlc1wiIClcbiAgICBqU2VsID0gJCggcm9vdCApXG4gICAgY1NlbCA9ICQoIHJvb3QgKS5jb250cm9scygpXG4gICAgcXNhID0gRWxlbWVudDo6cXVlcnlTZWxlY3RvckFsbC5iaW5kKCByb290IClcblxuICBkZXNjcmliZSBcIkBmaWx0ZXIoKVwiLCAtPlxuICAgIGl0IFwicmV0dXJucyBhIENvbnRyb2xzIGluc3RhbmNlXCIsIC0+XG4gICAgICBleHBlY3QoIGNTZWwuZmlsdGVyIFwiYnV0dG9uXCIgKS50by5iZS5pbnN0YW5jZW9mIENvbnRyb2xzXG5cbiAgICBpdCBcImFjY2VwdHMgYSBzZWxlY3RvclwiLCAtPlxuICAgICAgZmx0ID0gY1NlbC5maWx0ZXIgXCJidXR0b25cIlxuICAgICAgYnRuID0galNlbC5maW5kIFwiYnV0dG9uXCJcbiAgICAgIGV4cGVjdCggc2FtZVNlbGVjdGlvbiBmbHQsIGJ0biApLnRvLmVxdWFsIHRydWVcblxuICAgIGl0IFwiYWNjZXB0cyBhbiBhcnJheSBvZiBET00gZWxlbWVudHNcIiwgLT5cbiAgICAgIGJ0biA9IHFzYSBcImJ1dHRvblwiXG4gICAgICBmbHQgPSBjU2VsLmZpbHRlciBcImJ1dHRvblwiXG4gICAgICBleHBlY3QoIHNhbWVTZWxlY3Rpb24gZmx0LCBidG4gKS50by5lcXVhbCB0cnVlXG5cbiAgICBpdCBcImFjY2VwdHMgYSBmdW5jdGlvblwiLCAtPlxuICAgICAgZmx0ID0gY1NlbC5maWx0ZXIgLT5cbiAgICAgICAgQHRhZ05hbWUudG9Mb3dlckNhc2UoKSBpcyBcImJ1dHRvblwiXG4gICAgICBidG4gPSBxc2EgXCJidXR0b25cIlxuICAgICAgZXhwZWN0KCBzYW1lU2VsZWN0aW9uIGZsdCwgYnRuICkudG8uZXF1YWwgdHJ1ZVxuXG4gICAgaXQgXCJhY2NlcHRzIGEgalF1ZXJ5IHNlbGVjdGlvblwiLCAtPlxuICAgICAgYnRuID0galNlbC5maW5kIFwiYnV0dG9uXCJcbiAgICAgIGZsdCA9IGNTZWwuZmlsdGVyIGJ0blxuICAgICAgZXhwZWN0KCBzYW1lU2VsZWN0aW9uIGZsdCwgYnRuICkudG8uZXF1YWwgdHJ1ZVxuXG4gICAgeGl0IFwiYWNjZXB0cyBhIENvbnRyb2xzIHNlbGVjdGlvblwiXG5cbiAgZGVzY3JpYmUgXCJAbm90KClcIiwgLT5cblxuICAgIGl0IFwicmV0dXJucyBhIENvbnRyb2xzIGluc3RhbmNlXCIsIC0+XG4gICAgICBleHBlY3QoIGNTZWwubm90IFwiaW5wdXRcIiApLnRvLmJlLmluc3RhbmNlb2YgQ29udHJvbHNcblxuICAgIGl0IFwiYWNjZXB0cyBhIHNlbGVjdG9yXCIsIC0+XG4gICAgICBqTm9JbnB1dCA9IGpTZWwuZmluZCggVEFHUyApLm5vdCBcImlucHV0XCJcbiAgICAgIGNOb0lucHV0ID0gY1NlbC5ub3QgXCJpbnB1dFwiXG4gICAgICBleHBlY3QoIHNhbWVTZWxlY3Rpb24gak5vSW5wdXQsIGNOb0lucHV0ICkudG8uZXF1YWwgdHJ1ZVxuXG4gICAgaXQgXCJhY2NlcHRzIGFuIGFycmF5IG9mIERPTSBlbGVtZW50c1wiLCAtPlxuICAgICAgaW5wdXRzID0galNlbC5maW5kKCBcImlucHV0XCIgKS5nZXQoKVxuICAgICAgY05vSW5wdXQgPSBjU2VsLm5vdCBpbnB1dHNcbiAgICAgIGhhc0FuSW5wdXQgPSBzb21lIGNOb0lucHV0LCAoIGVsICkgLT5cbiAgICAgICAgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpIGlzIFwiaW5wdXRcIlxuICAgICAgZXhwZWN0KCBoYXNBbklucHV0ICkudG8uZXF1YWwgZmFsc2VcblxuICAgIGl0IFwiYWNjZXB0cyBhIGZ1bmN0aW9uXCIsIC0+XG4gICAgICBjRW1wdHlWYWx1ZSA9IGNTZWwubm90IC0+XG4gICAgICAgIEB2YWx1ZSBpcyBcIlwiXG4gICAgICB2RW1wdHlWYWx1ZSA9IGZpbHRlciBxc2EoIFRBR1MgKSwgKCBlbCApIC0+XG4gICAgICAgIGVsLnZhbHVlIGlzbnQgXCJcIlxuICAgICAgZXhwZWN0KCBzYW1lU2VsZWN0aW9uIGNFbXB0eVZhbHVlLCB2RW1wdHlWYWx1ZSApLnRvLmVxdWFsIHRydWVcblxuICAgIGl0IFwiYWNjZXB0cyBhIGpRdWVyeSBzZWxlY3Rpb25cIiwgLT5cbiAgICAgIGpFbXB0eVZhbHVlID0galNlbC5maWx0ZXIgLT5cbiAgICAgICAgQHZhbHVlIGlzIFwiXCJcbiAgICAgIGNOb0VtcHR5VmFsdWUgPSBqU2VsLm5vdCBqRW1wdHlWYWx1ZVxuICAgICAgaGFzRW1wdHlWYWx1ZXMgPSBzb21lIGNOb0VtcHR5VmFsdWUsICggZWwgKSAtPlxuICAgICAgICBAdmFsdWUgaXMgXCJcIlxuICAgICAgZXhwZWN0KCBoYXNFbXB0eVZhbHVlcyApLnRvLmVxdWFsIGZhbHNlXG5cbiAgICB4aXQgXCJhY2NlcHRzIGEgQ29udHJvbHMgc2VsZWN0aW9uXCJcblxuICBkZXNjcmliZSBcIkByZXNldCgpXCIsIC0+XG4gICAgaXQgXCJyZXNldHMgZGlzYWJsZWQsIHJlcXVpcmVkLCBhbmQgdmFsdWUgdG8gdGhlaXIgcmVzZXRTdGF0ZVwiLCAtPlxuICAgICAgcm9vdCA9IHRyZWVzLmJ5SWQgXCJpbml0aWFsU3RhdGVcIlxuICAgICAgZWxzID0gJCggcm9vdCApXG4gICAgICBjdGxzID0gJCggcm9vdCApLmNvbnRyb2xzKClcbiAgICAgIHQxID0gZWxzLmZpbmQoIFwiI3RleHQxXCIgKVswXVxuICAgICAgdDIgPSBlbHMuZmluZCggXCIjdGV4dDJcIiApWzBdXG4gICAgICB0MyA9IGVscy5maW5kKCBcIiN0ZXh0M1wiIClbMF1cbiAgICAgIHQ0ID0gZWxzLmZpbmQoIFwiI3RleHQ0XCIgKVswXVxuICAgICAgdDEudmFsdWUgPSBcIlwiXG4gICAgICB0Mi52YWx1ZSA9IFwiXCJcbiAgICAgIHQyLnJlcXVpcmVkID0gZmFsc2VcbiAgICAgIHQzLnZhbHVlID0gXCJcIlxuICAgICAgdDMuZGlzYWJsZWQgPSBmYWxzZVxuICAgICAgdDQudmFsdWUgPSBcIlwiXG4gICAgICB0NC5yZXF1aXJlZCA9IGZhbHNlXG4gICAgICB0NC5kaXNhYmxlZCA9IGZhbHNlXG4gICAgICBjdGxzLnJlc2V0KClcbiAgICAgIGV4cGVjdCggdDEudmFsdWUgKS50by5lcXVhbCBcIm9uZVwiXG4gICAgICBleHBlY3QoIHQyLnZhbHVlICkudG8uZXF1YWwgXCJ0d29cIlxuICAgICAgZXhwZWN0KCB0Mi5yZXF1aXJlZCApLnRvLmVxdWFsIHRydWVcbiAgICAgIGV4cGVjdCggdDMudmFsdWUgKS50by5lcXVhbCBcInRocmVlXCJcbiAgICAgIGV4cGVjdCggdDMuZGlzYWJsZWQgKS50by5lcXVhbCB0cnVlXG4gICAgICBleHBlY3QoIHQ0LnZhbHVlICkudG8uZXF1YWwgXCJmb3VyXCJcbiAgICAgIGV4cGVjdCggdDQucmVxdWlyZWQgKS50by5lcXVhbCB0cnVlXG4gICAgICBleHBlY3QoIHQ0LmRpc2FibGVkICkudG8uZXF1YWwgdHJ1ZVxuXG4gIGRlc2NyaWJlIFwiQGNsZWFyKClcIiwgLT5cbiAgICBpdCBcImNsZWFycyB2YWx1ZXMsIGNoZWNrZWQsIGFuZCBzZWxlY3RlZFwiLCAtPlxuICAgICAgcm9vdCA9IHRyZWVzLmJ5SWQgXCJpbml0aWFsU3RhdGVcIlxuICAgICAgZWxzID0gJCggcm9vdCApXG4gICAgICBjdGxzID0gJCggcm9vdCApLmNvbnRyb2xzKClcbiAgICAgIGN0bHMuY2xlYXIoKVxuICAgICAgZXhwZWN0IGV2ZXJ5IGN0bHMuZmlsdGVyKCBcIlt0eXBlPSd0ZXh0J11cIiApLCAoIGVsICkgLT5cbiAgICAgICAgZWwudmFsdWUgaXMgXCJcIlxuICAgICAgLnRvLmVxdWFsIHRydWVcblxuICAgICAgZXhwZWN0IGV2ZXJ5IGN0bHMuZmlsdGVyKCBDSEVDS0FCTEUgKSwgKCBlbCApIC0+XG4gICAgICAgIGVsLmNoZWNrZWQgaXMgZmFsc2VcbiAgICAgIC50by5lcXVhbCB0cnVlXG5cbiAgICAgIGV4cGVjdCBldmVyeSBjdGxzLmFzSlF1ZXJ5KCkuZmluZCggXCJvcHRpb25cIiApLCAoIGVsICkgLT5cbiAgICAgICAgZWwuc2VsZWN0ZWQgaXMgZmFsc2VcbiAgICAgIC50by5lcXVhbCB0cnVlXG5cbiAgZGVzY3JpYmUgXCJAcHJvcFZhbHVlcygpXCIsIC0+XG5cbiAgZGVzY3JpYmUgXCJAdmFsdWVzKClcIiwgLT5cblxuICBkZXNjcmliZSBcIkBjaGVja1wiLCAtPlxuICAgIGl0IFwiY2hlY2tzIGFsbCBjaGVja2FibGUgaW5wdXRzXCIsIC0+XG4gICAgICBjU2VsLmNoZWNrKClcblxuICAgICAgZXhwZWN0IGV2ZXJ5IGNTZWwuZmlsdGVyKCBDSEVDS0FCTEUgKSwgKCBlbCApIC0+XG4gICAgICAgIGVsLmNoZWNrZWQgaXMgdHJ1ZVxuICAgICAgLnRvLmVxdWFsIHRydWVcblxuICBkZXNjcmliZSBcIkB1bmNoZWNrXCIsIC0+XG4gICAgaXQgXCJ1bmNoZWNrcyBhbGwgY2hlY2thYmxlIGlucHV0c1wiLCAtPlxuXG4gICAgICBjU2VsLmNoZWNrKClcbiAgICAgIGNTZWwudW5jaGVjaygpXG5cbiAgICAgIGV4cGVjdCBldmVyeSBjU2VsLmZpbHRlciggQ0hFQ0tBQkxFICksICggZWwgKSAtPlxuICAgICAgICAkKCBlbCApLnByb3AoIFwiY2hlY2tlZFwiICkgaXMgZmFsc2VcbiAgICAgIC50by5lcXVhbCB0cnVlXG5cbiAgZGVzY3JpYmUgXCJAcmVxdWlyZVwiLCAtPlxuICAgIGl0IFwibWFrZXMgYWxsIHNlbGVjdGVkIGNvbnRyb2xzIHJlcXVpcmVkXCIsIC0+XG4gICAgICBjU2VsLnJlcXVpcmUoKVxuXG4gICAgICBleHBlY3QgZXZlcnkgY1NlbC5ub3QoIFwiYnV0dG9uXCIgKSwgKCBlbCApIC0+XG4gICAgICAgIGVsLnJlcXVpcmVkIGlzIHRydWVcbiAgICAgIC50by5lcXVhbCB0cnVlXG5cbiAgZGVzY3JpYmUgXCJAdW5yZXF1aXJlXCIsIC0+XG4gICAgaXQgXCJtYWtlcyBhbGwgc2VsZWN0ZWQgY29udHJvbHMgbm90IHJlcXVpcmVkXCIsIC0+XG4gICAgICBjU2VsLnJlcXVpcmUoKVxuXG4gICAgICBleHBlY3QgZXZlcnkgY1NlbC5ub3QoIFwiYnV0dG9uXCIgKSwgKCBlbCApIC0+XG4gICAgICAgIGVsLnJlcXVpcmVkIGlzIHRydWVcbiAgICAgIC50by5lcXVhbCB0cnVlXG5cbiAgICAgIGNTZWwudW5yZXF1aXJlKClcblxuICAgICAgZXhwZWN0IGV2ZXJ5IGNTZWwsICggZWwgKSAtPlxuICAgICAgICBlbC5yZXF1aXJlZCBpcyBmYWxzZVxuICAgICAgLnRvLmVxdWFsIHRydWVcblxuXG4gIGRlc2NyaWJlIFwiQGRpc2FibGVcIiwgLT5cbiAgICBpdCBcIm1ha2VzIHNlbGVjdGVkIGNvbnRyb2xzIGRpc2FibGVkXCIsIC0+XG4gICAgICBjU2VsLmRpc2FibGUoKVxuICAgICAgZXhwZWN0IGV2ZXJ5IGNTZWwubm90KCBcImJ1dHRvblwiICksICggZWwgKSAtPlxuICAgICAgICBlbC5kaXNhYmxlZCBpcyB0cnVlXG4gICAgICAudG8uZXF1YWwgdHJ1ZVxuXG5cbiAgZGVzY3JpYmUgXCJAZW5hYmxlXCIsIC0+XG4gICAgaXQgXCJtYWtlcyBzZWxlY3RlZCBjb250cm9scyBlbmFibGVkXCIsIC0+XG4gICAgICBjU2VsLmRpc2FibGUoKVxuICAgICAgZXhwZWN0IGV2ZXJ5IGNTZWwubm90KCBcImJ1dHRvblwiICksICggZWwgKSAtPlxuICAgICAgICBlbC5kaXNhYmxlZCBpcyB0cnVlXG4gICAgICAudG8uZXF1YWwgdHJ1ZVxuXG4gICAgICBjU2VsLmVuYWJsZSgpXG4gICAgICBleHBlY3QgZXZlcnkgY1NlbC5ub3QoIFwiYnV0dG9uXCIgKSwgKCBlbCApIC0+XG4gICAgICAgIGVsLmRpc2FibGVkIGlzIGZhbHNlXG4gICAgICAudG8uZXF1YWwgdHJ1ZVxuXG5cbiAgZGVzY3JpYmUgXCJAbGFiZWxzXCIsIC0+XG4gICAgaXQgXCJzZWxlY3RzIHRoZSBsYWJlbHMgb2YgdGhlIGNvbnRyb2xzXCIsIC0+XG4gICAgICByb290ID0gdHJlZXMuYnlJZCBcIndpdGgtbGFiZWxzXCJcbiAgICAgIGxibHMgPSByZWR1Y2Ugcm9vdC5xdWVyeVNlbGVjdG9yQWxsKCBcImlucHV0XCIgKSwgKCBhY2MsIGVsICkgLT5cbiAgICAgICAgaWYgZWwubGFiZWxzXG4gICAgICAgICAgW10ucHVzaC5hcHBseSBhY2MsIHNsaWNlIGVsLmxhYmVsc1xuICAgICAgICBhY2NcbiAgICAgICwgW11cbiAgICAgIGV4cGVjdCggc2FtZVNlbGVjdGlvbiAkKCByb290ICkuY29udHJvbHMoKS5sYWJlbHMoKSwgbGJscyApLnRvLmJlLnRydWVcblxuXG4gIGRlc2NyaWJlIFwiQHZhbGlkXCIsIC0+XG5cbiAgICBpdCBcImRlbGVnYXRlcyB0byBDb250cm9scy52YWxpZGF0ZUVsZW1lbnRcIiwgLT5cbiAgICAgIHN0dWIgPSBzaW5vbi5zdHViIENvbnRyb2xzLCBcInZhbGlkYXRlRWxlbWVudFwiXG4gICAgICBjU2VsLnZhbGlkKClcbiAgICAgIGV4cGVjdCggc3R1Yi5jYWxsZWQgKS50by5iZS50cnVlXG4gICAgICBzdHViLnJlc3RvcmUoKVxuXG4gICAgaXQgXCJyZXR1cm5zIHRydWUgd2hlbiBlYWNoIGVsZW1lbnQgcGFzc2VzIENvbnRyb2xzLnZhbGlkYXRlRWxlbWVudFwiLCAtPlxuICAgICAgc3R1YiA9IHNpbm9uLnN0dWIgQ29udHJvbHMsIFwidmFsaWRhdGVFbGVtZW50XCIsIC0+IHRydWVcbiAgICAgIGV4cGVjdCggY1NlbC52YWxpZCgpICkudG8uYmUudHJ1ZVxuICAgICAgZXhwZWN0KCBzdHViLmNhbGxDb3VudCApLnRvLmVxdWFsIGNTZWwubGVuZ3RoXG4gICAgICBzdHViLnJlc3RvcmUoKVxuXG4gICAgaXQgXCJyZXR1cm5zIGZhbHNlIHdoZW4gYW55IGVsZW1lbnQgZmFpbHMgQ29udHJvbHMudmFsaWRhdGVFbGVtZW50XCIsIC0+XG4gICAgICBzdHViID0gc2lub24uc3R1YiBDb250cm9scywgXCJ2YWxpZGF0ZUVsZW1lbnRcIiwgLT4gZmFsc2VcbiAgICAgIGV4cGVjdCggY1NlbC52YWxpZCgpICkudG8uYmUuZmFsc2VcbiAgICAgIGV4cGVjdCggc3R1Yi5jYWxsQ291bnQgKS50by5lcXVhbCAxXG4gICAgICBzdHViLnJlc3RvcmUoKVxuXG4gIGRlc2NyaWJlIFwiQGJpbmRWYWxpZGF0b3JcIiwgLT5cblxuICAgIGl0IFwiXCJcblxuICByZXR1cm5cblxuZGVzY3JpYmUgXCJqUXVlcnkgdHJhdmVyc2FsIG1ldGhvZHNcIiwgLT5cblxuICByb290ID0gdW5kZWZpbmVkXG4gIGN0bHMgPSB1bmRlZmluZWRcbiAgYmVmb3JlRWFjaCAtPlxuICAgIHJvb3QgPSB0cmVlcy5ieUlkIFwidmFsdWVzXCJcbiAgICBjdGxzID0gJCggcm9vdCApLmNvbnRyb2xzKClcblxuICBkZXNjcmliZSBcIm11dGF0aW5nIG1ldGhvZHMgcmV0dXJuIGpRdWVyeVwiLCAtPlxuICAgIG1ldGhvZHMgPSBbXG4gICAgICBcImFkZFwiXG4gICAgICBcImFkZEJhY2tcIlxuICAgICAgXCJhbmRTZWxmXCJcbiAgICAgIFwiY2hpbGRyZW5cIlxuICAgICAgXCJjbG9zZXN0XCJcbiAgICAgIFwiY29udGVudHNcIlxuICAgICAgXCJlbmRcIlxuICAgICAgXCJmaW5kXCJcbiAgICAgIFwibmV4dFwiXG4gICAgICBcIm5leHRBbGxcIlxuICAgICAgXCJuZXh0VW50aWxcIlxuICAgICAgXCJvZmZzZXRQYXJlbnRcIlxuICAgICAgXCJwYXJlbnRcIlxuICAgICAgXCJwYXJlbnRzXCJcbiAgICAgIFwicGFyZW50c1VudGlsXCJcbiAgICAgIFwicHJldlwiXG4gICAgICBcInByZXZBbGxcIlxuICAgICAgXCJwcmV2VW50aWxcIlxuICAgICAgXCJzaWJsaW5nc1wiXG4gICAgXVxuXG4gICAgbWV0aG9kcy5mb3JFYWNoICggbWV0aG9kICkgLT5cbiAgICAgIGl0IFwicmV0dXJucyBqUXVlcnkgZnJvbSBAI3sgbWV0aG9kIH0oKVwiLCAtPlxuICAgICAgICBzZWxlY3Rpb24gPSBjdGxzW21ldGhvZF0oKVxuICAgICAgICBleHBlY3QoIHNlbGVjdGlvbiApLnRvLmJlLmluc3RhbmNlb2YgalF1ZXJ5XG4gICAgICAgIGV4cGVjdCggc2VsZWN0aW9uICkudG8ubm90LmJlIGluc3RhbmNlb2YgQ29udHJvbHNcblxuICAgIGl0IFwicmV0dXJucyBqUXVlcnkgZnJvbSBAbWFwKClcIiwgLT5cbiAgICAgIG1hcFJlc3VsdCA9IGN0bHMubWFwIC0+XG4gICAgICBleHBlY3QoIG1hcFJlc3VsdCApLnRvLmJlLmluc3RhbmNlb2YgalF1ZXJ5XG4gICAgICBleHBlY3QoIG1hcFJlc3VsdCApLnRvLm5vdC5iZSBpbnN0YW5jZW9mIENvbnRyb2xzXG5cbiAgZGVzY3JpYmUgXCJzdWJzZXQgbWV0aG9kcyByZXR1cm4gQ29udHJvbHNcIiwgLT5cblxuICAgIG1ldGhvZHMgPSBbXG4gICAgICBcInNsaWNlXCJcbiAgICAgIFwiZmlyc3RcIlxuICAgICAgXCJsYXN0XCJcbiAgICAgIFwiZmlsdGVyXCJcbiAgICAgIFwibm90XCJcbiAgICAgIFwiZXFcIlxuICAgIF1cblxuICAgIG1ldGhvZHMuZm9yRWFjaCAoIG1ldGhvZCApIC0+XG4gICAgICBpdCBcInJldHVybnMgQ29udHJvbHMgZnJvbSBAI3sgbWV0aG9kIH0oKVwiLCAtPlxuICAgICAgICBleHBlY3QoIGN0bHNbbWV0aG9kXSgpICkudG8uYmUuaW5zdGFuY2VvZiBDb250cm9sc1xuXG4gIGRlc2NyaWJlIFwiZWFjaCByZXR1cm5zIENvbnRyb2xzXCIsIC0+XG4gICAgaXQgXCJyZXR1cm5zIENvbnRyb2xzIGZyb20gQGVhY2goKVwiLCAtPlxuICAgICAgZXhwZWN0KCBjdGxzLmVhY2goIC0+ICkgKS50by5iZS5pbnN0YW5jZW9mIENvbnRyb2xzXG5cbmRlc2NyaWJlIFwiJC5mbi5taXhpbkNvbnRyb2xzXCIsIC0+XG5cbiAgQkxBQ0tMSVNUID0gW1xuICAgIFwiY29uc3RydWN0b3JcIixcbiAgICBcImZpbHRlclwiLFxuICAgIFwibm90XCIsXG4gICAgXCJzbGljZVwiLFxuICAgIFwicHVzaFN0YWNrXCIsXG4gICAgXCJlbmRcIlxuICBdXG5cbiAgcm9vdCA9IHVuZGVmaW5lZFxuICBjdGxzID0gdW5kZWZpbmVkXG4gIGJlZm9yZUVhY2ggLT5cbiAgICByb290ID0gdHJlZXMuYnlJZCBcInZhbHVlc1wiXG4gICAgY3RscyA9ICQoIHJvb3QgKS5taXhpbkNvbnRyb2xzKClcblxuICBpdCBcIlNob3VsZCBoYXZlIGFsbCBtZXRob2RzIGZyb20gQ29udHJvbC5wcm90b3R5cGUgZXhjZXB0IHRoZSBibGFja2xpc3RlZCBvbmVzXCIsIC0+XG5cbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyggQ29udHJvbHM6OiApLmV2ZXJ5ICggbWV0aG9kICkgLT5cbiAgICAgIGlmIG1ldGhvZCBpbiBCTEFDS0xJU1RcbiAgICAgICAgY3Rsc1ttZXRob2RdIGlzbnQgQ29udHJvbHM6OlttZXRob2RdXG4gICAgICBlbHNlXG4gICAgICAgIGN0bHNbbWV0aG9kXSBpcyBDb250cm9sczo6W21ldGhvZF1cblxuaWYgd2luZG93Py5tb2NoYVBoYW50b21KU1xuICB3aW5kb3cubW9jaGFQaGFudG9tSlMucnVuKClcbmVsc2UgaWYgbW9jaGFcbiAgbW9jaGEucnVuKClcbmVsc2VcbiAgdGhyb3cgbmV3IEVycm9yIFwiTm8gTW9jaGEhXCJcbiIsImRlbWV0aG9kaXplID0gKCBtZXRob2QgKSAtPlxuICBGdW5jdGlvbjo6Y2FsbC5iaW5kIG1ldGhvZFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIG1hcDogZGVtZXRob2RpemUgQXJyYXk6Om1hcFxuICBzb21lOiBkZW1ldGhvZGl6ZSBBcnJheTo6c29tZVxuICBldmVyeTogZGVtZXRob2RpemUgQXJyYXk6OmV2ZXJ5XG4gIHNsaWNlOiBkZW1ldGhvZGl6ZSBBcnJheTo6c2xpY2VcbiAgZWFjaDogZGVtZXRob2RpemUgQXJyYXk6OmZvckVhY2hcbiAgcmVkdWNlOiBkZW1ldGhvZGl6ZSBBcnJheTo6cmVkdWNlXG4gIGZpbHRlcjogZGVtZXRob2RpemUgQXJyYXk6OmZpbHRlclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcbiAgQ0hFQ0tBQkxFOiBcImlucHV0W3R5cGU9J3JhZGlvJ10sIGlucHV0W3R5cGU9J2NoZWNrYm94J11cIlxuICBCVVRUT046IFwiaW5wdXRbdHlwZT0nYnV0dG9uJ10sIGJ1dHRvblwiXG4gIFRBR1M6IFwiaW5wdXQsIHNlbGVjdCwgYnV0dG9uLCB0ZXh0YXJlYVwiXG4gIFJBRElPOiBcIlt0eXBlPSdyYWRpbyddXCJcbiAgQ0hFQ0s6IFwiW3R5cGU9J2NoZWNrYm94J11cIiIsInNsaWNlID0gRnVuY3Rpb246OmNhbGwuYmluZCBBcnJheTo6c2xpY2VcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzYW1lU2VsZWN0aW9uOiAoIG9iakEsIG9iakIgKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3Mgb2JqQS5sZW5ndGggaXMgb2JqQi5sZW5ndGhcbiAgICBhcnJBID0gJC51bmlxdWUgc2xpY2Ugb2JqQVxuICAgIGFyckIgPSAkLnVuaXF1ZSBzbGljZSBvYmpCXG4gICAgYXJyQS5ldmVyeSAoIGVsICkgLT5cbiAgICAgIGVsIGluIGFyckJcblxuXG5cbiIsInJlcXVpcmUgXCIuL21hdGNoZXMtcG9seWZpbGwuY29mZmVlXCJcblZhbHVlcyA9IHJlcXVpcmUgXCIuL3ZhbHVlcy5jb2ZmZWVcIlxuaXNWYWxpZCA9IHJlcXVpcmUgXCIuL2lzLXZhbGlkLmNvZmZlZVwiXG5nZXRWYWx1ZSA9IHJlcXVpcmUoIFwiLi9nZXQtdmFsdWUuY29mZmVlXCIgKS5nZXRWYWx1ZU1hcHBhYmxlXG57IG1hcCwgcmVkdWNlLCBlYWNoLCBldmVyeSwgc2xpY2UgfSA9IHJlcXVpcmUgXCIuL3V0aWxzLmNvZmZlZVwiXG57IENIRUNLQUJMRSwgQlVUVE9OLCBUQUdTIH0gPSByZXF1aXJlIFwiLi9zZWxlY3RvcnMuY29mZmVlXCJcblxuJCA9IGpRdWVyeSA9IHdpbmRvdy5qUXVlcnlcblxucHJvcE1hcCA9ICgganFDb2xsZWN0aW9uLCBrZXlQcm9wLCB2YWxQcm9wICkgLT5cbiAganFDb2xsZWN0aW9uLmdldCgpLnJlZHVjZSAoIGFjYywgZWwsIGksIGFyciApIC0+XG4gICAgaWYga2V5UHJvcCBvZiBlbFxuICAgICAgYWNjLnB1c2hcbiAgICAgICAgaWQ6IGVsW2lkUHJvcF1cbiAgICAgICAgdmFsdWU6IGVsW3ZhbFByb3BdXG4gICAgYWNjXG4gICwgW11cblxuZ2V0Q29udHJvbE5vZGVzID0gKCBub2RlcyApIC0+XG4gIHJlZHVjZSBub2RlcywgKCBhY2MsIG5vZGUgKSAtPlxuICAgIGlmIG5vZGUubWF0Y2hlcyBUQUdTXG4gICAgICBhY2MucHVzaCBub2RlXG4gICAgZWxzZVxuICAgICAgW10ucHVzaC5hcHBseSBzbGljZSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwgVEFHU1xuICAgIGFjY1xuICAsIFtdXG5cbnZhbGlkaXR5TGlzdGVuZXIgPSAoIGV2dCApIC0+XG4gIGlzVmFsaWQgPSBAdmFsaWQoKVxuICBpZiBpc1ZhbGlkIGlzbnQgQGlzVmFsaWQoKVxuICAgIGlmIGlzVmFsaWQgdGhlbiBAdHJpZ2dlciBcInZhbGlkXCIgZWxzZSBAdHJpZ2dlciBcImludmFsaWRcIlxuICAgIEBpc1ZhbGlkID0gaXNWYWxpZFxuXG5cbmNsYXNzIENvbnRyb2xzIGV4dGVuZHMgalF1ZXJ5XG5cbiAgQHZhbGlkYXRlRWxlbWVudCA9IGlzVmFsaWRcblxuICAjIG1heWJlIHdlIHNob3VsZCBmaWx0ZXIgZm9yIGNvbnRyb2wgdGFncyBpbiBoZXJlLlxuICBjb25zdHJ1Y3RvcjogKCBub2RlcyA9IFwiXCIsIG9wdCA9IHt9ICkgLT5cbiAgICB1bmxlc3MgQCBpbnN0YW5jZW9mIENvbnRyb2xzXG4gICAgICByZXR1cm4gbmV3IENvbnRyb2xzIGpRdWVyeSBub2Rlc1xuICAgIGpRdWVyeS5mbi5pbml0LmNhbGwgQCwgZ2V0Q29udHJvbE5vZGVzIG5vZGVzXG4gICAgQF9jb250cm9sc0luaXQgb3B0XG5cbiAgX2NvbnRyb2xzSW5pdDogKCBvcHQgKSAtPlxuICAgIEBpZGVudGlmeWluZ1Byb3AgPSBvcHQuaWRQcm9wIG9yIFwiaWRcIlxuICAgIEBpc1ZhbGlkID0gQHZhbGlkKClcblxuICAgIEBfdmFsaWRpdHlMaXN0ZW5lciA9IHZhbGlkaXR5TGlzdGVuZXIuYmluZCBAXG5cbiAgICAjIHNldCB2YWxpZGl0eSBsaXN0ZW5lclxuICAgIHVubGVzcyBvcHQubm9BdXRvVmFsaWRhdGVcbiAgICAgIEBzdGFydFZhbGlkTGlzdGVuaW5nKClcblxuICAgICMgc2V0IGJhc2Ugc3RhdGUgZm9yIC5yZXNldCgpXG4gICAgdW5sZXNzIG9wdC5ub1Jlc2V0U3RhdGVcbiAgICAgIEBzZXRSZXNldFN0YXRlKClcblxuICBzdGFydFZhbGlkTGlzdGVuaW5nOiAtPlxuICAgIEBvbiBcImNoYW5nZSwgaW5wdXRcIiwgQF92YWxpZGl0eUxpc3RlbmVyXG5cbiAgc3RvcFZhbGlkTGlzdGVuaW5nOiAtPlxuICAgIEBvZmYgXCJjaGFuZ2UsIGlucHV0XCIsIEBfdmFsaWRpdHlMaXN0ZW5lclxuXG4gIHNldFJlc2V0U3RhdGU6IC0+XG4gICAgQGVhY2ggKCBpLCBlbCApIC0+XG4gICAgICBqUXVlcnkuZGF0YSBALCBcInJlc2V0U3RhdGVcIixcbiAgICAgICAgZGlzYWJsZWQ6IEBkaXNhYmxlZFxuICAgICAgICByZXF1aXJlZDogQHJlcXVpcmVkXG4gICAgICAgIHZhbHVlOiBkbyA9PlxuICAgICAgICAgIGlmIEBtYXRjaGVzIENIRUNLQUJMRVxuICAgICAgICAgICAgQGNoZWNrZWRcbiAgICAgICAgICBlbHNlIGlmIEBtYXRjaGVzIFwic2VsZWN0XCJcbiAgICAgICAgICAgIHJlZHVjZSBAcXVlcnlTZWxlY3RvckFsbCggXCJvcHRpb25cIiApLCAoIGFjYywgZWwgKSAtPlxuICAgICAgICAgICAgICBpZiBlbC5zZWxlY3RlZCBpcyB0cnVlXG4gICAgICAgICAgICAgICAgYWNjLnB1c2ggZWwudmFsdWUgb3IgZWwuaW5uZXJIVE1MXG4gICAgICAgICAgICAgIGFjY1xuICAgICAgICAgICAgLCBbXVxuICAgICAgICAgIGVsc2UgaWYgQG1hdGNoZXMgXCJpbnB1dFwiXG4gICAgICAgICAgICBAdmFsdWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBudWxsXG5cbiAgZmlsdGVyOiAoIHBhcmFtICkgLT5cbiAgICBqUXVlcnkuZm4uZmlsdGVyLmNhbGwoIEAsIHBhcmFtICkuY29udHJvbHMoKVxuXG4gIG5vdDogKCBwYXJhbSApIC0+XG4gICAgalF1ZXJ5LmZuLm5vdC5jYWxsKCBALCBwYXJhbSApLmNvbnRyb2xzKClcblxuICBwcm9wVmFsdWVzOiAoIHByb3AgKSAtPlxuICAgIG5ldyBWYWx1ZXMgcHJvcE1hcCBALCBAaWRQcm9wLCBwcm9wXG5cbiAgdmFsdWVzOiAtPlxuICAgIG5ldyBWYWx1ZXMgQGdldCgpLm1hcCBnZXRWYWx1ZVxuXG4gIHJlc2V0OiAtPlxuICAgIEBlYWNoIC0+XG4gICAgICBkYXRhID0galF1ZXJ5LmRhdGEgQCwgXCJyZXNldFN0YXRlXCJcbiAgICAgIEByZXF1aXJlZCA9IGRhdGEucmVxdWlyZWRcbiAgICAgIEBkaXNhYmxlZCA9IGRhdGEuZGlzYWJsZWRcbiAgICAgIGlmIEBtYXRjaGVzIENIRUNLQUJMRVxuICAgICAgICBAY2hlY2tlZCA9IGRhdGEudmFsdWVcbiAgICAgIGVsc2UgaWYgQG1hdGNoZXMgXCJzZWxlY3RcIlxuICAgICAgICBlYWNoIEBxdWVyeVNlbGVjdG9yQWxsKCBcIm9wdGlvblwiICksICggZWwgKSA9PlxuICAgICAgICAgIGlmIGVsLnZhbHVlIGluIGRhdGEudmFsdWVcbiAgICAgICAgICAgIGVsLnNlbGVjdGVkID0gdHJ1ZVxuICAgICAgZWxzZSBpZiBAbWF0Y2hlcyBcImlucHV0XCJcbiAgICAgICAgQHZhbHVlID0gZGF0YS52YWx1ZVxuICAgIEBcblxuICBjbGVhcjogLT5cbiAgICBAZmlsdGVyKCBcInNlbGVjdFwiICkuZmluZCggXCJvcHRpb25cIiApLnJlbW92ZUF0dHIgXCJzZWxlY3RlZFwiXG4gICAgQGZpbHRlciggQ0hFQ0tBQkxFICkucmVtb3ZlQXR0ciBcImNoZWNrZWRcIlxuICAgIEBub3QoIENIRUNLQUJMRSApLnZhbCBcIlwiXG4gICAgQFxuXG4gICMgYWRhcHRlZCBmcm9tIHNwYWNlLXBlblxuICBwdXNoU3RhY2s6ICggZWxlbXMgKSAtPlxuICAgIHJldCA9IGpRdWVyeS5tZXJnZSBqUXVlcnkoKSwgZWxlbXNcbiAgICByZXQucHJldk9iamVjdCA9IEBcbiAgICByZXQuY29udGV4dCA9IEBjb250ZXh0XG4gICAgcmV0XG5cbiAgIyBhZGFwdGVkIGZyb20gc3BhY2UtcGVuXG4gIGVuZDogLT5cbiAgICBAcHJldk9iamVjdCA/IGpRdWVyeSBudWxsXG5cbiAgIyBjb21tb24gYXR0ciBjb252ZW5pZW5jZSBtZXRob2RzXG5cbiAgIyBUT0RPOiBDaGVjayBmb3IgcHJlZmVycmVkIGpRdWVyeSB3YXkgdG8gZG8gdGhpc1xuICAjXG4gICMgY2hlY2s6IC0+IEBwcm9wIFwiY2hlY2tlZFwiLCB0cnVlXG4gICMgdW5jaGVjazogLT4gQHByb3AgXCJjaGVja2VkXCIsIGZhbHNlXG4gICMgcmVxdWlyZTogLT4gQHByb3AgXCJyZXF1aXJlZFwiLCB0cnVlXG4gICMgdW5yZXF1aXJlOiAtPiBAcHJvcCBcInJlcXVpcmVkXCIsIGZhbHNlXG4gICMgZGlzYWJsZTogLT4gQHByb3AgXCJkaXNhYmxlZFwiLCB0cnVlXG4gICMgZW5hYmxlOiAtPiBAcHJvcCBcImRpc2FibGVkXCIsIGZhbHNlXG4gIGNoZWNrOiAtPiBAYXR0ciBcImNoZWNrZWRcIiwgdHJ1ZVxuICB1bmNoZWNrOiAtPiBAcmVtb3ZlQXR0ciBcImNoZWNrZWRcIlxuICByZXF1aXJlOiAtPiBAYXR0ciBcInJlcXVpcmVkXCIsIHRydWVcbiAgdW5yZXF1aXJlOiAtPiBAcmVtb3ZlQXR0ciBcInJlcXVpcmVkXCJcbiAgZGlzYWJsZTogLT4gQGF0dHIgXCJkaXNhYmxlZFwiLCB0cnVlXG4gIGVuYWJsZTogLT4gQHJlbW92ZUF0dHIgXCJkaXNhYmxlZFwiXG5cbiAgIyBjb21tb24gZmlsdGVyIGNvbnZlbmllbmNlIG1ldGhvZHNcbiAgYnV0dG9uczogLT4gQGZpbHRlciBcImJ1dHRvblwiXG4gIGlucHV0czogLT4gQGZpbHRlciBcImlucHV0XCJcbiAgc2VsZWN0czogLT4gQGZpbHRlciBcInNlbGVjdFwiXG4gIG9mVHlwZTogKCB0eXBlICkgLT4gQGZpbHRlciBcIlt0eXBlPSN7IHR5cGUgfV1cIlxuXG4gIHZhbGlkOiAtPiBldmVyeSBALCBDb250cm9scy52YWxpZGF0ZUVsZW1lbnRcblxuICBiaW5kVmFsaWRhdG9yOiAoIGZuICkgLT5cblxuICBsYWJlbHM6IC0+XG4gICAgcmVkdWNlIEAsICggYWNjLCBlbCApIC0+XG4gICAgICBhY2MuYWRkKCBlbC5sYWJlbHMgKVxuICAgICwgZG8galF1ZXJ5XG5cbiAgYXNKUXVlcnk6IC0+IGpRdWVyeSBAZ2V0KClcblxuICBzbGljZTogLT4galF1ZXJ5LmZuLnNsaWNlLmFwcGx5KCBALCBhcmd1bWVudHMgKS5jb250cm9scygpXG4gIGVxOiAoIGkgKSAtPiAgQHNsaWNlIGksIDFcbiAgZmlyc3Q6IC0+IEBlcSAwXG4gIGxhc3Q6IC0+IEBlcSBAbGVuZ3RoIC0gMVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xzXG4iLCIkID0galF1ZXJ5ID0gd2luZG93LmpRdWVyeVxuXG57IENIRUNLQUJMRSwgU0VMRUNURUQsIEJVVFRPTiB9ID0gcmVxdWlyZSBcIi4vc2VsZWN0b3JzLmNvZmZlZVwiXG5cbmdldFZhbHVlID0gKCBlbCApIC0+XG4gICRlbCA9ICQoIGVsIClcbiAgaWYgJGVsLmlzIEJVVFRPTlxuICAgIG51bGxcbiAgZWxzZSBpZiAkZWwuaXMgQ0hFQ0tBQkxFXG4gICAgaWYgZWwuY2hlY2tlZCB0aGVuIGVsLnZhbHVlIGVsc2UgbnVsbFxuICBlbHNlIGlmICRlbC5pcyBcInNlbGVjdFwiXG4gICAgJGVsLmZpbmQoIFNFTEVDVEVEICkubWFwICggZWwgKSAtPlxuICAgICAgZWwudmFsdWUgb3IgZWwuaW5uZXJIVE1MIG9yIG51bGxcbiAgZWxzZVxuICAgIGVsLnZhbHVlIG9yIG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRWYWx1ZVxuIiwiQ29udHJvbHMgPSByZXF1aXJlIFwiLi9jb250cm9scy5jb2ZmZWVcIlxubWl4aW5Db250cm9scyA9IHJlcXVpcmUgXCIuL21peGluLmNvZmZlZVwiXG5DT05UUk9MX1RBR1MgPSBbIFwiaW5wdXRcIiwgXCJzZWxlY3RcIiwgXCJ0ZXh0YXJlYVwiLCBcImJ1dHRvblwiIF0uam9pbiBcIiwgXCJcblxubW9kdWxlLmV4cG9ydHMgPSBkbyAoICQgPSB3aW5kb3cualF1ZXJ5ICkgLT5cblxuICBwcmV2Q29udHJvbHMgPSAkLmZuLmNvbnRyb2xzXG5cbiAgJC5mbi5jb250cm9scyA9ICggb3B0ID0ge30gKS0+XG4gICAgbWV0aG9kID0gaWYgQGxlbmd0aCBpcyAxIHRoZW4gXCJmaW5kXCIgZWxzZSBcImZpbHRlclwiXG4gICAgbmV3IENvbnRyb2xzIEBbbWV0aG9kXSggQ09OVFJPTF9UQUdTICksIG9wdFxuXG4gICQuZm4uY29udHJvbHMubm9Db25mbGljdCA9IC0+XG4gICAgJC5mbi5jb250cm9scyA9IHByZXZDb250cm9sc1xuICAgIEBcblxuICAkLmZuLm1peGluQ29udHJvbHMgPSAoIG9wdCA9IHt9ICktPlxuICAgIG1peGluQ29udHJvbHMoIEAsIG9wdCApXG5cbiAgdW5kZWZpbmVkXG4iLCJ2YWxpZGF0aW9ucyA9IHJlcXVpcmUgXCIuL3ZhbGlkYXRpb25zLmNvZmZlZVwiXG4kID0galF1ZXJ5ID0gd2luZG93LmpRdWVyeVxuXG5jYWxsT24gPSAoIG9iaiwgZm4gKSAtPlxuICBmbi5jYWxsKCBvYmogKVxuXG4jIG1hdGNoZXMgbWV0aG9kIGNhbGxzXG4jIHNwbGl0TWV0aG9kcyggXCJsZW5ndGhNaW4oIDggKSAmJiBsZW5ndGhNYXgoIDEyIClcIiApID0+XG4jIFtcImxlbmd0aE1pbiggOCApXCIsIFwibGVuZ3RoTWF4KCAxMiApXCJdXG5zcGxpdE1ldGhvZHMgPSAoIHN0ciApIC0+XG4gIHN0cj8uc3BsaXQoIFwiJiZcIiApLm1hcCAoIG0gKSAtPiBtPy50cmltKClcblxuIyBnZXRzIG1ldGhvZCBuYW1lc1xuIyBnZXRNZXRob2QoIFwibGVuZ3RoTWluKCA4IClcIiApID0+IFwibGVuZ3RoTWluXCJcbmdldE1ldGhvZCA9ICggc3RyICkgLT5cbiAgc3RyPy5zcGxpdCggXCIoXCIgKVswXVxuXG4jIGdldHMgYXJndW1lbnRzXG4jIGdldEFyZ3MoIFwibWV0aG9kTmFtZSggYXJnMSwgYXJnMiApXCIgKSA9PiBbXCJhcmcxXCIsIFwiYXJnMlwiXVxuZ2V0QXJncyA9ICggc3RyICkgLT5cbiAgc3RyPy5tYXRjaCggL1xcKChbXildKylcXCkvICk/WyAxIF1cbiAgICAuc3BsaXQgXCIsXCJcbiAgICAubWFwICggYXJnICkgLT5cbiAgICAgIGFyZz8udHJpbSgpLnJlcGxhY2UgLycvZywgXCJcIlxuXG5pc1ZhbGlkID0gKCBlbCwgY3VzdG9tRm4sIGFyZ3MuLi4gKSAtPlxuICAkZWwgPSAkKCBlbCApXG4gIHZhbGlkYXRpb25BdHRyID0gJGVsLmRhdGEgXCJjb250cm9sLXZhbGlkYXRpb25cIlxuICB2YWxpZGF0aW9uRm5zID0gJC5kYXRhIGVsLCBcImNvbnRyb2xWYWxpZGF0b3JzXCJcblxuICBpZiBjdXN0b21GbiBhbmQgdHlwZW9mIGN1c3RvbUZuIGlzIFwiZnVuY3Rpb25cIlxuICAgIHJldHVybiAhIWN1c3RvbUZuLmFwcGx5KCBlbCwgYXJncyApXG5cbiAgZWxzZSBpZiB2YWxpZGF0aW9uRm5zPy5sZW5ndGhcbiAgICByZXR1cm4gdmFsaWRhdGlvbkZucy5ldmVyeSBjYWxsT24uYmluZCggbnVsbCwgZWwgKVxuXG4gIGVsc2UgaWYgdmFsaWRhdGlvbkF0dHJcbiAgICB2YWxpZGF0b3JzID0gc3BsaXRNZXRob2RzKCB2YWxpZGF0aW9uQXR0ciApLm1hcCAoIGZuQ2FsbFN0ciApIC0+XG4gICAgICBtZXRob2Q6IGdldE1ldGhvZCggZm5DYWxsU3RyIClcbiAgICAgIGFyZ3M6IGdldEFyZ3MoIGZuQ2FsbFN0ciApXG4gICAgcmV0dXJuIHZhbGlkYXRvcnMuZXZlcnkgKCBjYWxsRGVzYyApIC0+XG4gICAgICByZXR1cm4gZmFsc2UgdW5sZXNzIFwibWV0aG9kXCIgb2YgY2FsbERlc2NcbiAgICAgIHZhbGlkYXRpb25zW2NhbGxEZXNjLm1ldGhvZF0uYXBwbHkgZWwsIGFyZ3NcblxuICBlbHNlXG4gICAgcmV0dXJuIGVsLnZhbGlkaXR5LnZhbGlkXG5cbm1vZHVsZS5leHBvcnRzID0gaXNWYWxpZFxuIiwiIyBJcyB0aGVyZSBhbnkgcmVhc29uIHRvIG1ha2UgdGhlIENvbnRyb2xzIGFuZCBWYWx1ZXMgY29uc3RydWN0b3JzIGF2YWlsYWJsZT9cbm1vZHVsZS5leHBvcnRzID0gZG8gKCAkID0gd2luZG93LmpRdWVyeSApIC0+XG4gIHJlcXVpcmUgXCIuL2luaXQuY29mZmVlXCJcbiAgJC5Db250cm9scyA9IHJlcXVpcmUgXCIuL2NvbnRyb2xzLmNvZmZlZVwiXG4gICQuVmFsdWVzID0gcmVxdWlyZSBcIi4vdmFsdWVzLmNvZmZlZVwiXG4gIHVuZGVmaW5lZFxuIiwiZG8gKCBFbGVtZW50ID0gd2luZG93LkVsZW1lbnQgKSAtPlxuICBpZiBFbGVtZW50IGFuZCBub3QgRWxlbWVudDo6bWF0Y2hlc1xuICAgIEVsZW1lbnQ6Om1hdGNoZXMgPVxuICAgICAgRWxlbWVudDo6bWF0Y2hlc1NlbGVjdG9yIG9yXG4gICAgICBFbGVtZW50OjpvTWF0Y2hlc1NlbGVjdG9yIG9yXG4gICAgICBFbGVtZW50Ojptc01hdGNoZXNTZWxlY3RvciBvclxuICAgICAgRWxlbWVudDo6bW96TWF0Y2hlc1NlbGVjdG9yIG9yXG4gICAgICBFbGVtZW50Ojp3ZWJraXRNYXRjaGVzU2VsZWN0b3Igb3JcbiAgICAgICggc2VsZWN0b3IgKSAtPlxuICAgICAgICBub2RlcyA9ICggQHBhcmVudE5vZGUgb3IgQGRvY3VtZW50ICkucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKVxuICAgICAgICAoIHJldHVybiB0cnVlIGlmIG5vZGUgaXMgdGhpcyApIGZvciBub2RlIGluIG5vZGVzXG4gICAgICAgIHJldHVybiBmYWxzZVxuIiwiJCA9IGpRdWVyeSA9IHdpbmRvdy5qUXVlcnlcbkNvbnRyb2xzID0gcmVxdWlyZSBcIi4vY29udHJvbHMuY29mZmVlXCJcblxuQkxBQ0tMSVNUID0gW1xuICBcImNvbnN0cnVjdG9yXCIsXG4gIFwiZmlsdGVyXCIsXG4gIFwibm90XCIsXG4gIFwic2xpY2VcIixcbiAgXCJwdXNoU3RhY2tcIixcbiAgXCJlbmRcIlxuXVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1peGluID0gKCBvYmosIG9wdCApIC0+XG4gIGNvbnNvbGUubG9nIG9iaiBpbnN0YW5jZW9mIGpRdWVyeVxuICAjIHVubGVzcyBvYmogaW5zdGFuY2VvZiAkXG4gICMgICB0aHJvdyBuZXcgVHlwZUVycm9yIFwiQ29udHJvbHMgbWl4aW4gZXhwZWN0cyBhIGpRdWVyeSBzZWxlY3Rpb25cIlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyggQ29udHJvbHM6OiApLmZvckVhY2ggKCBtZXRob2QgKSAtPlxuICAgIG9ialttZXRob2RdID0gQ29udHJvbHM6OlttZXRob2RdIHVubGVzcyBtZXRob2QgaW4gQkxBQ0tMSVNUXG4gIG9ialxuIiwibW9kdWxlLmV4cG9ydHMgPSBcbiAgQ0hFQ0tBQkxFOiBcImlucHV0W3R5cGU9J3JhZGlvJ10sIGlucHV0W3R5cGU9J2NoZWNrYm94J11cIlxuICBCVVRUT046IFwiaW5wdXRbdHlwZT0nYnV0dG9uJ10sIGJ1dHRvblwiXG4gIFRBR1M6IFwiaW5wdXQsIHNlbGVjdCwgYnV0dG9uLCB0ZXh0YXJlYVwiXG4gIFJBRElPOiBcIlt0eXBlPSdyYWRpbyddXCJcbiAgQ0hFQ0s6IFwiW3R5cGU9J2NoZWNrYm94J11cIiIsImRlbWV0aG9kaXplID0gKCBtZXRob2QgKSAtPlxuICBGdW5jdGlvbjo6Y2FsbC5iaW5kIG1ldGhvZFxuXG5hcnJheU1ldGhvZHMgPSBbXG4gIFwibWFwXCJcbiAgXCJzb21lXCJcbiAgXCJldmVyeVwiXG4gIFwic2xpY2VcIlxuICBcImZpbHRlclwiXG4gIFwicmVkdWNlXCJcbiAgXCJmb3JFYWNoXCJcbl1cblxudXRpbHMgPVxuICBvYmpNYXA6ICggb2JqLCBjYWxsYmFjayApIC0+XG4gICAgcmVzdWx0ID0ge31cbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBvYmpcbiAgICAgIHJlc3VsdFtrZXldID0gY2FsbGJhY2sgdmFsdWUsIGtleSwgb2JqXG4gICAgcmVzdWx0XG5cblxuYXJyYXlNZXRob2RzLmZvckVhY2ggKCBtZXRob2QgKSAtPlxuICB1dGlsc1ttZXRob2RdID0gZGVtZXRob2RpemUgQXJyYXk6OlttZXRob2RdXG5cbnV0aWxzLmVhY2ggPSB1dGlscy5mb3JFYWNoXG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHNcbiIsInsgc2xpY2UgfSA9IHJlcXVpcmUgXCIuL3V0aWxzLmNvZmZlZVwiXG57IENIRUNLLCBSQURJTyB9ID0gcmVxdWlyZSBcIi4vc2VsZWN0b3JzLmNvZmZlZVwiXG5cbiQgPSBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5XG5kb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudFxuXG5odG1sNVZhbGlkYXRpb24gPSBkbyAtPlxuICB0ZXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiaW5wdXRcIlxuICAoIHR5cGUsIHZhbHVlICkgLT5cbiAgICB0ZXN0RWwudHlwZSA9IHR5cGVcbiAgICB0ZXN0RWwudmFsdWUgPSB2YWx1ZVxuICAgIHRlc3RFbC5yZXF1aXJlZCA9IHRydWVcbiAgICB0ZXN0RWwudmFsaWRpdHkudmFsaWRcblxubW9kdWxlLmV4cG9ydHMgPSB2ID1cblxuICBub3RFbXB0eTogLT4gISFAdmFsdWVcblxuICBub3RFbXB0eVRyaW06IC0+ICEhQHZhbHVlLnRyaW0oKVxuXG4gIG51bWVyaWM6IC0+IC9eXFxkKyQvLnRlc3QgQHZhbHVlXG5cbiAgYWxwaGFudW1lcmljOiAtPiAvXlthLXowLTldKyQvaS50ZXN0IEB2YWx1ZVxuXG4gIGxldHRlcnM6IC0+IC9eW2Etel0rJC9pLnRlc3QgQHZhbHVlXG5cbiAgaXNWYWx1ZTogKCB2YWx1ZSAgKSAtPiBTdHJpbmcoIEB2YWx1ZSApIGlzIFN0cmluZyggdmFsdWUgKVxuXG4gIHBob25lOiAtPiB2LmFsbG93ZWQuY2FsbCBALCBcIjEyMzQ1Njc4OTAoKS0rIyBcIlxuXG4gICMgLmVtYWlsKCkgYW5kIC51cmwoKSB3aWxsIHRocm93IGluIElFIDwgOSBodHRwOi8vYXBpLmpxdWVyeS5jb20vYXR0ci9cbiAgZW1haWw6IC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIG5vdCB2Lm5vdEVtcHR5VHJpbSBAXG4gICAgaHRtbDVWYWxpZGF0aW9uKCBcImVtYWlsXCIsIEB2YWx1ZSApXG5cbiAgdXJsOiAtPlxuICAgIHJldHVybiBmYWxzZSBpZiBub3Qgdi5ub3RFbXB0eVRyaW0gQFxuICAgIGh0bWw1VmFsaWRhdGlvbiggXCJ1cmxcIiwgQHZhbHVlIClcblxuICBsaXN0OiAtPlxuICAgIEB2YWx1ZSBpbiBzbGljZSggQGxpc3Qub3B0aW9ucyBvciBbXSApLm1hcCAoIG9wdGlvbiApIC0+XG4gICAgICBvcHRpb24udmFsdWUgb3Igb3B0aW9uLmlubmVySFRNTFxuXG4gIHJhZGlvOiAtPlxuICAgIGlmICggQG5hbWUgKVxuICAgICAgJCggXCIjeyBSQURJTyB9W25hbWU9JyN7IEBuYW1lIH0nXVwiICkuZ2V0KClcbiAgICAgICAgLnNvbWUgKCBpbnB1dCApIC0+IGlucHV0LmNoZWNrZWRcbiAgICAjIGZhbHNlIGZvciB1bm5hbWVkIGVsZW1lbnRzXG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuICBjaGVja2JveDogKCBtaW5DaGVja2VkID0gMCwgbWF4Q2hlY2tlZCA9IDUwICkgLT5cbiAgICBpZiAoIEBuYW1lIClcbiAgICAgIGxlbiA9ICQoIFwiI3sgQ0hFQ0sgfVtuYW1lPScjeyBAbmFtZSB9J11cIiApLmZpbHRlciAtPlxuICAgICAgICAkKCB0aGlzICkucHJvcCBcImNoZWNrZWRcIlxuICAgICAgLmxlbmd0aFxuICAgICAgbWluQ2hlY2tlZCA8PSBsZW4gPD0gbWF4Q2hlY2tlZFxuICAgICMgdHJ1ZSBmb3IgdW5uYW1lZCBlbGVtZW50c1xuICAgIGVsc2VcbiAgICAgIHRydWVcblxuICBzZWxlY3Q6ICggbWluID0gMSwgbWF4ID0gMSApIC0+XG4gICAgc2VsZWN0ZWQgPSBmaWx0ZXIgQCAoIG9wdCApIC0+IG9wdC5zZWxlY3RlZCBhbmQgbm90IG9wdC5kaXNhYmxlZFxuICAgIGlmIG1pbiA8PSBzZWxlY3RlZC5sZW5ndGggPD0gbWF4IHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cbiAgYWxsb3dlZDogKCBhbGxvd2VkQ2hhcnMgKSAtPlxuICAgIGFsbG93ZWRDaGFycyA9IGFsbG93ZWRDaGFycy5zcGxpdCBcIlwiXG4gICAgc3RyID0gQHZhbHVlLnNwbGl0IFwiXCJcbiAgICBmb3IgY2hhciBpbiBzdHJcbiAgICAgIHJldHVybiBmYWxzZSBpZiBjaGFyIG5vdCBpbiBhbGxvd2VkQ2hhcnNcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIG5vdEFsbG93ZWQ6ICggbm90QWxsb3dlZENoYXJzICkgLT5cbiAgICBub3RBbGxvd2VkQ2hhcnMgPSBub3RBbGxvd2VkQ2hhcnMuc3BsaXQgXCJcIlxuICAgIHN0ciA9IEB2YWx1ZS5zcGxpdCBcIlwiXG4gICAgZm9yIGNoYXIgaW4gbm90QWxsb3dlZENoYXJzXG4gICAgICByZXR1cm4gZmFsc2UgaWYgY2hhciBpbiBzdHJcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIG51bWJlckJldHdlZW46ICggbWluLCBtYXggKSAtPlxuICAgIE51bWJlciggbWluICkgPD0gTnVtYmVyKCBAdmFsdWUgKSA8PSBOdW1iZXIoIG1heCApXG5cbiAgbnVtYmVyTWF4OiAoIG1heCApIC0+XG4gICAgTnVtYmVyKCBAdmFsdWUgKSA8PSBOdW1iZXIoIG1heCApXG5cbiAgbnVtYmVyTWluOiAoIG1pbiApIC0+XG4gICAgTnVtYmVyKCBAdmFsdWUgKSA+PSBOdW1iZXIoIG1pbiApXG5cbiAgbGVuZ3RoQmV0d2VlbjogKCBtaW4sIG1heCApIC0+XG4gICAgTnVtYmVyKCBtaW4gKSA8PSBAdmFsdWUubGVuZ3RoIDw9IE51bWJlciggbWF4IClcblxuICBsZW5ndGhNYXg6ICggbWF4ICkgLT5cbiAgICBAdmFsdWUubGVuZ3RoIDw9IE51bWJlciggbWF4IClcblxuICBsZW5ndGhNaW46ICggbWluICkgLT5cbiAgICBAdmFsdWUubGVuZ3RoID49IE51bWJlciggbWluIClcblxuICBsZW5ndGhJczogKCBsZW4gKSAtPlxuICAgIEB2YWx1ZS5sZW5ndGggaXMgTnVtYmVyKCBsZW4gKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWYWx1ZXNcbiAgY29uc3RydWN0b3I6ICggaXRlbXMgKSAtPlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKSB1bmxlc3MgQXJyYXkuaXNBcnJheSBpdGVtc1xuICAgIEBwdXNoLmFwcGx5IEAsIGl0ZW1zXG5cbiAgbm9ybWFsOiAtPlxuICAgIEBtYXAgKCBvYmogKSAtPlxuICAgICAgaWQ6IG9iai5pZFxuICAgICAgdmFsdWU6IG9iai52YWx1ZVxuXG4gIHZhbHVlQXJyYXk6IC0+XG4gICAgQG1hcCAoIG9iaiApIC0+IG9iai52YWx1ZVxuXG4gIGlkQXJyYXk6IC0+XG4gICAgQG1hcCAoIG9iaiApIC0+IG9iai5pZFxuXG4gIGlkVmFsdWVNYXA6IC0+XG4gICAgQHJlZHVjZSAoIGFjYywgb2JqICkgLT5cbiAgICAgIGFjY1sgb2JqLmlkIF0gPSBvYmoudmFsdWVcbiAgICAgIGFjY1xuICAgICwge31cblxuICB2YWx1ZVN0cmluZzogKCBkZWxpbWl0ZXIgPSBcIiwgXCIgKSAtPlxuICAgIEB2YWx1ZUFycmF5KCkuam9pbiBkZWxpbWl0ZXJcblxuICB2YWx1ZUFycmF5T25lOiAtPlxuICAgIHJlc3VsdCA9IEB2YWx1ZUFycmF5KClcbiAgICBpZiByZXN1bHQubGVuZ3RoID4gMSB0aGVuIHJlc3VsdCBlbHNlIHJlc3VsdFswXVxuXG4gIGlkQXJyYXlPbmU6IC0+XG4gICAgcmVzdWx0ID0gQGlkQXJyYXkoKVxuICAgIGlmIHJlc3VsdC5sZW5ndGggPiAxIHRoZW4gcmVzdWx0IGVsc2UgcmVzdWx0WzBdXG5cbiAgYXQ6ICggaSApIC0+XG4gICAgaWYgaXNOYU4gTnVtYmVyIGlcbiAgICAgIGZvciBvYmogaW4gQFxuICAgICAgICByZXR1cm4gb2JqIGlmIG9iai5pZCBpcyBpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBbaV0udmFsdWVcblxuICBmaXJzdDogLT4gQGF0IDBcblxuICBsYXN0OiAtPiBAYXQgQGxlbmd0aCAtIDFcblxuICBzZXJpYWxpemU6IC0+IEpTT04uc3RyaW5naWZ5IEBub3JtYWwoKVxuIl19
