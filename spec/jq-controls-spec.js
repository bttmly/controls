(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./spec/controls-spec.coffee":[function(require,module,exports){
var BUTTON, CHECK, CHECKABLE, Controls, RADIO, TAGS, Values, every, expect, filter, first, fs, jQuery, last, map, reduce, sameSelection, sinon, slice, some, trees, type, _ref, _ref1,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };



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
      console.log(id);
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



},{"./array-generics.coffee":"/Users/nickbottomley/Documents/dev/experiments/jquery-controls/spec/array-generics.coffee","./selectors.coffee":"/Users/nickbottomley/Documents/dev/experiments/jquery-controls/spec/selectors.coffee","./spec-utilities.coffee":"/Users/nickbottomley/Documents/dev/experiments/jquery-controls/spec/spec-utilities.coffee"}],"/Users/nickbottomley/Documents/dev/experiments/jquery-controls/spec/array-generics.coffee":[function(require,module,exports){
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



},{}],"/Users/nickbottomley/Documents/dev/experiments/jquery-controls/spec/selectors.coffee":[function(require,module,exports){
module.exports = {
  CHECKABLE: "input[type='radio'], input[type='checkbox']",
  BUTTON: "input[type='button'], button",
  TAGS: "input, select, button, textarea",
  RADIO: "[type='radio']",
  CHECK: "[type='checkbox']"
};



},{}],"/Users/nickbottomley/Documents/dev/experiments/jquery-controls/spec/spec-utilities.coffee":[function(require,module,exports){
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



},{}]},{},["./spec/controls-spec.coffee"]);
