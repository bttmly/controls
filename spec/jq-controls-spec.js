(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var demethodize;

demethodize = function(method) {
  return Function.prototype.call.bind(method);
};

module.exports = {
  each: demethodize(Array.prototype.forEach),
  map: demethodize(Array.prototype.map),
  reduce: demethodize(Array.prototype.reduce),
  filter: demethodize(Array.prototype.filter),
  every: demethodize(Array.prototype.every),
  some: demethodize(Array.prototype.some)
};


},{}],2:[function(require,module,exports){
var $, Controls, Values, assert, chai, each, every, expect, filter, first, htmlFiles, jQuery, map, reduce, sameSelection, should, some, tags, trees, utils, _ref,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$ = jQuery = window.jQuery;

Controls = jQuery.Controls;

Values = jQuery.Values;

chai = window.chai;

assert = chai.assert;

expect = chai.expect;

should = chai.should();

utils = require("./spec-utilities.coffee");

sameSelection = utils.areSameSelection;

_ref = require("./array-generics.coffee"), each = _ref.each, map = _ref.map, reduce = _ref.reduce, filter = _ref.filter, every = _ref.every, some = _ref.some;

tags = ["input", "select", "button", "textarea"].join(", ");

first = function(arr) {
  return arr[0];
};

trees = window.trees = [];

trees.byId = function(id) {
  var tree, _i, _len;
  for (_i = 0, _len = this.length; _i < _len; _i++) {
    tree = this[_i];
    if (tree.attr("id") === id) {
      return tree;
    }
  }
  return null;
};

htmlFiles = ["./spec/html/values.html", "./spec/html/mixed.html", "./spec/html/validation.html", "./spec/html/with-initial-state.html"];

$.when.apply($, htmlFiles.map($.get)).then(function() {
  [].push.apply(trees, [].slice.call(arguments).map(first).map($));
  return mocha.run();
});

describe("jQuery.fn.controls()", function() {
  return describe("basics", function() {
    it("exists", function() {
      return expect(jQuery.fn.controls).to.be.a("function");
    });
    return it("works", function() {
      var cSel, jSel;
      cSel = trees.byId("values").controls();
      jSel = trees.byId("values").find("input, button, select");
      return expect(utils.areSameSelection(cSel, jSel)).to.equal(true);
    });
  });
});

describe("Controls.validateElement()", function() {
  var valid;
  valid = Controls.validateElement;
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
      els = trees.byId("validation").find(".custom-validation");
      expect(valid(els[0], validatorA)).to.equal(true);
      return expect(valid(els[1], validatorA)).to.equal(false);
    });
    it("accepts additional arguments", function() {
      var els;
      els = trees.byId("validation").find(".custom-validation");
      expect(valid(els[0], validatorB, "abc")).to.equal(true);
      return expect(valid(els[1], validatorB, "abc")).to.equal(false);
    });
    return it("calls the function with the element as 'this'", function() {
      var els;
      els = trees.byId("validation").find(".custom-validation");
      return expect(valid(els[0], thisIs, els[0])).to.equal(true);
    });
  });
  describe("validation against a data-control-validation attribute", function() {
    return it("validates an input against preset attribute validators", function() {
      var els;
      els = trees.byId("validation").find(".attr-validation");
      expect(valid(els[0])).to.equal(true);
      return expect(valid(els[1])).to.equal(false);
    });
  });
  return describe("validation against bound validators", function() {
    return it("validates against all present attached validators", function() {
      var els;
      els = trees.byId("validation").find(".data-validation");
      els[0]._controlValidators = [
        (function() {
          return this.value === "123";
        }), (function() {
          return this.value !== "abc";
        })
      ];
      els[1]._controlValidators = [
        (function() {
          return this.value !== "abc";
        }), (function() {
          return this.value === "abc";
        })
      ];
      expect(valid(els[0])).to.equal(true);
      expect(valid(els[1])).to.equal(false);
      delete els[0]._controlValidators;
      return delete els[1]._controlValidators;
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
    jSel = trees.byId("values");
    cSel = trees.byId("values").controls();
    return qsa = Element.prototype.querySelectorAll.bind(trees.byId("values")[0]);
  });
  describe("@filter()", function() {
    it("accepts a selector", function() {
      var btn, flt;
      flt = cSel.filter("button");
      btn = jSel.find("button");
      expect(sameSelection(flt, btn)).to.equal(true);
      expect(btn).to.be["instanceof"](jQuery);
      return expect(flt).to.be["instanceof"](Controls);
    });
    it("accepts an array of DOM elements", function() {
      var btn, flt;
      btn = qsa("button");
      flt = cSel.filter("button");
      expect(sameSelection(flt, btn)).to.equal(true);
      return expect(flt).to.be["instanceof"](Controls);
    });
    it("accepts a function", function() {
      var btn, flt;
      flt = cSel.filter(function() {
        return this.tagName.toLowerCase() === "button";
      });
      btn = qsa("button");
      expect(sameSelection(flt, btn)).to.equal(true);
      return expect(flt).to.be["instanceof"](Controls);
    });
    it("accepts a jQuery selection", function() {
      var btn, flt;
      btn = jSel.find("button");
      flt = cSel.filter(btn);
      expect(sameSelection(flt, btn)).to.equal(true);
      expect(flt).to.be["instanceof"](Controls);
      return expect(btn).to.be["instanceof"](jQuery);
    });
    return xit("accepts a Controls selection");
  });
  describe("@not()", function() {
    it("accepts a selector", function() {
      var cNoInput, jNoInput;
      jNoInput = jSel.find(tags).not("input");
      cNoInput = cSel.not("input");
      expect(sameSelection(jNoInput, cNoInput)).to.equal(true);
      expect(cNoInput).to.be["instanceof"](Controls);
      return expect(jNoInput).to.be["instanceof"](jQuery);
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
      vEmptyValue = filter(qsa(tags), function(el) {
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
      var ctls, els, t1, t2, t3, t4;
      els = trees.byId("initialState");
      ctls = els.controls();
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
  describe("@clear()", function() {});
  describe("@propValues()", function() {});
  describe("@values()", function() {});
  describe("@check", function() {});
  describe("@uncheck", function() {});
  describe("@require", function() {});
  describe("@unrequire", function() {});
  describe("@disable", function() {});
  describe("@enable", function() {});
  describe("@valid", function() {});
  describe("@bindValidator", function() {});
  describe("@labels", function() {});
});


},{"./array-generics.coffee":1,"./spec-utilities.coffee":3}],3:[function(require,module,exports){
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports = {
  areSameSelection: function(objA, objB) {
    var arrA, arrB, slice;
    if (objA.length !== objB.length) {
      return false;
    }
    slice = Function.prototype.call.bind(Array.prototype.slice);
    arrA = $.unique(slice(objA));
    arrB = $.unique(slice(objB));
    return arrA.every(function(el) {
      return __indexOf.call(arrB, el) >= 0;
    });
  }
};


},{}]},{},[2])