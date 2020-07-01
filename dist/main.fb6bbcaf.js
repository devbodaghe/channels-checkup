// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/prando/dist/Prando.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Prando =
/** @class */
function () {
  // ================================================================================================================
  // CONSTRUCTOR ----------------------------------------------------------------------------------------------------

  /**
   * Generate a new Prando pseudo-random number generator.
   *
   * @param seed - A number or string seed that determines which pseudo-random number sequence will be created. Defaults to current time.
   */
  function Prando(seed) {
    this._value = NaN;

    if (typeof seed === "string") {
      // String seed
      this._seed = this.hashCode(seed);
    } else if (typeof seed === "number") {
      // Numeric seed
      this._seed = this.getSafeSeed(seed);
    } else {
      // Pseudo-random seed
      this._seed = this.getSafeSeed(Prando.MIN + Math.floor((Prando.MAX - Prando.MIN) * Math.random()));
    }

    this.reset();
  } // ================================================================================================================
  // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

  /**
   * Generates a pseudo-random number between a lower (inclusive) and a higher (exclusive) bounds.
   *
   * @param min - The minimum number that can be randomly generated.
   * @param pseudoMax - The maximum number that can be randomly generated (exclusive).
   * @return The generated pseudo-random number.
   */


  Prando.prototype.next = function (min, pseudoMax) {
    if (min === void 0) {
      min = 0;
    }

    if (pseudoMax === void 0) {
      pseudoMax = 1;
    }

    this.recalculate();
    return this.map(this._value, Prando.MIN, Prando.MAX, min, pseudoMax);
  };
  /**
   * Generates a pseudo-random integer number in a range (inclusive).
   *
   * @param min - The minimum number that can be randomly generated.
   * @param max - The maximum number that can be randomly generated.
   * @return The generated pseudo-random number.
   */


  Prando.prototype.nextInt = function (min, max) {
    if (min === void 0) {
      min = 10;
    }

    if (max === void 0) {
      max = 100;
    }

    this.recalculate();
    return Math.floor(this.map(this._value, Prando.MIN, Prando.MAX, min, max + 1));
  };
  /**
   * Generates a pseudo-random string sequence of a particular length from a specific character range.
   *
   * Note: keep in mind that creating a random string sequence does not guarantee uniqueness; there is always a
   * 1 in (char_length^string_length) chance of collision. For real unique string ids, always check for
   * pre-existing ids, or employ a robust GUID/UUID generator.
   *
   * @param length - Length of the strting to be generated.
   * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
   * @return The generated string sequence.
   */


  Prando.prototype.nextString = function (length, chars) {
    if (length === void 0) {
      length = 16;
    }

    if (chars === void 0) {
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }

    var str = "";

    while (str.length < length) {
      str += this.nextChar(chars);
    }

    return str;
  };
  /**
   * Generates a pseudo-random string of 1 character specific character range.
   *
   * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
   * @return The generated character.
   */


  Prando.prototype.nextChar = function (chars) {
    if (chars === void 0) {
      chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }

    this.recalculate();
    return chars.substr(this.nextInt(0, chars.length - 1), 1);
  };
  /**
   * Picks a pseudo-random item from an array. The array is left unmodified.
   *
   * Note: keep in mind that while the returned item will be random enough, picking one item from the array at a time
   * does not guarantee nor imply that a sequence of random non-repeating items will be picked. If you want to
   * *pick items in a random order* from an array, instead of *pick one random item from an array*, it's best to
   * apply a *shuffle* transformation to the array instead, then read it linearly.
   *
   * @param array - Array of any type containing one or more candidates for random picking.
   * @return An item from the array.
   */


  Prando.prototype.nextArrayItem = function (array) {
    this.recalculate();
    return array[this.nextInt(0, array.length - 1)];
  };
  /**
   * Generates a pseudo-random boolean.
   *
   * @return A value of true or false.
   */


  Prando.prototype.nextBoolean = function () {
    this.recalculate();
    return this._value > 0.5;
  };
  /**
   * Skips ahead in the sequence of numbers that are being generated. This is equivalent to
   * calling next() a specified number of times, but faster since it doesn't need to map the
   * new random numbers to a range and return it.
   *
   * @param iterations - The number of items to skip ahead.
   */


  Prando.prototype.skip = function (iterations) {
    if (iterations === void 0) {
      iterations = 1;
    }

    while (iterations-- > 0) {
      this.recalculate();
    }
  };
  /**
   * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
   * will then produce the same sequence of numbers it had produced before. This is equivalent to
   * creating a new Prando instance with the same seed as another Prando instance.
   *
   * Example:
   * let rng = new Prando(12345678);
   * console.log(rng.next()); // 0.6177754114889017
   * console.log(rng.next()); // 0.5784605181725837
   * rng.reset();
   * console.log(rng.next()); // 0.6177754114889017 again
   * console.log(rng.next()); // 0.5784605181725837 again
   */


  Prando.prototype.reset = function () {
    this._value = this._seed;
  }; // ================================================================================================================
  // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------


  Prando.prototype.recalculate = function () {
    this._value = this.xorshift(this._value);
  };

  Prando.prototype.xorshift = function (value) {
    // Xorshift*32
    // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
    value ^= value << 13;
    value ^= value >> 17;
    value ^= value << 5;
    return value;
  };

  Prando.prototype.map = function (val, minFrom, maxFrom, minTo, maxTo) {
    return (val - minFrom) / (maxFrom - minFrom) * (maxTo - minTo) + minTo;
  };

  Prando.prototype.hashCode = function (str) {
    var hash = 0;

    if (str) {
      var l = str.length;

      for (var i = 0; i < l; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
        hash = this.xorshift(hash);
      }
    }

    return this.getSafeSeed(hash);
  };

  Prando.prototype.getSafeSeed = function (seed) {
    if (seed === 0) return 1;
    return seed;
  };

  Prando.MIN = -2147483648; // Int32 min

  Prando.MAX = 2147483647; // Int32 max

  return Prando;
}();

var _default = Prando;
exports.default = _default;
},{}],"js/constants.js":[function(require,module,exports) {
module.exports = {
  members: {
    SET_1: ["David Evbo", "Kingsley ", "Stephan", "Shay", "Seyike", "Tobi", "Tunde", "Jessica", "Toks"],
    SET_2: ["Nonso", "Greg", "Dean", "Rashid", "Isaac", "Zoe", "Bakare", "Izu", "Fynnba"]
  },
  REFERENCE_DATE_STRING: "January 06, 2020",
  SEED: "oqiefi1293919qnwkasdasd0s"
};
},{}],"js/utils.js":[function(require,module,exports) {
function getNearestMonday() {
  var currentDate = new Date();
  var day = currentDate.getDay();
  var diff = currentDate.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

  var nearestMonday = new Date(currentDate.setDate(diff));
  var dd = nearestMonday.getDate();
  var mm = nearestMonday.getMonth() + 1;
  var yyyy = nearestMonday.getFullYear();
  return toddMMYYYY(dd, mm, yyyy);
}

function toddMMYYYY(dd, mm, yyyy) {
  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return dd + '/' + mm + '/' + yyyy;
}

function getNextSunday(d) {
  var currentDate = new Date();
  var day = currentDate.getDay();
  var diff = currentDate.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

  var nearestMonday = new Date(currentDate.setDate(diff));
  nearestMonday.setDate(nearestMonday.getDate() + 6);
  var dd = nearestMonday.getDate();
  var mm = nearestMonday.getMonth() + 1;
  var yyyy = nearestMonday.getFullYear();
  return toddMMYYYY(dd, mm, yyyy);
}

function deterministicShuffle(arr, rng) {
  for (var i = 0; i < arr.length; i++) {
    var j = rng.nextInt(0, i + 1);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}

module.exports = {
  getNearestMonday: getNearestMonday,
  getNextSunday: getNextSunday,
  deterministicShuffle: deterministicShuffle
};
},{}],"js/main.js":[function(require,module,exports) {
var Prando = require("prando").default;

var _require = require("./constants"),
    members = _require.members,
    REFERENCE_DATE_STRING = _require.REFERENCE_DATE_STRING;

var _require2 = require("./utils"),
    getNearestMonday = _require2.getNearestMonday,
    getNextSunday = _require2.getNextSunday,
    deterministicShuffle = _require2.deterministicShuffle;

function getWeekRangeString() {
  return getNearestMonday() + " - " + getNextSunday();
}

function weeksSince(dateString) {
  var date = new Date(dateString);
  var today = new Date();
  var result = Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
  return result;
}

function getRoundNumber() {
  return (weeksSince(REFERENCE_DATE_STRING) + 1) % (members.SET_1.length * 2 - 1);
}

function appendScheduleToDOM(participants1, participants2) {
  var pairings = [];

  for (var i = 0; i < participants1.length; i += 1) {
    var pairing = "<li>".concat(participants1[i], " - ").concat(participants2[i], "</li>");
    pairings.push(pairing);
  }

  var element = document.getElementById("app");
  var content = "<div>";
  content += "<h2>Pairings for the week ".concat(getWeekRangeString(), "</h2>");
  content += "<ul>";
  pairings.forEach(function (pair) {
    return content += pair;
  });
  content += "</ul>";
  element.innerHTML = content;
}

function generateSchedule() {
  var participants1 = members.SET_1;
  var participants2 = members.SET_2;
  schedulingAlgorithm(participants1, participants2, getRoundNumber());
  appendScheduleToDOM(participants1, participants2);
} // https://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm


function schedulingAlgorithm(participants1, participants2, week) {
  var rotations = week - 1;

  while (rotations > 0) {
    rotations -= 1;
    var first_participant_2 = participants2[0];
    var last_participant_1 = participants1[participants1.length - 1];

    for (var _i = 1; _i < participants2.length; _i++) {
      participants2[_i - 1] = participants2[_i];
    }

    participants2[participants2.length - 1] = last_participant_1;
    var i = participants1.length - 1;

    while (i >= 1) {
      participants1[i] = participants1[i - 1];
      i -= 1;
    }

    participants1[1] = first_participant_2;
  }
}

generateSchedule();
},{"prando":"node_modules/prando/dist/Prando.es.js","./constants":"js/constants.js","./utils":"js/utils.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50048" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map