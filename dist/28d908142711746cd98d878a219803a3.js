// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({34:[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],33:[function(require,module,exports) {
var global = (1,eval)("this");
var process = require("process");
/*
	This is rot.js, the ROguelike Toolkit in JavaScript.
	Version 0.7~dev, generated on Tue Dec 12 13:34:23 CET 2017.
*/
/**
 * Add objects for Node.js environment
 */
global.requestAnimationFrame = function(cb) {
	return setTimeout(function() { cb(Date.now()); }, 1000/60);
};

global.document = {
	body: {
		appendChild: function(child) {},
		scrollLeft: 0,
		scrollTop: 0
	},
	createElement: function(type) {
		var canvas;
		return canvas = {
			getBoundingClientRect: function() {
				var rect;
				return rect = {
					left: 0,
					top: 0
				};
			},
			getContext: function(type) {
				var context;
				return context = {
					_termcolor: null,
					beginPath: function() {},
					canvas: canvas,
					clearRect: function(x, y, w, h) {
						if(this._termcolor !== null) {
							var clearCmd = this._termcolor.clearToAnsi(this.fillStyle);
							process.stdout.write(clearCmd);
						}
					},
					drawImage: function(a, b, c, d, e, f, g, h, i) {},
					fill: function() {},
					fillRect: function(x, y, w, h) {
						if(this._termcolor !== null) {
							var clearCmd = this._termcolor.clearToAnsi(this.fillStyle);
							process.stdout.write(clearCmd);
						}
					},
					fillStyle: "#000",
					fillText: function(chs, x, y) {},
					font: "monospace",
					lineTo: function(x, y) {},
					measureText: function(ch) {
						var result;
						return result = {
							width: 12
						};
					},
					moveTo: function(x, y) {},
					textAlign: "center",
					textBaseline: "middle"
				};
			},
			height: 0,
			style: {
				left: "100px",
				position: "absolute",
				top: "100px",
				visibility: "hidden"
			},
			width: 0
		};
	},
	documentElement: {
		scrollLeft: 0,
		scrollTop: 0
	}
};
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.ROT = factory();
    }
}(this, function() {
/**
 * @namespace Top-level ROT namespace
 */
var ROT = {
	/**
	 * @returns {bool} Is rot.js supported by this browser?
	 */
	isSupported: function() {
		return !!(document.createElement("canvas").getContext && Function.prototype.bind);
	},

	/** Default with for display and map generators */
	DEFAULT_WIDTH: 80,
	/** Default height for display and map generators */
	DEFAULT_HEIGHT: 25,

	/** Directional constants. Ordering is important! */
	DIRS: {
		"4": [
			[ 0, -1],
			[ 1,  0],
			[ 0,  1],
			[-1,  0]
		],
		"8": [
			[ 0, -1],
			[ 1, -1],
			[ 1,  0],
			[ 1,  1],
			[ 0,  1],
			[-1,  1],
			[-1,  0],
			[-1, -1]
		],
		"6": [
			[-1, -1],
			[ 1, -1],
			[ 2,  0],
			[ 1,  1],
			[-1,  1],
			[-2,  0]
		]
	},

	/** Cancel key. */
	VK_CANCEL: 3, 
	/** Help key. */
	VK_HELP: 6, 
	/** Backspace key. */
	VK_BACK_SPACE: 8, 
	/** Tab key. */
	VK_TAB: 9, 
	/** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
	VK_CLEAR: 12, 
	/** Return/enter key on the main keyboard. */
	VK_RETURN: 13, 
	/** Reserved, but not used. */
	VK_ENTER: 14, 
	/** Shift key. */
	VK_SHIFT: 16, 
	/** Control key. */
	VK_CONTROL: 17, 
	/** Alt (Option on Mac) key. */
	VK_ALT: 18, 
	/** Pause key. */
	VK_PAUSE: 19, 
	/** Caps lock. */
	VK_CAPS_LOCK: 20, 
	/** Escape key. */
	VK_ESCAPE: 27, 
	/** Space bar. */
	VK_SPACE: 32, 
	/** Page Up key. */
	VK_PAGE_UP: 33, 
	/** Page Down key. */
	VK_PAGE_DOWN: 34, 
	/** End key. */
	VK_END: 35, 
	/** Home key. */
	VK_HOME: 36, 
	/** Left arrow. */
	VK_LEFT: 37, 
	/** Up arrow. */
	VK_UP: 38, 
	/** Right arrow. */
	VK_RIGHT: 39, 
	/** Down arrow. */
	VK_DOWN: 40, 
	/** Print Screen key. */
	VK_PRINTSCREEN: 44, 
	/** Ins(ert) key. */
	VK_INSERT: 45, 
	/** Del(ete) key. */
	VK_DELETE: 46, 
	/***/
	VK_0: 48,
	/***/
	VK_1: 49,
	/***/
	VK_2: 50,
	/***/
	VK_3: 51,
	/***/
	VK_4: 52,
	/***/
	VK_5: 53,
	/***/
	VK_6: 54,
	/***/
	VK_7: 55,
	/***/
	VK_8: 56,
	/***/
	VK_9: 57,
	/** Colon (:) key. Requires Gecko 15.0 */
	VK_COLON: 58, 
	/** Semicolon (;) key. */
	VK_SEMICOLON: 59, 
	/** Less-than (<) key. Requires Gecko 15.0 */
	VK_LESS_THAN: 60, 
	/** Equals (=) key. */
	VK_EQUALS: 61, 
	/** Greater-than (>) key. Requires Gecko 15.0 */
	VK_GREATER_THAN: 62, 
	/** Question mark (?) key. Requires Gecko 15.0 */
	VK_QUESTION_MARK: 63, 
	/** Atmark (@) key. Requires Gecko 15.0 */
	VK_AT: 64, 
	/***/
	VK_A: 65,
	/***/
	VK_B: 66,
	/***/
	VK_C: 67,
	/***/
	VK_D: 68,
	/***/
	VK_E: 69,
	/***/
	VK_F: 70,
	/***/
	VK_G: 71,
	/***/
	VK_H: 72,
	/***/
	VK_I: 73,
	/***/
	VK_J: 74,
	/***/
	VK_K: 75,
	/***/
	VK_L: 76,
	/***/
	VK_M: 77,
	/***/
	VK_N: 78,
	/***/
	VK_O: 79,
	/***/
	VK_P: 80,
	/***/
	VK_Q: 81,
	/***/
	VK_R: 82,
	/***/
	VK_S: 83,
	/***/
	VK_T: 84,
	/***/
	VK_U: 85,
	/***/
	VK_V: 86,
	/***/
	VK_W: 87,
	/***/
	VK_X: 88,
	/***/
	VK_Y: 89,
	/***/
	VK_Z: 90,
	/***/
	VK_CONTEXT_MENU: 93,
	/** 0 on the numeric keypad. */
	VK_NUMPAD0: 96, 
	/** 1 on the numeric keypad. */
	VK_NUMPAD1: 97, 
	/** 2 on the numeric keypad. */
	VK_NUMPAD2: 98, 
	/** 3 on the numeric keypad. */
	VK_NUMPAD3: 99, 
	/** 4 on the numeric keypad. */
	VK_NUMPAD4: 100, 
	/** 5 on the numeric keypad. */
	VK_NUMPAD5: 101, 
	/** 6 on the numeric keypad. */
	VK_NUMPAD6: 102, 
	/** 7 on the numeric keypad. */
	VK_NUMPAD7: 103, 
	/** 8 on the numeric keypad. */
	VK_NUMPAD8: 104, 
	/** 9 on the numeric keypad. */
	VK_NUMPAD9: 105, 
	/** * on the numeric keypad. */
	VK_MULTIPLY: 106,
	/** + on the numeric keypad. */
	VK_ADD: 107, 
	/***/
	VK_SEPARATOR: 108,
	/** - on the numeric keypad. */
	VK_SUBTRACT: 109, 
	/** Decimal point on the numeric keypad. */
	VK_DECIMAL: 110, 
	/** / on the numeric keypad. */
	VK_DIVIDE: 111, 
	/** F1 key. */
	VK_F1: 112, 
	/** F2 key. */
	VK_F2: 113, 
	/** F3 key. */
	VK_F3: 114, 
	/** F4 key. */
	VK_F4: 115, 
	/** F5 key. */
	VK_F5: 116, 
	/** F6 key. */
	VK_F6: 117, 
	/** F7 key. */
	VK_F7: 118, 
	/** F8 key. */
	VK_F8: 119, 
	/** F9 key. */
	VK_F9: 120, 
	/** F10 key. */
	VK_F10: 121, 
	/** F11 key. */
	VK_F11: 122, 
	/** F12 key. */
	VK_F12: 123, 
	/** F13 key. */
	VK_F13: 124, 
	/** F14 key. */
	VK_F14: 125, 
	/** F15 key. */
	VK_F15: 126, 
	/** F16 key. */
	VK_F16: 127, 
	/** F17 key. */
	VK_F17: 128, 
	/** F18 key. */
	VK_F18: 129, 
	/** F19 key. */
	VK_F19: 130, 
	/** F20 key. */
	VK_F20: 131, 
	/** F21 key. */
	VK_F21: 132, 
	/** F22 key. */
	VK_F22: 133, 
	/** F23 key. */
	VK_F23: 134, 
	/** F24 key. */
	VK_F24: 135, 
	/** Num Lock key. */
	VK_NUM_LOCK: 144, 
	/** Scroll Lock key. */
	VK_SCROLL_LOCK: 145, 
	/** Circumflex (^) key. Requires Gecko 15.0 */
	VK_CIRCUMFLEX: 160, 
	/** Exclamation (!) key. Requires Gecko 15.0 */
	VK_EXCLAMATION: 161, 
	/** Double quote () key. Requires Gecko 15.0 */
	VK_DOUBLE_QUOTE: 162, 
	/** Hash (#) key. Requires Gecko 15.0 */
	VK_HASH: 163, 
	/** Dollar sign ($) key. Requires Gecko 15.0 */
	VK_DOLLAR: 164, 
	/** Percent (%) key. Requires Gecko 15.0 */
	VK_PERCENT: 165, 
	/** Ampersand (&) key. Requires Gecko 15.0 */
	VK_AMPERSAND: 166, 
	/** Underscore (_) key. Requires Gecko 15.0 */
	VK_UNDERSCORE: 167, 
	/** Open parenthesis (() key. Requires Gecko 15.0 */
	VK_OPEN_PAREN: 168, 
	/** Close parenthesis ()) key. Requires Gecko 15.0 */
	VK_CLOSE_PAREN: 169, 
	/* Asterisk (*) key. Requires Gecko 15.0 */
	VK_ASTERISK: 170,
	/** Plus (+) key. Requires Gecko 15.0 */
	VK_PLUS: 171, 
	/** Pipe (|) key. Requires Gecko 15.0 */
	VK_PIPE: 172, 
	/** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
	VK_HYPHEN_MINUS: 173, 
	/** Open curly bracket ({) key. Requires Gecko 15.0 */
	VK_OPEN_CURLY_BRACKET: 174, 
	/** Close curly bracket (}) key. Requires Gecko 15.0 */
	VK_CLOSE_CURLY_BRACKET: 175, 
	/** Tilde (~) key. Requires Gecko 15.0 */
	VK_TILDE: 176, 
	/** Comma (,) key. */
	VK_COMMA: 188, 
	/** Period (.) key. */
	VK_PERIOD: 190, 
	/** Slash (/) key. */
	VK_SLASH: 191, 
	/** Back tick (`) key. */
	VK_BACK_QUOTE: 192, 
	/** Open square bracket ([) key. */
	VK_OPEN_BRACKET: 219, 
	/** Back slash (\) key. */
	VK_BACK_SLASH: 220, 
	/** Close square bracket (]) key. */
	VK_CLOSE_BRACKET: 221, 
	/** Quote (''') key. */
	VK_QUOTE: 222, 
	/** Meta key on Linux, Command key on Mac. */
	VK_META: 224, 
	/** AltGr key on Linux. Requires Gecko 15.0 */
	VK_ALTGR: 225, 
	/** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
	VK_WIN: 91, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_KANA: 21, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_HANGUL: 21, 
	/** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
	VK_EISU: 22, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_JUNJA: 23, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_FINAL: 24, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_HANJA: 25, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_KANJI: 25, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_CONVERT: 28, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_NONCONVERT: 29, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_ACCEPT: 30, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_MODECHANGE: 31, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_SELECT: 41, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_PRINT: 42, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_EXECUTE: 43, 
	/** Linux support for this keycode was added in Gecko 4.0.	 */
	VK_SLEEP: 95 
};
/**
 * @namespace
 * Contains text tokenization and breaking routines
 */
ROT.Text = {
	RE_COLORS: /%([bc]){([^}]*)}/g,

	/* token types */
	TYPE_TEXT:		0,
	TYPE_NEWLINE:	1,
	TYPE_FG:		2,
	TYPE_BG:		3,

	/**
	 * Measure size of a resulting text block
	 */
	measure: function(str, maxWidth) {
		var result = {width:0, height:1};
		var tokens = this.tokenize(str, maxWidth);
		var lineWidth = 0;

		for (var i=0;i<tokens.length;i++) {
			var token = tokens[i];
			switch (token.type) {
				case this.TYPE_TEXT:
					lineWidth += token.value.length;
				break;

				case this.TYPE_NEWLINE:
					result.height++;
					result.width = Math.max(result.width, lineWidth);
					lineWidth = 0;
				break;
			}
		}
		result.width = Math.max(result.width, lineWidth);

		return result;
	},

	/**
	 * Convert string to a series of a formatting commands
	 */
	tokenize: function(str, maxWidth) {
		var result = [];

		/* first tokenization pass - split texts and color formatting commands */
		var offset = 0;
		str.replace(this.RE_COLORS, function(match, type, name, index) {
			/* string before */
			var part = str.substring(offset, index);
			if (part.length) {
				result.push({
					type: ROT.Text.TYPE_TEXT,
					value: part
				});
			}

			/* color command */
			result.push({
				type: (type == "c" ? ROT.Text.TYPE_FG : ROT.Text.TYPE_BG),
				value: name.trim()
			});

			offset = index + match.length;
			return "";
		});

		/* last remaining part */
		var part = str.substring(offset);
		if (part.length) {
			result.push({
				type: ROT.Text.TYPE_TEXT,
				value: part
			});
		}

		return this._breakLines(result, maxWidth);
	},

	/* insert line breaks into first-pass tokenized data */
	_breakLines: function(tokens, maxWidth) {
		if (!maxWidth) { maxWidth = Infinity; }

		var i = 0;
		var lineLength = 0;
		var lastTokenWithSpace = -1;

		while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
			var token = tokens[i];
			if (token.type == ROT.Text.TYPE_NEWLINE) { /* reset */
				lineLength = 0; 
				lastTokenWithSpace = -1;
			}
			if (token.type != ROT.Text.TYPE_TEXT) { /* skip non-text tokens */
				i++;
				continue; 
			}

			/* remove spaces at the beginning of line */
			while (lineLength == 0 && token.value.charAt(0) == " ") { token.value = token.value.substring(1); }

			/* forced newline? insert two new tokens after this one */
			var index = token.value.indexOf("\n");
			if (index != -1) { 
				token.value = this._breakInsideToken(tokens, i, index, true); 

				/* if there are spaces at the end, we must remove them (we do not want the line too long) */
				var arr = token.value.split("");
				while (arr.length && arr[arr.length-1] == " ") { arr.pop(); }
				token.value = arr.join("");
			}

			/* token degenerated? */
			if (!token.value.length) {
				tokens.splice(i, 1);
				continue;
			}

			if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */

				/* is it possible to break within this token? */
				var index = -1;
				while (1) {
					var nextIndex = token.value.indexOf(" ", index+1);
					if (nextIndex == -1) { break; }
					if (lineLength + nextIndex > maxWidth) { break; }
					index = nextIndex;
				}

				if (index != -1) { /* break at space within this one */
					token.value = this._breakInsideToken(tokens, i, index, true);
				} else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
					var token = tokens[lastTokenWithSpace];
					var breakIndex = token.value.lastIndexOf(" ");
					token.value = this._breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
					i = lastTokenWithSpace;
				} else { /* force break in this token */
					token.value = this._breakInsideToken(tokens, i, maxWidth-lineLength, false);
				}

			} else { /* line not long, continue */
				lineLength += token.value.length;
				if (token.value.indexOf(" ") != -1) { lastTokenWithSpace = i; }
			}
			
			i++; /* advance to next token */
		}


		tokens.push({type: ROT.Text.TYPE_NEWLINE}); /* insert fake newline to fix the last text line */

		/* remove trailing space from text tokens before newlines */
		var lastTextToken = null;
		for (var i=0;i<tokens.length;i++) {
			var token = tokens[i];
			switch (token.type) {
				case ROT.Text.TYPE_TEXT: lastTextToken = token; break;
				case ROT.Text.TYPE_NEWLINE: 
					if (lastTextToken) { /* remove trailing space */
						var arr = lastTextToken.value.split("");
						while (arr.length && arr[arr.length-1] == " ") { arr.pop(); }
						lastTextToken.value = arr.join("");
					}
					lastTextToken = null;
				break;
			}
		}

		tokens.pop(); /* remove fake token */

		return tokens;
	},

	/**
	 * Create new tokens and insert them into the stream
	 * @param {object[]} tokens
	 * @param {int} tokenIndex Token being processed
	 * @param {int} breakIndex Index within current token's value
	 * @param {bool} removeBreakChar Do we want to remove the breaking character?
	 * @returns {string} remaining unbroken token value
	 */
	_breakInsideToken: function(tokens, tokenIndex, breakIndex, removeBreakChar) {
		var newBreakToken = {
			type: ROT.Text.TYPE_NEWLINE
		};
		var newTextToken = {
			type: ROT.Text.TYPE_TEXT,
			value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
		};
		tokens.splice(tokenIndex+1, 0, newBreakToken, newTextToken);
		return tokens[tokenIndex].value.substring(0, breakIndex);
	}
};
/**
 * @returns {any} Randomly picked item, null when length=0
 */
Array.prototype.random = Array.prototype.random || function() {
	if (!this.length) { return null; }
	return this[Math.floor(ROT.RNG.getUniform() * this.length)];
};

/**
 * @returns {array} New array with randomized items
 */
Array.prototype.randomize = Array.prototype.randomize || function() {
  var result = [];
  var clone = this.slice();
  while (clone.length) {
    var index = clone.indexOf(clone.random());
    result.push(clone.splice(index, 1)[0]);
  }
  return result;
};
/**
 * Always positive modulus
 * @param {int} n Modulus
 * @returns {int} this modulo n
 */
Number.prototype.mod = Number.prototype.mod || function(n) {
	return ((this%n)+n)%n;
};
/**
 * @returns {string} First letter capitalized
 */
String.prototype.capitalize = String.prototype.capitalize || function() {
	return this.charAt(0).toUpperCase() + this.substring(1);
};

/** 
 * Left pad
 * @param {string} [character="0"]
 * @param {int} [count=2]
 */
String.prototype.lpad = String.prototype.lpad || function(character, count) {
	var ch = character || "0";
	var cnt = count || 2;

	var s = "";
	while (s.length < (cnt - this.length)) { s += ch; }
	s = s.substring(0, cnt-this.length);
	return s+this;
};

/** 
 * Right pad
 * @param {string} [character="0"]
 * @param {int} [count=2]
 */
String.prototype.rpad = String.prototype.rpad || function(character, count) {
	var ch = character || "0";
	var cnt = count || 2;

	var s = "";
	while (s.length < (cnt - this.length)) { s += ch; }
	s = s.substring(0, cnt-this.length);
	return this+s;
};

/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
String.format = String.format || function(template) {
	var map = String.format.map;
	var args = Array.prototype.slice.call(arguments, 1);

	var replacer = function(match, group1, group2, index) {
		if (template.charAt(index-1) == "%") { return match.substring(1); }
		if (!args.length) { return match; }
		var obj = args[0];

		var group = group1 || group2;
		var parts = group.split(",");
		var name = parts.shift();
		var method = map[name.toLowerCase()];
		if (!method) { return match; }

		var obj = args.shift();
		var replaced = obj[method].apply(obj, parts);

		var first = name.charAt(0);
		if (first != first.toLowerCase()) { replaced = replaced.capitalize(); }

		return replaced;
	};
	return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
};

String.format.map = String.format.map || {
	"s": "toString"
};

/**
 * Convenience shortcut to String.format(this)
 */
String.prototype.format = String.prototype.format || function() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(this);
	return String.format.apply(String, args);
};

if (!Object.create) {  
	/**
	 * ES5 Object.create
	 */
	Object.create = function(o) {  
		var tmp = function() {};
		tmp.prototype = o;
		return new tmp();
	};  
}  
/**
 * Sets prototype of this function to an instance of parent function
 * @param {function} parent
 */
Function.prototype.extend = Function.prototype.extend || function(parent) {
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	return this;
};
if (typeof window != "undefined") {
	window.requestAnimationFrame =
		window.requestAnimationFrame
		|| window.mozRequestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| window.oRequestAnimationFrame
		|| window.msRequestAnimationFrame
		|| function(cb) { return setTimeout(function() { cb(Date.now()); }, 1000/60); };

	window.cancelAnimationFrame =
		window.cancelAnimationFrame
		|| window.mozCancelAnimationFrame
		|| window.webkitCancelAnimationFrame
		|| window.oCancelAnimationFrame
		|| window.msCancelAnimationFrame
		|| function(id) { return clearTimeout(id); };
}
/**
 * @class Visual map display
 * @param {object} [options]
 * @param {int} [options.width=ROT.DEFAULT_WIDTH]
 * @param {int} [options.height=ROT.DEFAULT_HEIGHT]
 * @param {int} [options.fontSize=15]
 * @param {string} [options.fontFamily="monospace"]
 * @param {string} [options.fontStyle=""] bold/italic/none/both
 * @param {string} [options.fg="#ccc"]
 * @param {string} [options.bg="#000"]
 * @param {float} [options.spacing=1]
 * @param {float} [options.border=0]
 * @param {string} [options.layout="rect"]
 * @param {bool} [options.forceSquareRatio=false]
 * @param {int} [options.tileWidth=32]
 * @param {int} [options.tileHeight=32]
 * @param {object} [options.tileMap={}]
 * @param {image} [options.tileSet=null]
 * @param {image} [options.tileColorize=false]
 */
ROT.Display = function(options) {
	var canvas = document.createElement("canvas");
	this._context = canvas.getContext("2d");
	this._data = {};
	this._dirty = false; /* false = nothing, true = all, object = dirty cells */
	this._options = {};
	this._backend = null;
	
	var defaultOptions = {
		width: ROT.DEFAULT_WIDTH,
		height: ROT.DEFAULT_HEIGHT,
		transpose: false,
		layout: "rect",
		fontSize: 15,
		spacing: 1,
		border: 0,
		forceSquareRatio: false,
		fontFamily: "monospace",
		fontStyle: "",
		fg: "#ccc",
		bg: "#000",
		tileWidth: 32,
		tileHeight: 32,
		tileMap: {},
		tileSet: null,
		tileColorize: false,
		termColor: "xterm"
	};
	for (var p in options) { defaultOptions[p] = options[p]; }
	this.setOptions(defaultOptions);
	this.DEBUG = this.DEBUG.bind(this);

	this._tick = this._tick.bind(this);
	requestAnimationFrame(this._tick);
};

/**
 * Debug helper, ideal as a map generator callback. Always bound to this.
 * @param {int} x
 * @param {int} y
 * @param {int} what
 */
ROT.Display.prototype.DEBUG = function(x, y, what) {
	var colors = [this._options.bg, this._options.fg];
	this.draw(x, y, null, null, colors[what % colors.length]);
};

/**
 * Clear the whole display (cover it with background color)
 */
ROT.Display.prototype.clear = function() {
	this._data = {};
	this._dirty = true;
};

/**
 * @see ROT.Display
 */
ROT.Display.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
	if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
		if (options.layout) { 
			this._backend = new ROT.Display[options.layout.capitalize()](this._context);
		}

		var font = (this._options.fontStyle ? this._options.fontStyle + " " : "") + this._options.fontSize + "px " + this._options.fontFamily;
		this._context.font = font;
		this._backend.compute(this._options);
		this._context.font = font;
		this._context.textAlign = "center";
		this._context.textBaseline = "middle";
		this._dirty = true;
	}
	return this;
};

/**
 * Returns currently set options
 * @returns {object} Current options object 
 */
ROT.Display.prototype.getOptions = function() {
	return this._options;
};

/**
 * Returns the DOM node of this display
 * @returns {node} DOM node
 */
ROT.Display.prototype.getContainer = function() {
	return this._context.canvas;
};

/**
 * Compute the maximum width/height to fit into a set of given constraints
 * @param {int} availWidth Maximum allowed pixel width
 * @param {int} availHeight Maximum allowed pixel height
 * @returns {int[2]} cellWidth,cellHeight
 */
ROT.Display.prototype.computeSize = function(availWidth, availHeight) {
	return this._backend.computeSize(availWidth, availHeight, this._options);
};

/**
 * Compute the maximum font size to fit into a set of given constraints
 * @param {int} availWidth Maximum allowed pixel width
 * @param {int} availHeight Maximum allowed pixel height
 * @returns {int} fontSize
 */
ROT.Display.prototype.computeFontSize = function(availWidth, availHeight) {
	return this._backend.computeFontSize(availWidth, availHeight, this._options);
};

/**
 * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
 * @param {Event} e event
 * @returns {int[2]} -1 for values outside of the canvas
 */
ROT.Display.prototype.eventToPosition = function(e) {
	if (e.touches) {
		var x = e.touches[0].clientX;
		var y = e.touches[0].clientY;
	} else {
		var x = e.clientX;
		var y = e.clientY;
	}

	var rect = this._context.canvas.getBoundingClientRect();
	x -= rect.left;
	y -= rect.top;
	
	x *= this._context.canvas.width / this._context.canvas.clientWidth;
	y *= this._context.canvas.height / this._context.canvas.clientHeight;

	if (x < 0 || y < 0 || x >= this._context.canvas.width || y >= this._context.canvas.height) { return [-1, -1]; }

	return this._backend.eventToPosition(x, y);
};

/**
 * @param {int} x
 * @param {int} y
 * @param {string || string[]} ch One or more chars (will be overlapping themselves)
 * @param {string} [fg] foreground color
 * @param {string} [bg] background color
 */
ROT.Display.prototype.draw = function(x, y, ch, fg, bg) {
	if (!fg) { fg = this._options.fg; }
	if (!bg) { bg = this._options.bg; }
	this._data[x+","+y] = [x, y, ch, fg, bg];
	
	if (this._dirty === true) { return; } /* will already redraw everything */
	if (!this._dirty) { this._dirty = {}; } /* first! */
	this._dirty[x+","+y] = true;
};

/**
 * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
 * @param {int} x
 * @param {int} y
 * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
 * @param {int} [maxWidth] wrap at what width?
 * @returns {int} lines drawn
 */
ROT.Display.prototype.drawText = function(x, y, text, maxWidth) {
	var fg = null;
	var bg = null;
	var cx = x;
	var cy = y;
	var lines = 1;
	if (!maxWidth) { maxWidth = this._options.width-x; }

	var tokens = ROT.Text.tokenize(text, maxWidth);

	while (tokens.length) { /* interpret tokenized opcode stream */
		var token = tokens.shift();
		switch (token.type) {
			case ROT.Text.TYPE_TEXT:
				var isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
				for (var i=0;i<token.value.length;i++) {
					var cc = token.value.charCodeAt(i);
					var c = token.value.charAt(i);
					// Assign to `true` when the current char is full-width.
					isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
					// Current char is space, whatever full-width or half-width both are OK.
					isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
					// The previous char is full-width and
					// current char is nether half-width nor a space.
					if (isPrevFullWidth && !isFullWidth && !isSpace) { cx++; } // add an extra position
					// The current char is full-width and
					// the previous char is not a space.
					if(isFullWidth && !isPrevSpace) { cx++; } // add an extra position
					this.draw(cx++, cy, c, fg, bg);
					isPrevSpace = isSpace;
					isPrevFullWidth = isFullWidth;
				}
			break;

			case ROT.Text.TYPE_FG:
				fg = token.value || null;
			break;

			case ROT.Text.TYPE_BG:
				bg = token.value || null;
			break;

			case ROT.Text.TYPE_NEWLINE:
				cx = x;
				cy++;
				lines++;
			break;
		}
	}

	return lines;
};

/**
 * Timer tick: update dirty parts
 */
ROT.Display.prototype._tick = function() {
	requestAnimationFrame(this._tick);

	if (!this._dirty) { return; }

	if (this._dirty === true) { /* draw all */
		this._context.fillStyle = this._options.bg;
		this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

		for (var id in this._data) { /* redraw cached data */
			this._draw(id, false);
		}

	} else { /* draw only dirty */
		for (var key in this._dirty) {
			this._draw(key, true);
		}
	}

	this._dirty = false;
};

/**
 * @param {string} key What to draw
 * @param {bool} clearBefore Is it necessary to clean before?
 */
ROT.Display.prototype._draw = function(key, clearBefore) {
	var data = this._data[key];
	if (data[4] != this._options.bg) { clearBefore = true; }

	this._backend.draw(data, clearBefore);
};
/**
 * @class Abstract display backend module
 * @private
 */
ROT.Display.Backend = function(context) {
	this._context = context;
};

ROT.Display.Backend.prototype.compute = function(options) {
};

ROT.Display.Backend.prototype.draw = function(data, clearBefore) {
};

ROT.Display.Backend.prototype.computeSize = function(availWidth, availHeight) {
};

ROT.Display.Backend.prototype.computeFontSize = function(availWidth, availHeight) {
};

ROT.Display.Backend.prototype.eventToPosition = function(x, y) {
};
/**
 * @class Rectangular backend
 * @private
 */
ROT.Display.Rect = function(context) {
	ROT.Display.Backend.call(this, context);
	
	this._spacingX = 0;
	this._spacingY = 0;
	this._canvasCache = {};
	this._options = {};
};
ROT.Display.Rect.extend(ROT.Display.Backend);

ROT.Display.Rect.cache = false;

ROT.Display.Rect.prototype.compute = function(options) {
	this._canvasCache = {};
	this._options = options;

	var charWidth = Math.ceil(this._context.measureText("W").width);
	this._spacingX = Math.ceil(options.spacing * charWidth);
	this._spacingY = Math.ceil(options.spacing * options.fontSize);

	if (this._options.forceSquareRatio) {
		this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
	}

	this._context.canvas.width = options.width * this._spacingX;
	this._context.canvas.height = options.height * this._spacingY;
};

ROT.Display.Rect.prototype.draw = function(data, clearBefore) {
	if (this.constructor.cache) {
		this._drawWithCache(data, clearBefore);
	} else {
		this._drawNoCache(data, clearBefore);
	}
};

ROT.Display.Rect.prototype._drawWithCache = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var hash = ""+ch+fg+bg;
	if (hash in this._canvasCache) {
		var canvas = this._canvasCache[hash];
	} else {
		var b = this._options.border;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = this._spacingX;
		canvas.height = this._spacingY;
		ctx.fillStyle = bg;
		ctx.fillRect(b, b, canvas.width-b, canvas.height-b);
		
		if (ch) {
			ctx.fillStyle = fg;
			ctx.font = this._context.font;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			var chars = [].concat(ch);
			for (var i=0;i<chars.length;i++) {
				ctx.fillText(chars[i], this._spacingX/2, Math.ceil(this._spacingY/2));
			}
		}
		this._canvasCache[hash] = canvas;
	}
	
	this._context.drawImage(canvas, x*this._spacingX, y*this._spacingY);
};

ROT.Display.Rect.prototype._drawNoCache = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	if (clearBefore) { 
		var b = this._options.border;
		this._context.fillStyle = bg;
		this._context.fillRect(x*this._spacingX + b, y*this._spacingY + b, this._spacingX - b, this._spacingY - b);
	}
	
	if (!ch) { return; }

	this._context.fillStyle = fg;

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		this._context.fillText(chars[i], (x+0.5) * this._spacingX, Math.ceil((y+0.5) * this._spacingY));
	}
};

ROT.Display.Rect.prototype.computeSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._spacingX);
	var height = Math.floor(availHeight / this._spacingY);
	return [width, height];
};

ROT.Display.Rect.prototype.computeFontSize = function(availWidth, availHeight) {
	var boxWidth = Math.floor(availWidth / this._options.width);
	var boxHeight = Math.floor(availHeight / this._options.height);

	/* compute char ratio */
	var oldFont = this._context.font;
	this._context.font = "100px " + this._options.fontFamily;
	var width = Math.ceil(this._context.measureText("W").width);
	this._context.font = oldFont;
	var ratio = width / 100;
		
	var widthFraction = ratio * boxHeight / boxWidth;
	if (widthFraction > 1) { /* too wide with current aspect ratio */
		boxHeight = Math.floor(boxHeight / widthFraction);
	}
	return Math.floor(boxHeight / this._options.spacing);
};

ROT.Display.Rect.prototype.eventToPosition = function(x, y) {
	return [Math.floor(x/this._spacingX), Math.floor(y/this._spacingY)];
};
/**
 * @class Hexagonal backend
 * @private
 */
ROT.Display.Hex = function(context) {
	ROT.Display.Backend.call(this, context);

	this._spacingX = 0;
	this._spacingY = 0;
	this._hexSize = 0;
	this._options = {};
};
ROT.Display.Hex.extend(ROT.Display.Backend);

ROT.Display.Hex.prototype.compute = function(options) {
	this._options = options;

	/* FIXME char size computation does not respect transposed hexes */
	var charWidth = Math.ceil(this._context.measureText("W").width);
	this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth/Math.sqrt(3)) / 2);
	this._spacingX = this._hexSize * Math.sqrt(3) / 2;
	this._spacingY = this._hexSize * 1.5;

	if (options.transpose) {
		var xprop = "height";
		var yprop = "width";
	} else {
		var xprop = "width";
		var yprop = "height";
	}
	this._context.canvas[xprop] = Math.ceil( (options.width + 1) * this._spacingX );
	this._context.canvas[yprop] = Math.ceil( (options.height - 1) * this._spacingY + 2*this._hexSize );
};

ROT.Display.Hex.prototype.draw = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var px = [
		(x+1) * this._spacingX,
		y * this._spacingY + this._hexSize
	];
	if (this._options.transpose) { px.reverse(); }

	if (clearBefore) {
		this._context.fillStyle = bg;
		this._fill(px[0], px[1]);
	}

	if (!ch) { return; }

	this._context.fillStyle = fg;

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		this._context.fillText(chars[i], px[0], Math.ceil(px[1]));
	}
};

ROT.Display.Hex.prototype.computeSize = function(availWidth, availHeight) {
	if (this._options.transpose) {
		availWidth += availHeight;
		availHeight = availWidth - availHeight;
		availWidth -= availHeight;
	}

	var width = Math.floor(availWidth / this._spacingX) - 1;
	var height = Math.floor((availHeight - 2*this._hexSize) / this._spacingY + 1);
	return [width, height];
};

ROT.Display.Hex.prototype.computeFontSize = function(availWidth, availHeight) {
	if (this._options.transpose) {
		availWidth += availHeight;
		availHeight = availWidth - availHeight;
		availWidth -= availHeight;
	}

	var hexSizeWidth = 2*availWidth / ((this._options.width+1) * Math.sqrt(3)) - 1;
	var hexSizeHeight = availHeight / (2 + 1.5*(this._options.height-1));
	var hexSize = Math.min(hexSizeWidth, hexSizeHeight);

	/* compute char ratio */
	var oldFont = this._context.font;
	this._context.font = "100px " + this._options.fontFamily;
	var width = Math.ceil(this._context.measureText("W").width);
	this._context.font = oldFont;
	var ratio = width / 100;

	hexSize = Math.floor(hexSize)+1; /* closest larger hexSize */

	/* FIXME char size computation does not respect transposed hexes */
	var fontSize = 2*hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));

	/* closest smaller fontSize */
	return Math.ceil(fontSize)-1;
};

ROT.Display.Hex.prototype.eventToPosition = function(x, y) {
	if (this._options.transpose) {
		x += y;
		y = x-y;
		x -= y;
		var nodeSize = this._context.canvas.width;
	} else {
		var nodeSize = this._context.canvas.height;
	}
	var size = nodeSize / this._options.height;
	y = Math.floor(y/size);

	if (y.mod(2)) { /* odd row */
		x -= this._spacingX;
		x = 1 + 2*Math.floor(x/(2*this._spacingX));
	} else {
		x = 2*Math.floor(x/(2*this._spacingX));
	}

	return [x, y];
};

/**
 * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
 */
ROT.Display.Hex.prototype._fill = function(cx, cy) {
	var a = this._hexSize;
	var b = this._options.border;

	this._context.beginPath();

	if (this._options.transpose) {
		this._context.moveTo(cx-a+b,	cy);
		this._context.lineTo(cx-a/2+b,	cy+this._spacingX-b);
		this._context.lineTo(cx+a/2-b,	cy+this._spacingX-b);
		this._context.lineTo(cx+a-b,	cy);
		this._context.lineTo(cx+a/2-b,	cy-this._spacingX+b);
		this._context.lineTo(cx-a/2+b,	cy-this._spacingX+b);
		this._context.lineTo(cx-a+b,	cy);
	} else {
		this._context.moveTo(cx,					cy-a+b);
		this._context.lineTo(cx+this._spacingX-b,	cy-a/2+b);
		this._context.lineTo(cx+this._spacingX-b,	cy+a/2-b);
		this._context.lineTo(cx,					cy+a-b);
		this._context.lineTo(cx-this._spacingX+b,	cy+a/2-b);
		this._context.lineTo(cx-this._spacingX+b,	cy-a/2+b);
		this._context.lineTo(cx,					cy-a+b);
	}
	this._context.fill();
};
/**
 * @class Tile backend
 * @private
 */
ROT.Display.Tile = function(context) {
	ROT.Display.Rect.call(this, context);
	
	this._options = {};
	this._colorCanvas = document.createElement("canvas");
};
ROT.Display.Tile.extend(ROT.Display.Rect);

ROT.Display.Tile.prototype.compute = function(options) {
	this._options = options;
	this._context.canvas.width = options.width * options.tileWidth;
	this._context.canvas.height = options.height * options.tileHeight;
	this._colorCanvas.width = options.tileWidth;
	this._colorCanvas.height = options.tileHeight;
};

ROT.Display.Tile.prototype.draw = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var tileWidth = this._options.tileWidth;
	var tileHeight = this._options.tileHeight;

	if (clearBefore) {
		if (this._options.tileColorize) {
			this._context.clearRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
		} else {
			this._context.fillStyle = bg;
			this._context.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
		}
	}

	if (!ch) { return; }

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		var tile = this._options.tileMap[chars[i]];
		if (!tile) { throw new Error("Char '" + chars[i] + "' not found in tileMap"); }
		
		if (this._options.tileColorize) { /* apply colorization */
			var canvas = this._colorCanvas;
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, tileWidth, tileHeight);

			context.drawImage(
				this._options.tileSet,
				tile[0], tile[1], tileWidth, tileHeight,
				0, 0, tileWidth, tileHeight
			);

			if (fg != "transparent") {
				context.fillStyle = fg;
				context.globalCompositeOperation = "source-atop";
				context.fillRect(0, 0, tileWidth, tileHeight);
			}

			if (bg != "transparent") {
				context.fillStyle = bg;
				context.globalCompositeOperation = "destination-over";
				context.fillRect(0, 0, tileWidth, tileHeight);
			}

			this._context.drawImage(canvas, x*tileWidth, y*tileHeight, tileWidth, tileHeight);

		} else { /* no colorizing, easy */
			this._context.drawImage(
				this._options.tileSet,
				tile[0], tile[1], tileWidth, tileHeight,
				x*tileWidth, y*tileHeight, tileWidth, tileHeight
			);
		}
	}
};

ROT.Display.Tile.prototype.computeSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._options.tileWidth);
	var height = Math.floor(availHeight / this._options.tileHeight);
	return [width, height];
};

ROT.Display.Tile.prototype.computeFontSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._options.width);
	var height = Math.floor(availHeight / this._options.height);
	return [width, height];
};

ROT.Display.Tile.prototype.eventToPosition = function(x, y) {
	return [Math.floor(x/this._options.tileWidth), Math.floor(y/this._options.tileHeight)];
};
/**
 * @namespace
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
ROT.RNG = {
	/**
	 * @returns {number} 
	 */
	getSeed: function() {
		return this._seed;
	},

	/**
	 * @param {number} seed Seed the number generator
	 */
	setSeed: function(seed) {
		seed = (seed < 1 ? 1/seed : seed);

		this._seed = seed;
		this._s0 = (seed >>> 0) * this._frac;

		seed = (seed*69069 + 1) >>> 0;
		this._s1 = seed * this._frac;

		seed = (seed*69069 + 1) >>> 0;
		this._s2 = seed * this._frac;

		this._c = 1;
		return this;
	},

	/**
	 * @returns {float} Pseudorandom value [0,1), uniformly distributed
	 */
	getUniform: function() {
		var t = 2091639 * this._s0 + this._c * this._frac;
		this._s0 = this._s1;
		this._s1 = this._s2;
		this._c = t | 0;
		this._s2 = t - this._c;
		return this._s2;
	},

	/**
	 * @param {int} lowerBound The lower end of the range to return a value from, inclusive
	 * @param {int} upperBound The upper end of the range to return a value from, inclusive
	 * @returns {int} Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
	 */
	getUniformInt: function(lowerBound, upperBound) {
		var max = Math.max(lowerBound, upperBound);
		var min = Math.min(lowerBound, upperBound);
		return Math.floor(this.getUniform() * (max - min + 1)) + min;
	},

	/**
	 * @param {float} [mean=0] Mean value
	 * @param {float} [stddev=1] Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
	 * @returns {float} A normally distributed pseudorandom value
	 */
	getNormal: function(mean, stddev) {
		do {
			var u = 2*this.getUniform()-1;
			var v = 2*this.getUniform()-1;
			var r = u*u + v*v;
		} while (r > 1 || r == 0);

		var gauss = u * Math.sqrt(-2*Math.log(r)/r);
		return (mean || 0) + gauss*(stddev || 1);
	},

	/**
	 * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
	 */
	getPercentage: function() {
		return 1 + Math.floor(this.getUniform()*100);
	},
	
	/**
	 * @param {object} data key=whatever, value=weight (relative probability)
	 * @returns {string} whatever
	 */
	getWeightedValue: function(data) {
		var total = 0;
		
		for (var id in data) {
			total += data[id];
		}
		var random = this.getUniform()*total;
		
		var part = 0;
		for (var id in data) {
			part += data[id];
			if (random < part) { return id; }
		}

		// If by some floating-point annoyance we have
		// random >= total, just return the last id.
		return id;
	},

	/**
	 * Get RNG state. Useful for storing the state and re-setting it via setState.
	 * @returns {?} Internal state
	 */
	getState: function() {
		return [this._s0, this._s1, this._s2, this._c];
	},

	/**
	 * Set a previously retrieved state.
	 * @param {?} state
	 */
	setState: function(state) {
		this._s0 = state[0];
		this._s1 = state[1];
		this._s2 = state[2];
		this._c  = state[3];
		return this;
	},

	/**
	 * Returns a cloned RNG
	 */
	clone: function() {
		var clone = Object.create(this);
		clone.setState(this.getState());
		return clone;
	},

	_s0: 0,
	_s1: 0,
	_s2: 0,
	_c: 0,
	_frac: 2.3283064365386963e-10 /* 2^-32 */
};

ROT.RNG.setSeed(Date.now());
/**
 * @class (Markov process)-based string generator. 
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>. 
 * Offers configurable order and prior.
 * @param {object} [options]
 * @param {bool} [options.words=false] Use word mode?
 * @param {int} [options.order=3]
 * @param {float} [options.prior=0.001]
 */
ROT.StringGenerator = function(options) {
	this._options = {
		words: false,
		order: 3,
		prior: 0.001
	};
	for (var p in options) { this._options[p] = options[p]; }

	this._boundary = String.fromCharCode(0);
	this._suffix = this._boundary;
	this._prefix = [];
	for (var i=0;i<this._options.order;i++) { this._prefix.push(this._boundary); }

	this._priorValues = {};
	this._priorValues[this._boundary] = this._options.prior;

	this._data = {};
};

/**
 * Remove all learning data
 */
ROT.StringGenerator.prototype.clear = function() {
	this._data = {};
	this._priorValues = {};
};

/**
 * @returns {string} Generated string
 */
ROT.StringGenerator.prototype.generate = function() {
	var result = [this._sample(this._prefix)];
	while (result[result.length-1] != this._boundary) {
		result.push(this._sample(result));
	}
	return this._join(result.slice(0, -1));
};

/**
 * Observe (learn) a string from a training set
 */
ROT.StringGenerator.prototype.observe = function(string) {
	var tokens = this._split(string);

	for (var i=0; i<tokens.length; i++) {
		this._priorValues[tokens[i]] = this._options.prior;
	}

	tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */

	for (var i=this._options.order; i<tokens.length; i++) {
		var context = tokens.slice(i-this._options.order, i);
		var event = tokens[i];
		for (var j=0; j<context.length; j++) {
			var subcontext = context.slice(j);
			this._observeEvent(subcontext, event);
		}
	}
};

ROT.StringGenerator.prototype.getStats = function() {
	var parts = [];

	var priorCount = 0;
	for (var p in this._priorValues) { priorCount++; }
	priorCount--; /* boundary */
	parts.push("distinct samples: " + priorCount);

	var dataCount = 0;
	var eventCount = 0;
	for (var p in this._data) { 
		dataCount++; 
		for (var key in this._data[p]) {
			eventCount++;
		}
	}
	parts.push("dictionary size (contexts): " + dataCount);
	parts.push("dictionary size (events): " + eventCount);

	return parts.join(", ");
};

/**
 * @param {string}
 * @returns {string[]}
 */
ROT.StringGenerator.prototype._split = function(str) {
	return str.split(this._options.words ? /\s+/ : "");
};

/**
 * @param {string[]}
 * @returns {string} 
 */
ROT.StringGenerator.prototype._join = function(arr) {
	return arr.join(this._options.words ? " " : "");
};

/**
 * @param {string[]} context
 * @param {string} event
 */
ROT.StringGenerator.prototype._observeEvent = function(context, event) {
	var key = this._join(context);
	if (!(key in this._data)) { this._data[key] = {}; }
	var data = this._data[key];

	if (!(event in data)) { data[event] = 0; }
	data[event]++;
};

/**
 * @param {string[]}
 * @returns {string}
 */
ROT.StringGenerator.prototype._sample = function(context) {
	context = this._backoff(context);
	var key = this._join(context);
	var data = this._data[key];

	var available = {};

	if (this._options.prior) {
		for (var event in this._priorValues) { available[event] = this._priorValues[event]; }
		for (var event in data) { available[event] += data[event]; }
	} else { 
		available = data;
	}

	return ROT.RNG.getWeightedValue(available);
};

/**
 * @param {string[]}
 * @returns {string[]}
 */
ROT.StringGenerator.prototype._backoff = function(context) {
	if (context.length > this._options.order) {
		context = context.slice(-this._options.order);
	} else if (context.length < this._options.order) {
		context = this._prefix.slice(0, this._options.order - context.length).concat(context);
	}

	while (!(this._join(context) in this._data) && context.length > 0) { context = context.slice(1); }

	return context;
};
/**
 * @class Generic event queue: stores events and retrieves them based on their time
 */
ROT.EventQueue = function() {
	this._time = 0;
	this._events = [];
	this._eventTimes = [];
};

/**
 * @returns {number} Elapsed time
 */
ROT.EventQueue.prototype.getTime = function() {
	return this._time;
};

/**
 * Clear all scheduled events
 */
ROT.EventQueue.prototype.clear = function() {
	this._events = [];
	this._eventTimes = [];
	return this;
};

/**
 * @param {?} event
 * @param {number} time
 */
ROT.EventQueue.prototype.add = function(event, time) {
	var index = this._events.length;
	for (var i=0;i<this._eventTimes.length;i++) {
		if (this._eventTimes[i] > time) {
			index = i;
			break;
		}
	}

	this._events.splice(index, 0, event);
	this._eventTimes.splice(index, 0, time);
};

/**
 * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
 * @returns {? || null} The event previously added by addEvent, null if no event available
 */
ROT.EventQueue.prototype.get = function() {
	if (!this._events.length) { return null; }

	var time = this._eventTimes.splice(0, 1)[0];
	if (time > 0) { /* advance */
		this._time += time;
		for (var i=0;i<this._eventTimes.length;i++) { this._eventTimes[i] -= time; }
	}

	return this._events.splice(0, 1)[0];
};

/**
 * Get the time associated with the given event
 * @param {?} event
 * @returns {number} time
 */
ROT.EventQueue.prototype.getEventTime = function(event) {
	var index = this._events.indexOf(event);
	if (index == -1) { return undefined }
	return this._eventTimes[index];
};

/**
 * Remove an event from the queue
 * @param {?} event
 * @returns {bool} success?
 */
ROT.EventQueue.prototype.remove = function(event) {
	var index = this._events.indexOf(event);
	if (index == -1) { return false }
	this._remove(index);
	return true;
};

/**
 * Remove an event from the queue
 * @param {int} index
 */
ROT.EventQueue.prototype._remove = function(index) {
	this._events.splice(index, 1);
	this._eventTimes.splice(index, 1);
};
/**
 * @class Abstract scheduler
 */
ROT.Scheduler = function() {
	this._queue = new ROT.EventQueue();
	this._repeat = [];
	this._current = null;
};

/**
 * @see ROT.EventQueue#getTime
 */
ROT.Scheduler.prototype.getTime = function() {
	return this._queue.getTime();
};

/**
 * @param {?} item
 * @param {bool} repeat
 */
ROT.Scheduler.prototype.add = function(item, repeat) {
	if (repeat) { this._repeat.push(item); }
	return this;
};

/**
 * Get the time the given item is scheduled for
 * @param {?} item
 * @returns {number} time
 */
ROT.Scheduler.prototype.getTimeOf = function(item) {
	return this._queue.getEventTime(item);
};

/**
 * Clear all items
 */
ROT.Scheduler.prototype.clear = function() {
	this._queue.clear();
	this._repeat = [];
	this._current = null;
	return this;
};

/**
 * Remove a previously added item
 * @param {?} item
 * @returns {bool} successful?
 */
ROT.Scheduler.prototype.remove = function(item) {
	var result = this._queue.remove(item);

	var index = this._repeat.indexOf(item);
	if (index != -1) { this._repeat.splice(index, 1); }

	if (this._current == item) { this._current = null; }

	return result;
};

/**
 * Schedule next item
 * @returns {?}
 */
ROT.Scheduler.prototype.next = function() {
	this._current = this._queue.get();
	return this._current;
};
/**
 * @class Simple fair scheduler (round-robin style)
 * @augments ROT.Scheduler
 */
ROT.Scheduler.Simple = function() {
	ROT.Scheduler.call(this);
};
ROT.Scheduler.Simple.extend(ROT.Scheduler);

/**
 * @see ROT.Scheduler#add
 */
ROT.Scheduler.Simple.prototype.add = function(item, repeat) {
	this._queue.add(item, 0);
	return ROT.Scheduler.prototype.add.call(this, item, repeat);
};

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Simple.prototype.next = function() {
	if (this._current && this._repeat.indexOf(this._current) != -1) {
		this._queue.add(this._current, 0);
	}
	return ROT.Scheduler.prototype.next.call(this);
};
/**
 * @class Speed-based scheduler
 * @augments ROT.Scheduler
 */
ROT.Scheduler.Speed = function() {
	ROT.Scheduler.call(this);
};
ROT.Scheduler.Speed.extend(ROT.Scheduler);

/**
 * @param {object} item anything with "getSpeed" method
 * @param {bool} repeat
 * @param {number} [time=1/item.getSpeed()]
 * @see ROT.Scheduler#add
 */
ROT.Scheduler.Speed.prototype.add = function(item, repeat, time) {
	this._queue.add(item, time !== undefined ? time : 1/item.getSpeed());
	return ROT.Scheduler.prototype.add.call(this, item, repeat);
};

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Speed.prototype.next = function() {
	if (this._current && this._repeat.indexOf(this._current) != -1) {
		this._queue.add(this._current, 1/this._current.getSpeed());
	}
	return ROT.Scheduler.prototype.next.call(this);
};
/**
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
ROT.Scheduler.Action = function() {
	ROT.Scheduler.call(this);
	this._defaultDuration = 1; /* for newly added */
	this._duration = this._defaultDuration; /* for this._current */
};
ROT.Scheduler.Action.extend(ROT.Scheduler);

/**
 * @param {object} item
 * @param {bool} repeat
 * @param {number} [time=1]
 * @see ROT.Scheduler#add
 */
ROT.Scheduler.Action.prototype.add = function(item, repeat, time) {
	this._queue.add(item, time || this._defaultDuration);
	return ROT.Scheduler.prototype.add.call(this, item, repeat);
};

ROT.Scheduler.Action.prototype.clear = function() {
	this._duration = this._defaultDuration;
	return ROT.Scheduler.prototype.clear.call(this);
};

ROT.Scheduler.Action.prototype.remove = function(item) {
	if (item == this._current) { this._duration = this._defaultDuration; }
	return ROT.Scheduler.prototype.remove.call(this, item);
};

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Action.prototype.next = function() {
	if (this._current && this._repeat.indexOf(this._current) != -1) {
		this._queue.add(this._current, this._duration || this._defaultDuration);
		this._duration = this._defaultDuration;
	}
	return ROT.Scheduler.prototype.next.call(this);
};

/**
 * Set duration for the active item
 */
ROT.Scheduler.Action.prototype.setDuration = function(time) {
	if (this._current) { this._duration = time; }
	return this;
};
/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
ROT.Engine = function(scheduler) {
	this._scheduler = scheduler;
	this._lock = 1;
};

/**
 * Start the main loop. When this call returns, the loop is locked.
 */
ROT.Engine.prototype.start = function() {
	return this.unlock();
};

/**
 * Interrupt the engine by an asynchronous action
 */
ROT.Engine.prototype.lock = function() {
	this._lock++;
	return this;
};

/**
 * Resume execution (paused by a previous lock)
 */
ROT.Engine.prototype.unlock = function() {
	if (!this._lock) { throw new Error("Cannot unlock unlocked engine"); }
	this._lock--;

	while (!this._lock) {
		var actor = this._scheduler.next();
		if (!actor) { return this.lock(); } /* no actors */
		var result = actor.act();
		if (result && result.then) { /* actor returned a "thenable", looks like a Promise */
			this.lock();
			result.then(this.unlock.bind(this));
		}
	}

	return this;
};
/**
 * @class Base map generator
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 */
ROT.Map = function(width, height) {
	this._width = width || ROT.DEFAULT_WIDTH;
	this._height = height || ROT.DEFAULT_HEIGHT;
};

ROT.Map.prototype.create = function(callback) {};

ROT.Map.prototype._fillMap = function(value) {
	var map = [];
	for (var i=0;i<this._width;i++) {
		map.push([]);
		for (var j=0;j<this._height;j++) { map[i].push(value); }
	}
	return map;
};
/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
ROT.Map.Arena = function(width, height) {
	ROT.Map.call(this, width, height);
};
ROT.Map.Arena.extend(ROT.Map);

ROT.Map.Arena.prototype.create = function(callback) {
	var w = this._width-1;
	var h = this._height-1;
	for (var i=0;i<=w;i++) {
		for (var j=0;j<=h;j++) {
			var empty = (i && j && i<w && j<h);
			callback(i, j, empty ? 0 : 1);
		}
	}
	return this;
};
/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
ROT.Map.DividedMaze = function(width, height) {
	ROT.Map.call(this, width, height);
	this._stack = [];
};
ROT.Map.DividedMaze.extend(ROT.Map);

ROT.Map.DividedMaze.prototype.create = function(callback) {
	var w = this._width;
	var h = this._height;
	
	this._map = [];
	
	for (var i=0;i<w;i++) {
		this._map.push([]);
		for (var j=0;j<h;j++) {
			var border = (i == 0 || j == 0 || i+1 == w || j+1 == h);
			this._map[i].push(border ? 1 : 0);
		}
	}
	
	this._stack = [
		[1, 1, w-2, h-2]
	];
	this._process();
	
	for (var i=0;i<w;i++) {
		for (var j=0;j<h;j++) {
			callback(i, j, this._map[i][j]);
		}
	}
	this._map = null;
	return this;
};

ROT.Map.DividedMaze.prototype._process = function() {
	while (this._stack.length) {
		var room = this._stack.shift(); /* [left, top, right, bottom] */
		this._partitionRoom(room);
	}
};

ROT.Map.DividedMaze.prototype._partitionRoom = function(room) {
	var availX = [];
	var availY = [];
	
	for (var i=room[0]+1;i<room[2];i++) {
		var top = this._map[i][room[1]-1];
		var bottom = this._map[i][room[3]+1];
		if (top && bottom && !(i % 2)) { availX.push(i); }
	}
	
	for (var j=room[1]+1;j<room[3];j++) {
		var left = this._map[room[0]-1][j];
		var right = this._map[room[2]+1][j];
		if (left && right && !(j % 2)) { availY.push(j); }
	}

	if (!availX.length || !availY.length) { return; }

	var x = availX.random();
	var y = availY.random();
	
	this._map[x][y] = 1;
	
	var walls = [];
	
	var w = []; walls.push(w); /* left part */
	for (var i=room[0]; i<x; i++) { 
		this._map[i][y] = 1;
		w.push([i, y]); 
	}
	
	var w = []; walls.push(w); /* right part */
	for (var i=x+1; i<=room[2]; i++) { 
		this._map[i][y] = 1;
		w.push([i, y]); 
	}

	var w = []; walls.push(w); /* top part */
	for (var j=room[1]; j<y; j++) { 
		this._map[x][j] = 1;
		w.push([x, j]); 
	}
	
	var w = []; walls.push(w); /* bottom part */
	for (var j=y+1; j<=room[3]; j++) { 
		this._map[x][j] = 1;
		w.push([x, j]); 
	}
		
	var solid = walls.random();
	for (var i=0;i<walls.length;i++) {
		var w = walls[i];
		if (w == solid) { continue; }
		
		var hole = w.random();
		this._map[hole[0]][hole[1]] = 0;
	}

	this._stack.push([room[0], room[1], x-1, y-1]); /* left top */
	this._stack.push([x+1, room[1], room[2], y-1]); /* right top */
	this._stack.push([room[0], y+1, x-1, room[3]]); /* left bottom */
	this._stack.push([x+1, y+1, room[2], room[3]]); /* right bottom */
};
/**
 * @class Icey's Maze generator
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
 * @augments ROT.Map
 */
ROT.Map.IceyMaze = function(width, height, regularity) {
	ROT.Map.call(this, width, height);
	this._regularity = regularity || 0;
};
ROT.Map.IceyMaze.extend(ROT.Map);

ROT.Map.IceyMaze.prototype.create = function(callback) {
	var width = this._width;
	var height = this._height;
	
	var map = this._fillMap(1);
	
	width -= (width % 2 ? 1 : 2);
	height -= (height % 2 ? 1 : 2);

	var cx = 0;
	var cy = 0;
	var nx = 0;
	var ny = 0;

	var done = 0;
	var blocked = false;
	var dirs = [
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0]
	];
	do {
		cx = 1 + 2*Math.floor(ROT.RNG.getUniform()*(width-1) / 2);
		cy = 1 + 2*Math.floor(ROT.RNG.getUniform()*(height-1) / 2);

		if (!done) { map[cx][cy] = 0; }
		
		if (!map[cx][cy]) {
			this._randomize(dirs);
			do {
				if (Math.floor(ROT.RNG.getUniform()*(this._regularity+1)) == 0) { this._randomize(dirs); }
				blocked = true;
				for (var i=0;i<4;i++) {
					nx = cx + dirs[i][0]*2;
					ny = cy + dirs[i][1]*2;
					if (this._isFree(map, nx, ny, width, height)) {
						map[nx][ny] = 0;
						map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
						
						cx = nx;
						cy = ny;
						blocked = false;
						done++;
						break;
					}
				}
			} while (!blocked);
		}
	} while (done+1 < width*height/4);
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			callback(i, j, map[i][j]);
		}
	}
	this._map = null;
	return this;
};

ROT.Map.IceyMaze.prototype._randomize = function(dirs) {
	for (var i=0;i<4;i++) {
		dirs[i][0] = 0;
		dirs[i][1] = 0;
	}
	
	switch (Math.floor(ROT.RNG.getUniform()*4)) {
		case 0:
			dirs[0][0] = -1; dirs[1][0] = 1;
			dirs[2][1] = -1; dirs[3][1] = 1;
		break;
		case 1:
			dirs[3][0] = -1; dirs[2][0] = 1;
			dirs[1][1] = -1; dirs[0][1] = 1;
		break;
		case 2:
			dirs[2][0] = -1; dirs[3][0] = 1;
			dirs[0][1] = -1; dirs[1][1] = 1;
		break;
		case 3:
			dirs[1][0] = -1; dirs[0][0] = 1;
			dirs[3][1] = -1; dirs[2][1] = 1;
		break;
	}
};

ROT.Map.IceyMaze.prototype._isFree = function(map, x, y, width, height) {
	if (x < 1 || y < 1 || x >= width || y >= height) { return false; }
	return map[x][y];
};
/**
 * @class Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 * @augments ROT.Map
 */
ROT.Map.EllerMaze = function(width, height) {
	ROT.Map.call(this, width, height);
};
ROT.Map.EllerMaze.extend(ROT.Map);

ROT.Map.EllerMaze.prototype.create = function(callback) {
	var map = this._fillMap(1);
	var w = Math.ceil((this._width-2)/2);
	
	var rand = 9/24;
	
	var L = [];
	var R = [];
	
	for (var i=0;i<w;i++) {
		L.push(i);
		R.push(i);
	}
	L.push(w-1); /* fake stop-block at the right side */

	for (var j=1;j+3<this._height;j+=2) {
		/* one row */
		for (var i=0;i<w;i++) {
			/* cell coords (will be always empty) */
			var x = 2*i+1;
			var y = j;
			map[x][y] = 0;
			
			/* right connection */
			if (i != L[i+1] && ROT.RNG.getUniform() > rand) {
				this._addToList(i, L, R);
				map[x+1][y] = 0;
			}
			
			/* bottom connection */
			if (i != L[i] && ROT.RNG.getUniform() > rand) {
				/* remove connection */
				this._removeFromList(i, L, R);
			} else {
				/* create connection */
				map[x][y+1] = 0;
			}
		}
	}

	/* last row */
	for (var i=0;i<w;i++) {
		/* cell coords (will be always empty) */
		var x = 2*i+1;
		var y = j;
		map[x][y] = 0;
		
		/* right connection */
		if (i != L[i+1] && (i == L[i] || ROT.RNG.getUniform() > rand)) {
			/* dig right also if the cell is separated, so it gets connected to the rest of maze */
			this._addToList(i, L, R);
			map[x+1][y] = 0;
		}
		
		this._removeFromList(i, L, R);
	}
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			callback(i, j, map[i][j]);
		}
	}
	
	return this;
};

/**
 * Remove "i" from its list
 */
ROT.Map.EllerMaze.prototype._removeFromList = function(i, L, R) {
	R[L[i]] = R[i];
	L[R[i]] = L[i];
	R[i] = i;
	L[i] = i;
};

/**
 * Join lists with "i" and "i+1"
 */
ROT.Map.EllerMaze.prototype._addToList = function(i, L, R) {
	R[L[i+1]] = R[i];
	L[R[i]] = L[i+1];
	R[i] = i+1;
	L[i+1] = i;
};
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
ROT.Map.Cellular = function(width, height, options) {
	ROT.Map.call(this, width, height);
	this._options = {
		born: [5, 6, 7, 8],
		survive: [4, 5, 6, 7, 8],
		topology: 8
	};
	this.setOptions(options);

	this._dirs = ROT.DIRS[this._options.topology];
	this._map = this._fillMap(0);
};
ROT.Map.Cellular.extend(ROT.Map);

/**
 * Fill the map with random values
 * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
 */
ROT.Map.Cellular.prototype.randomize = function(probability) {
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			this._map[i][j] = (ROT.RNG.getUniform() < probability ? 1 : 0);
		}
	}
	return this;
};

/**
 * Change options.
 * @see ROT.Map.Cellular
 */
ROT.Map.Cellular.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
};

ROT.Map.Cellular.prototype.set = function(x, y, value) {
	this._map[x][y] = value;
};

ROT.Map.Cellular.prototype.create = function(callback) {
	var newMap = this._fillMap(0);
	var born = this._options.born;
	var survive = this._options.survive;


	for (var j=0;j<this._height;j++) {
		var widthStep = 1;
		var widthStart = 0;
		if (this._options.topology == 6) {
			widthStep = 2;
			widthStart = j%2;
		}

		for (var i=widthStart; i<this._width; i+=widthStep) {
			var cur = this._map[i][j];
			var ncount = this._getNeighbors(i, j);

			if (cur && survive.indexOf(ncount) != -1) { /* survive */
				newMap[i][j] = 1;
			} else if (!cur && born.indexOf(ncount) != -1) { /* born */
				newMap[i][j] = 1;
			}
		}
	}

	this._map = newMap;
	callback && this._serviceCallback(callback);
};

ROT.Map.Cellular.prototype._serviceCallback = function(callback) {
	for (var j=0;j<this._height;j++) {
		var widthStep = 1;
		var widthStart = 0;
		if (this._options.topology == 6) {
			widthStep = 2;
			widthStart = j%2;
		}
		for (var i=widthStart; i<this._width; i+=widthStep) {
			callback(i, j, this._map[i][j]);
		}
	}
};

/**
 * Get neighbor count at [i,j] in this._map
 */
ROT.Map.Cellular.prototype._getNeighbors = function(cx, cy) {
	var result = 0;
	for (var i=0;i<this._dirs.length;i++) {
		var dir = this._dirs[i];
		var x = cx + dir[0];
		var y = cy + dir[1];

		if (x < 0 || x >= this._width || y < 0 || y >= this._height) { continue; }
		result += (this._map[x][y] == 1 ? 1 : 0);
	}

	return result;
};

/**
 * Make sure every non-wall space is accessible.
 * @param {function} callback to call to display map when do
 * @param {int} value to consider empty space - defaults to 0
 * @param {function} callback to call when a new connection is made
 */
ROT.Map.Cellular.prototype.connect = function(callback, value, connectionCallback) {
	if (!value) value = 0;

	var allFreeSpace = [];
	var notConnected = {};

	// find all free space
	var widthStep = 1;
	var widthStarts = [0, 0];
	if (this._options.topology == 6) {
		widthStep = 2;
		widthStarts = [0, 1];
	}
	for (var y = 0; y < this._height; y++) {
		for (var x = widthStarts[y % 2]; x < this._width; x += widthStep) {
			if (this._freeSpace(x, y, value)) {
				var p = [x, y];
				notConnected[this._pointKey(p)] = p;
				allFreeSpace.push([x, y]);
			}
		}
	}
	var start = allFreeSpace[ROT.RNG.getUniformInt(0, allFreeSpace.length - 1)];

	var key = this._pointKey(start);
	var connected = {};
	connected[key] = start;
	delete notConnected[key];

	// find what's connected to the starting point
	this._findConnected(connected, notConnected, [start], false, value);

	while (Object.keys(notConnected).length > 0) {
		// find two points from notConnected to connected
		var p = this._getFromTo(connected, notConnected);
		var from = p[0]; // notConnected
		var to = p[1]; // connected

		// find everything connected to the starting point
		var local = {};
		local[this._pointKey(from)] = from;
		this._findConnected(local, notConnected, [from], true, value);

		// connect to a connected cell
		var tunnelFn = (this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected);
		tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);

		// now all of local is connected
		for (var k in local) {
			var pp = local[k];
			this._map[pp[0]][pp[1]] = value;
			connected[k] = pp;
			delete notConnected[k];
		}
	}

	callback && this._serviceCallback(callback);
};

/**
 * Find random points to connect. Search for the closest point in the larger space.
 * This is to minimize the length of the passage while maintaining good performance.
 */
ROT.Map.Cellular.prototype._getFromTo = function(connected, notConnected) {
	var from, to, d;
	var connectedKeys = Object.keys(connected);
	var notConnectedKeys = Object.keys(notConnected);
	for (var i = 0; i < 5; i++) {
		if (connectedKeys.length < notConnectedKeys.length) {
			var keys = connectedKeys;
			to = connected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]];
			from = this._getClosest(to, notConnected);
		} else {
			var keys = notConnectedKeys;
			from = notConnected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]];
			to = this._getClosest(from, connected);
		}
		d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
		if (d < 64) {
			break;
		}
	}
	// console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
	return [from, to];
};

ROT.Map.Cellular.prototype._getClosest = function(point, space) {
	var minPoint = null;
	var minDist = null;
	for (k in space) {
		var p = space[k];
		var d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
		if (minDist == null || d < minDist) {
			minDist = d;
			minPoint = p;
		}
	}
	return minPoint;
};

ROT.Map.Cellular.prototype._findConnected = function(connected, notConnected, stack, keepNotConnected, value) {
	while(stack.length > 0) {
		var p = stack.splice(0, 1)[0];
		var tests;

		if (this._options.topology == 6) {
			tests = [
				[p[0] + 2, p[1]],
				[p[0] + 1, p[1] - 1],
				[p[0] - 1, p[1] - 1],
				[p[0] - 2, p[1]],
				[p[0] - 1, p[1] + 1],
				[p[0] + 1, p[1] + 1],
			];
		} else {
			tests = [
				[p[0] + 1, p[1]],
				[p[0] - 1, p[1]],
				[p[0],     p[1] + 1],
				[p[0],     p[1] - 1]
			];
		}

		for (var i = 0; i < tests.length; i++) {
			var key = this._pointKey(tests[i]);
			if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
				connected[key] = tests[i];
				if (!keepNotConnected) {
					delete notConnected[key];
				}
				stack.push(tests[i]);
			}
		}
	}
};

ROT.Map.Cellular.prototype._tunnelToConnected = function(to, from, connected, notConnected, value, connectionCallback) {
	var key = this._pointKey(from);
	var a, b;
	if (from[0] < to[0]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}
	for (var xx = a[0]; xx <= b[0]; xx++) {
		this._map[xx][a[1]] = value;
		var p = [xx, a[1]];
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}
	if (connectionCallback && a[0] < b[0]) {
		connectionCallback(a, [b[0], a[1]]);
	}

	// x is now fixed
	var x = b[0];

	if (from[1] < to[1]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}
	for (var yy = a[1]; yy < b[1]; yy++) {
		this._map[x][yy] = value;
		var p = [x, yy];
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}
	if (connectionCallback && a[1] < b[1]) { connectionCallback([b[0], a[1]], [b[0], b[1]]); }
}

ROT.Map.Cellular.prototype._tunnelToConnected6 = function(to, from, connected, notConnected, value, connectionCallback) {
	var a, b;
	if (from[0] < to[0]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}

	// tunnel diagonally until horizontally level
	var xx = a[0];
	var yy = a[1];
	while (!(xx == b[0] && yy == b[1])) {
		var stepWidth = 2;
		if (yy < b[1]) {
			yy++;
			stepWidth = 1;
		} else if (yy > b[1]) {
			yy--;
			stepWidth = 1;
		}
		if (xx < b[0]) {
			xx += stepWidth
		} else if (xx > b[0]) {
			xx -= stepWidth
		} else if (b[1] % 2) {
			// Won't step outside map if destination on is map's right edge
			xx -= stepWidth;
		} else {
			// ditto for left edge
			xx += stepWidth;
		}
		this._map[xx][yy] = value;
		var p = [xx, yy]
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}

	if (connectionCallback) { connectionCallback(from, to); }
}

ROT.Map.Cellular.prototype._freeSpace = function(x, y, value) {
	return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
}

ROT.Map.Cellular.prototype._pointKey = function(p) {
	return p[0] + "." + p[1];
}
/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
ROT.Map.Dungeon = function(width, height) {
	ROT.Map.call(this, width, height);
	this._rooms = []; /* list of all rooms */
	this._corridors = [];
};
ROT.Map.Dungeon.extend(ROT.Map);

/**
 * Get all generated rooms
 * @returns {ROT.Map.Feature.Room[]}
 */
ROT.Map.Dungeon.prototype.getRooms = function() {
	return this._rooms;
};

/**
 * Get all generated corridors
 * @returns {ROT.Map.Feature.Corridor[]}
 */
ROT.Map.Dungeon.prototype.getCorridors = function() {
	return this._corridors;
};
/**
 * @class Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at 
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 * @augments ROT.Map.Dungeon
 */
ROT.Map.Digger = function(width, height, options) {
	ROT.Map.Dungeon.call(this, width, height);
	
	this._options = {
		roomWidth: [3, 9], /* room minimum and maximum width */
		roomHeight: [3, 5], /* room minimum and maximum height */
		corridorLength: [3, 10], /* corridor minimum and maximum length */
		dugPercentage: 0.2, /* we stop after this percentage of level area has been dug out */
		timeLimit: 1000 /* we stop after this much time has passed (msec) */
	};
	for (var p in options) { this._options[p] = options[p]; }
	
	this._features = {
		"Room": 4,
		"Corridor": 4
	};
	this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
	this._walls = {}; /* these are available for digging */
	
	this._digCallback = this._digCallback.bind(this);
	this._canBeDugCallback = this._canBeDugCallback.bind(this);
	this._isWallCallback = this._isWallCallback.bind(this);
	this._priorityWallCallback = this._priorityWallCallback.bind(this);
};
ROT.Map.Digger.extend(ROT.Map.Dungeon);

/**
 * Create a map
 * @see ROT.Map#create
 */
ROT.Map.Digger.prototype.create = function(callback) {
	this._rooms = [];
	this._corridors = [];
	this._map = this._fillMap(1);
	this._walls = {};
	this._dug = 0;
	var area = (this._width-2) * (this._height-2);

	this._firstRoom();
	
	var t1 = Date.now();

	do {
		var t2 = Date.now();
		if (t2 - t1 > this._options.timeLimit) { break; }

		/* find a good wall */
		var wall = this._findWall();
		if (!wall) { break; } /* no more walls */
		
		var parts = wall.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		var dir = this._getDiggingDirection(x, y);
		if (!dir) { continue; } /* this wall is not suitable */
		
//		console.log("wall", x, y);

		/* try adding a feature */
		var featureAttempts = 0;
		do {
			featureAttempts++;
			if (this._tryFeature(x, y, dir[0], dir[1])) { /* feature added */
				//if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
				this._removeSurroundingWalls(x, y);
				this._removeSurroundingWalls(x-dir[0], y-dir[1]);
				break; 
			}
		} while (featureAttempts < this._featureAttempts);
		
		var priorityWalls = 0;
		for (var id in this._walls) { 
			if (this._walls[id] > 1) { priorityWalls++; }
		}

	} while (this._dug/area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */

	this._addDoors();

	if (callback) {
		for (var i=0;i<this._width;i++) {
			for (var j=0;j<this._height;j++) {
				callback(i, j, this._map[i][j]);
			}
		}
	}
	
	this._walls = {};
	this._map = null;

	return this;
};

ROT.Map.Digger.prototype._digCallback = function(x, y, value) {
	if (value == 0 || value == 2) { /* empty */
		this._map[x][y] = 0;
		this._dug++;
	} else { /* wall */
		this._walls[x+","+y] = 1;
	}
};

ROT.Map.Digger.prototype._isWallCallback = function(x, y) {
	if (x < 0 || y < 0 || x >= this._width || y >= this._height) { return false; }
	return (this._map[x][y] == 1);
};

ROT.Map.Digger.prototype._canBeDugCallback = function(x, y) {
	if (x < 1 || y < 1 || x+1 >= this._width || y+1 >= this._height) { return false; }
	return (this._map[x][y] == 1);
};

ROT.Map.Digger.prototype._priorityWallCallback = function(x, y) {
	this._walls[x+","+y] = 2;
};

ROT.Map.Digger.prototype._firstRoom = function() {
	var cx = Math.floor(this._width/2);
	var cy = Math.floor(this._height/2);
	var room = ROT.Map.Feature.Room.createRandomCenter(cx, cy, this._options);
	this._rooms.push(room);
	room.create(this._digCallback);
};

/**
 * Get a suitable wall
 */
ROT.Map.Digger.prototype._findWall = function() {
	var prio1 = [];
	var prio2 = [];
	for (var id in this._walls) {
		var prio = this._walls[id];
		if (prio == 2) { 
			prio2.push(id); 
		} else {
			prio1.push(id);
		}
	}
	
	var arr = (prio2.length ? prio2 : prio1);
	if (!arr.length) { return null; } /* no walls :/ */
	
	var id = arr.sort().random(); // sort to make the order deterministic
	delete this._walls[id];

	return id;
};

/**
 * Tries adding a feature
 * @returns {bool} was this a successful try?
 */
ROT.Map.Digger.prototype._tryFeature = function(x, y, dx, dy) {
	var feature = ROT.RNG.getWeightedValue(this._features);
	feature = ROT.Map.Feature[feature].createRandomAt(x, y, dx, dy, this._options);
	
	if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
//		console.log("not valid");
//		feature.debug();
		return false;
	}
	
	feature.create(this._digCallback);
//	feature.debug();

	if (feature instanceof ROT.Map.Feature.Room) { this._rooms.push(feature); }
	if (feature instanceof ROT.Map.Feature.Corridor) { 
		feature.createPriorityWalls(this._priorityWallCallback);
		this._corridors.push(feature); 
	}
	
	return true;
};

ROT.Map.Digger.prototype._removeSurroundingWalls = function(cx, cy) {
	var deltas = ROT.DIRS[4];

	for (var i=0;i<deltas.length;i++) {
		var delta = deltas[i];
		var x = cx + delta[0];
		var y = cy + delta[1];
		delete this._walls[x+","+y];
		var x = cx + 2*delta[0];
		var y = cy + 2*delta[1];
		delete this._walls[x+","+y];
	}
};

/**
 * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
 */
ROT.Map.Digger.prototype._getDiggingDirection = function(cx, cy) {
	if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) { return null; }

	var result = null;
	var deltas = ROT.DIRS[4];
	
	for (var i=0;i<deltas.length;i++) {
		var delta = deltas[i];
		var x = cx + delta[0];
		var y = cy + delta[1];
		
		if (!this._map[x][y]) { /* there already is another empty neighbor! */
			if (result) { return null; }
			result = delta;
		}
	}
	
	/* no empty neighbor */
	if (!result) { return null; }
	
	return [-result[0], -result[1]];
};

/**
 * Find empty spaces surrounding rooms, and apply doors.
 */
ROT.Map.Digger.prototype._addDoors = function() {
	var data = this._map;
	var isWallCallback = function(x, y) {
		return (data[x][y] == 1);
	};
	for (var i = 0; i < this._rooms.length; i++ ) {
		var room = this._rooms[i];
		room.clearDoors();
		room.addDoors(isWallCallback);
	}
};
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
ROT.Map.Uniform = function(width, height, options) {
	ROT.Map.Dungeon.call(this, width, height);

	this._options = {
		roomWidth: [3, 9], /* room minimum and maximum width */
		roomHeight: [3, 5], /* room minimum and maximum height */
		roomDugPercentage: 0.1, /* we stop after this percentage of level area has been dug out by rooms */
		timeLimit: 1000 /* we stop after this much time has passed (msec) */
	};
	for (var p in options) { this._options[p] = options[p]; }

	this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
	this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */

	this._connected = []; /* list of already connected rooms */
	this._unconnected = []; /* list of remaining unconnected rooms */
	
	this._digCallback = this._digCallback.bind(this);
	this._canBeDugCallback = this._canBeDugCallback.bind(this);
	this._isWallCallback = this._isWallCallback.bind(this);
};
ROT.Map.Uniform.extend(ROT.Map.Dungeon);

/**
 * Create a map. If the time limit has been hit, returns null.
 * @see ROT.Map#create
 */
ROT.Map.Uniform.prototype.create = function(callback) {
	var t1 = Date.now();
	while (1) {
		var t2 = Date.now();
		if (t2 - t1 > this._options.timeLimit) { return null; } /* time limit! */
	
		this._map = this._fillMap(1);
		this._dug = 0;
		this._rooms = [];
		this._unconnected = [];
		this._generateRooms();
		if (this._rooms.length < 2) { continue; }
		if (this._generateCorridors()) { break; }
	}
	
	if (callback) {
		for (var i=0;i<this._width;i++) {
			for (var j=0;j<this._height;j++) {
				callback(i, j, this._map[i][j]);
			}
		}
	}
	
	return this;
};

/**
 * Generates a suitable amount of rooms
 */
ROT.Map.Uniform.prototype._generateRooms = function() {
	var w = this._width-2;
	var h = this._height-2;

	do {
		var room = this._generateRoom();
		if (this._dug/(w*h) > this._options.roomDugPercentage) { break; } /* achieved requested amount of free space */
	} while (room);

	/* either enough rooms, or not able to generate more of them :) */
};

/**
 * Try to generate one room
 */
ROT.Map.Uniform.prototype._generateRoom = function() {
	var count = 0;
	while (count < this._roomAttempts) {
		count++;
		
		var room = ROT.Map.Feature.Room.createRandom(this._width, this._height, this._options);
		if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) { continue; }
		
		room.create(this._digCallback);
		this._rooms.push(room);
		return room;
	} 

	/* no room was generated in a given number of attempts */
	return null;
};

/**
 * Generates connectors beween rooms
 * @returns {bool} success Was this attempt successfull?
 */
ROT.Map.Uniform.prototype._generateCorridors = function() {
	var cnt = 0;
	while (cnt < this._corridorAttempts) {
		cnt++;
		this._corridors = [];

		/* dig rooms into a clear map */
		this._map = this._fillMap(1);
		for (var i=0;i<this._rooms.length;i++) { 
			var room = this._rooms[i];
			room.clearDoors();
			room.create(this._digCallback); 
		}

		this._unconnected = this._rooms.slice().randomize();
		this._connected = [];
		if (this._unconnected.length) { this._connected.push(this._unconnected.pop()); } /* first one is always connected */
		
		while (1) {
			/* 1. pick random connected room */
			var connected = this._connected.random();
			
			/* 2. find closest unconnected */
			var room1 = this._closestRoom(this._unconnected, connected);
			
			/* 3. connect it to closest connected */
			var room2 = this._closestRoom(this._connected, room1);
			
			var ok = this._connectRooms(room1, room2);
			if (!ok) { break; } /* stop connecting, re-shuffle */
			
			if (!this._unconnected.length) { return true; } /* done; no rooms remain */
		}
	}
	return false;
};

/**
 * For a given room, find the closest one from the list
 */
ROT.Map.Uniform.prototype._closestRoom = function(rooms, room) {
	var dist = Infinity;
	var center = room.getCenter();
	var result = null;
	
	for (var i=0;i<rooms.length;i++) {
		var r = rooms[i];
		var c = r.getCenter();
		var dx = c[0]-center[0];
		var dy = c[1]-center[1];
		var d = dx*dx+dy*dy;
		
		if (d < dist) {
			dist = d;
			result = r;
		}
	}
	
	return result;
};

ROT.Map.Uniform.prototype._connectRooms = function(room1, room2) {
	/*
		room1.debug();
		room2.debug();
	*/

	var center1 = room1.getCenter();
	var center2 = room2.getCenter();

	var diffX = center2[0] - center1[0];
	var diffY = center2[1] - center1[1];

	if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
		var dirIndex1 = (diffY > 0 ? 2 : 0);
		var dirIndex2 = (dirIndex1 + 2) % 4;
		var min = room2.getLeft();
		var max = room2.getRight();
		var index = 0;
	} else { /* first try connecting east-west walls */
		var dirIndex1 = (diffX > 0 ? 1 : 3);
		var dirIndex2 = (dirIndex1 + 2) % 4;
		var min = room2.getTop();
		var max = room2.getBottom();
		var index = 1;
	}

	var start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
	if (!start) { return false; }

	if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
		var end = start.slice();
		var value = null;
		switch (dirIndex2) {
			case 0: value = room2.getTop()-1; break;
			case 1: value = room2.getRight()+1; break;
			case 2: value = room2.getBottom()+1; break;
			case 3: value = room2.getLeft()-1; break;
		}
		end[(index+1)%2] = value;
		this._digLine([start, end]);
		
	} else if (start[index] < min-1 || start[index] > max+1) { /* need to switch target wall (L-like) */

		var diff = start[index] - center2[index];
		switch (dirIndex2) {
			case 0:
			case 1:	var rotation = (diff < 0 ? 3 : 1); break;
			case 2:
			case 3:	var rotation = (diff < 0 ? 1 : 3); break;
		}
		dirIndex2 = (dirIndex2 + rotation) % 4;
		
		var end = this._placeInWall(room2, dirIndex2);
		if (!end) { return false; }

		var mid = [0, 0];
		mid[index] = start[index];
		var index2 = (index+1)%2;
		mid[index2] = end[index2];
		this._digLine([start, mid, end]);
		
	} else { /* use current wall pair, but adjust the line in the middle (S-like) */
	
		var index2 = (index+1)%2;
		var end = this._placeInWall(room2, dirIndex2);
		if (!end) { return false; }
		var mid = Math.round((end[index2] + start[index2])/2);

		var mid1 = [0, 0];
		var mid2 = [0, 0];
		mid1[index] = start[index];
		mid1[index2] = mid;
		mid2[index] = end[index];
		mid2[index2] = mid;
		this._digLine([start, mid1, mid2, end]);
	}

	room1.addDoor(start[0], start[1]);
	room2.addDoor(end[0], end[1]);
	
	var index = this._unconnected.indexOf(room1);
	if (index != -1) {
		this._unconnected.splice(index, 1);
		this._connected.push(room1);
	}

	var index = this._unconnected.indexOf(room2);
	if (index != -1) {
		this._unconnected.splice(index, 1);
		this._connected.push(room2);
	}
	
	return true;
};

ROT.Map.Uniform.prototype._placeInWall = function(room, dirIndex) {
	var start = [0, 0];
	var dir = [0, 0];
	var length = 0;
	
	switch (dirIndex) {
		case 0:
			dir = [1, 0];
			start = [room.getLeft(), room.getTop()-1];
			length = room.getRight()-room.getLeft()+1;
		break;
		case 1:
			dir = [0, 1];
			start = [room.getRight()+1, room.getTop()];
			length = room.getBottom()-room.getTop()+1;
		break;
		case 2:
			dir = [1, 0];
			start = [room.getLeft(), room.getBottom()+1];
			length = room.getRight()-room.getLeft()+1;
		break;
		case 3:
			dir = [0, 1];
			start = [room.getLeft()-1, room.getTop()];
			length = room.getBottom()-room.getTop()+1;
		break;
	}
	
	var avail = [];
	var lastBadIndex = -2;

	for (var i=0;i<length;i++) {
		var x = start[0] + i*dir[0];
		var y = start[1] + i*dir[1];
		avail.push(null);
		
		var isWall = (this._map[x][y] == 1);
		if (isWall) {
			if (lastBadIndex != i-1) { avail[i] = [x, y]; }
		} else {
			lastBadIndex = i;
			if (i) { avail[i-1] = null; }
		}
	}
	
	for (var i=avail.length-1; i>=0; i--) {
		if (!avail[i]) { avail.splice(i, 1); }
	}
	return (avail.length ? avail.random() : null);
};

/**
 * Dig a polyline.
 */
ROT.Map.Uniform.prototype._digLine = function(points) {
	for (var i=1;i<points.length;i++) {
		var start = points[i-1];
		var end = points[i];
		var corridor = new ROT.Map.Feature.Corridor(start[0], start[1], end[0], end[1]);
		corridor.create(this._digCallback);
		this._corridors.push(corridor);
	}
};

ROT.Map.Uniform.prototype._digCallback = function(x, y, value) {
	this._map[x][y] = value;
	if (value == 0) { this._dug++; }
};

ROT.Map.Uniform.prototype._isWallCallback = function(x, y) {
	if (x < 0 || y < 0 || x >= this._width || y >= this._height) { return false; }
	return (this._map[x][y] == 1);
};

ROT.Map.Uniform.prototype._canBeDugCallback = function(x, y) {
	if (x < 1 || y < 1 || x+1 >= this._width || y+1 >= this._height) { return false; }
	return (this._map[x][y] == 1);
};

/**
 * @author hyakugei
 * @class Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.cellWidth=3] Number of cells to create on the horizontal (number of rooms horizontally)
 * @param {int[]} [options.cellHeight=3] Number of cells to create on the vertical (number of rooms vertically)
 * @param {int} [options.roomWidth] Room min and max width - normally set auto-magically via the constructor.
 * @param {int} [options.roomHeight] Room min and max height - normally set auto-magically via the constructor.
 */
ROT.Map.Rogue = function (width, height, options) {
	ROT.Map.call(this, width, height);

	this._options = {
		cellWidth: 3,  // NOTE to self, these could probably work the same as the roomWidth/room Height values
		cellHeight: 3  //     ie. as an array with min-max values for each direction....
	};

	for (var p in options) { this._options[p] = options[p]; }

	/*
	Set the room sizes according to the over-all width of the map,
	and the cell sizes.
	*/
	if (!this._options.hasOwnProperty("roomWidth")) {
		this._options["roomWidth"] = this._calculateRoomSize(this._width, this._options["cellWidth"]);
	}
	if (!this._options.hasOwnProperty("roomHeight")) {
		this._options["roomHeight"] = this._calculateRoomSize(this._height, this._options["cellHeight"]);
	}

};

ROT.Map.Rogue.extend(ROT.Map);

/**
 * @see ROT.Map#create
 */
ROT.Map.Rogue.prototype.create = function (callback) {
	this.map = this._fillMap(1);
	this.rooms = [];
	this.connectedCells = [];

	this._initRooms();
	this._connectRooms();
	this._connectUnconnectedRooms();
	this._createRandomRoomConnections();
	this._createRooms();
	this._createCorridors();

	if (callback) {
		for (var i = 0; i < this._width; i++) {
			for (var j = 0; j < this._height; j++) {
				callback(i, j, this.map[i][j]);
			}
		}
	}

	return this;
};

ROT.Map.Rogue.prototype._calculateRoomSize = function (size, cell) {
	var max = Math.floor((size/cell) * 0.8);
	var min = Math.floor((size/cell) * 0.25);
	if (min < 2) { min = 2; }
	if (max < 2) { max = 2; }
	return [min, max];
};

ROT.Map.Rogue.prototype._initRooms = function () {
	// create rooms array. This is the "grid" list from the algo.
	for (var i = 0; i < this._options.cellWidth; i++) {
		this.rooms.push([]);
		for(var j = 0; j < this._options.cellHeight; j++) {
			this.rooms[i].push({"x":0, "y":0, "width":0, "height":0, "connections":[], "cellx":i, "celly":j});
		}
	}
};

ROT.Map.Rogue.prototype._connectRooms = function () {
	//pick random starting grid
	var cgx = ROT.RNG.getUniformInt(0, this._options.cellWidth-1);
	var cgy = ROT.RNG.getUniformInt(0, this._options.cellHeight-1);

	var idx;
	var ncgx;
	var ncgy;

	var found = false;
	var room;
	var otherRoom;

	// find  unconnected neighbour cells
	do {

		//var dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
		var dirToCheck = [0, 2, 4, 6];
		dirToCheck = dirToCheck.randomize();

		do {
			found = false;
			idx = dirToCheck.pop();

			ncgx = cgx + ROT.DIRS[8][idx][0];
			ncgy = cgy + ROT.DIRS[8][idx][1];

			if (ncgx < 0 || ncgx >= this._options.cellWidth) { continue; }
			if (ncgy < 0 || ncgy >= this._options.cellHeight) { continue; }

			room = this.rooms[cgx][cgy];

			if (room["connections"].length > 0) {
				// as long as this room doesn't already coonect to me, we are ok with it.
				if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
					break;
				}
			}

			otherRoom = this.rooms[ncgx][ncgy];

			if (otherRoom["connections"].length == 0) {
				otherRoom["connections"].push([cgx, cgy]);

				this.connectedCells.push([ncgx, ncgy]);
				cgx = ncgx;
				cgy = ncgy;
				found = true;
			}

		} while (dirToCheck.length > 0 && found == false);

	} while (dirToCheck.length > 0);

};

ROT.Map.Rogue.prototype._connectUnconnectedRooms = function () {
	//While there are unconnected rooms, try to connect them to a random connected neighbor
	//(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
	var cw = this._options.cellWidth;
	var ch = this._options.cellHeight;

	this.connectedCells = this.connectedCells.randomize();
	var room;
	var otherRoom;
	var validRoom;

	for (var i = 0; i < this._options.cellWidth; i++) {
		for (var j = 0; j < this._options.cellHeight; j++)  {

			room = this.rooms[i][j];

			if (room["connections"].length == 0) {
				var directions = [0, 2, 4, 6];
				directions = directions.randomize();

				validRoom = false;

				do {

					var dirIdx = directions.pop();
					var newI = i + ROT.DIRS[8][dirIdx][0];
					var newJ = j + ROT.DIRS[8][dirIdx][1];

					if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) { continue; }

					otherRoom = this.rooms[newI][newJ];

					validRoom = true;

					if (otherRoom["connections"].length == 0) { break; }

					for (var k = 0; k < otherRoom["connections"].length; k++) {
						if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
							validRoom = false;
							break;
						}
					}

					if (validRoom) { break; }

				} while (directions.length);

				if (validRoom) {
					room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
				} else {
					console.log("-- Unable to connect room.");
				}
			}
		}
	}
};

ROT.Map.Rogue.prototype._createRandomRoomConnections = function (connections) {
	// Empty for now.
};


ROT.Map.Rogue.prototype._createRooms = function () {
	// Create Rooms

	var w = this._width;
	var h = this._height;

	var cw = this._options.cellWidth;
	var ch = this._options.cellHeight;

	var cwp = Math.floor(this._width / cw);
	var chp = Math.floor(this._height / ch);

	var roomw;
	var roomh;
	var roomWidth = this._options["roomWidth"];
	var roomHeight = this._options["roomHeight"];
	var sx;
	var sy;
	var otherRoom;

	for (var i = 0; i < cw; i++) {
		for (var j = 0; j < ch; j++) {
			sx = cwp * i;
			sy = chp * j;

			if (sx == 0) { sx = 1; }
			if (sy == 0) { sy = 1; }

			roomw = ROT.RNG.getUniformInt(roomWidth[0], roomWidth[1]);
			roomh = ROT.RNG.getUniformInt(roomHeight[0], roomHeight[1]);

			if (j > 0) {
				otherRoom = this.rooms[i][j-1];
				while (sy - (otherRoom["y"] + otherRoom["height"] ) < 3) {
					sy++;
				}
			}

			if (i > 0) {
				otherRoom = this.rooms[i-1][j];
				while(sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
					sx++;
				}
			}

			var sxOffset = Math.round(ROT.RNG.getUniformInt(0, cwp-roomw)/2);
			var syOffset = Math.round(ROT.RNG.getUniformInt(0, chp-roomh)/2);

			while (sx + sxOffset + roomw >= w) {
				if(sxOffset) {
					sxOffset--;
				} else {
					roomw--;
				}
			}

			while (sy + syOffset + roomh >= h) {
				if(syOffset) {
					syOffset--;
				} else {
					roomh--;
				}
			}

			sx = sx + sxOffset;
			sy = sy + syOffset;

			this.rooms[i][j]["x"] = sx;
			this.rooms[i][j]["y"] = sy;
			this.rooms[i][j]["width"] = roomw;
			this.rooms[i][j]["height"] = roomh;

			for (var ii = sx; ii < sx + roomw; ii++) {
				for (var jj = sy; jj < sy + roomh; jj++) {
					this.map[ii][jj] = 0;
				}
			}
		}
	}
};

ROT.Map.Rogue.prototype._getWallPosition = function (aRoom, aDirection) {
	var rx;
	var ry;
	var door;

	if (aDirection == 1 || aDirection == 3) {
		rx = ROT.RNG.getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
		if (aDirection == 1) {
			ry = aRoom["y"] - 2;
			door = ry + 1;
		} else {
			ry = aRoom["y"] + aRoom["height"] + 1;
			door = ry -1;
		}

		this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.

	} else if (aDirection == 2 || aDirection == 4) {
		ry = ROT.RNG.getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
		if(aDirection == 2) {
			rx = aRoom["x"] + aRoom["width"] + 1;
			door = rx - 1;
		} else {
			rx = aRoom["x"] - 2;
			door = rx + 1;
		}

		this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.

	}
	return [rx, ry];
};

/***
* @param startPosition a 2 element array
* @param endPosition a 2 element array
*/
ROT.Map.Rogue.prototype._drawCorridor = function (startPosition, endPosition) {
	var xOffset = endPosition[0] - startPosition[0];
	var yOffset = endPosition[1] - startPosition[1];

	var xpos = startPosition[0];
	var ypos = startPosition[1];

	var tempDist;
	var xDir;
	var yDir;

	var move; // 2 element array, element 0 is the direction, element 1 is the total value to move.
	var moves = []; // a list of 2 element arrays

	var xAbs = Math.abs(xOffset);
	var yAbs = Math.abs(yOffset);

	var percent = ROT.RNG.getUniform(); // used to split the move at different places along the long axis
	var firstHalf = percent;
	var secondHalf = 1 - percent;

	xDir = xOffset > 0 ? 2 : 6;
	yDir = yOffset > 0 ? 4 : 0;

	if (xAbs < yAbs) {
		// move firstHalf of the y offset
		tempDist = Math.ceil(yAbs * firstHalf);
		moves.push([yDir, tempDist]);
		// move all the x offset
		moves.push([xDir, xAbs]);
		// move sendHalf of the  y offset
		tempDist = Math.floor(yAbs * secondHalf);
		moves.push([yDir, tempDist]);
	} else {
		//  move firstHalf of the x offset
		tempDist = Math.ceil(xAbs * firstHalf);
		moves.push([xDir, tempDist]);
		// move all the y offset
		moves.push([yDir, yAbs]);
		// move secondHalf of the x offset.
		tempDist = Math.floor(xAbs * secondHalf);
		moves.push([xDir, tempDist]);
	}

	this.map[xpos][ypos] = 0;

	while (moves.length > 0) {
		move = moves.pop();
		while (move[1] > 0) {
			xpos += ROT.DIRS[8][move[0]][0];
			ypos += ROT.DIRS[8][move[0]][1];
			this.map[xpos][ypos] = 0;
			move[1] = move[1] - 1;
		}
	}
};

ROT.Map.Rogue.prototype._createCorridors = function () {
	// Draw Corridors between connected rooms

	var cw = this._options.cellWidth;
	var ch = this._options.cellHeight;
	var room;
	var connection;
	var otherRoom;
	var wall;
	var otherWall;

	for (var i = 0; i < cw; i++) {
		for (var j = 0; j < ch; j++) {
			room = this.rooms[i][j];

			for (var k = 0; k < room["connections"].length; k++) {

				connection = room["connections"][k];

				otherRoom = this.rooms[connection[0]][connection[1]];

				// figure out what wall our corridor will start one.
				// figure out what wall our corridor will end on.
				if (otherRoom["cellx"] > room["cellx"]) {
					wall = 2;
					otherWall = 4;
				} else if (otherRoom["cellx"] < room["cellx"]) {
					wall = 4;
					otherWall = 2;
				} else if(otherRoom["celly"] > room["celly"]) {
					wall = 3;
					otherWall = 1;
				} else if(otherRoom["celly"] < room["celly"]) {
					wall = 1;
					otherWall = 3;
				}

				this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
			}
		}
	}
};
/**
 * @class Dungeon feature; has own .create() method
 */
ROT.Map.Feature = function() {};
ROT.Map.Feature.prototype.isValid = function(canBeDugCallback) {};
ROT.Map.Feature.prototype.create = function(digCallback) {};
ROT.Map.Feature.prototype.debug = function() {};
ROT.Map.Feature.createRandomAt = function(x, y, dx, dy, options) {};

/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
ROT.Map.Feature.Room = function(x1, y1, x2, y2, doorX, doorY) {
	this._x1 = x1;
	this._y1 = y1;
	this._x2 = x2;
	this._y2 = y2;
	this._doors = {};
	if (arguments.length > 4) { this.addDoor(doorX, doorY); }
};
ROT.Map.Feature.Room.extend(ROT.Map.Feature);

/**
 * Room of random size, with a given doors and direction
 */
ROT.Map.Feature.Room.createRandomAt = function(x, y, dx, dy, options) {
	var min = options.roomWidth[0];
	var max = options.roomWidth[1];
	var width = ROT.RNG.getUniformInt(min, max);
	
	var min = options.roomHeight[0];
	var max = options.roomHeight[1];
	var height = ROT.RNG.getUniformInt(min, max);
	
	if (dx == 1) { /* to the right */
		var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
		return new this(x+1, y2, x+width, y2+height-1, x, y);
	}
	
	if (dx == -1) { /* to the left */
		var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
		return new this(x-width, y2, x-1, y2+height-1, x, y);
	}

	if (dy == 1) { /* to the bottom */
		var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
		return new this(x2, y+1, x2+width-1, y+height, x, y);
	}

	if (dy == -1) { /* to the top */
		var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
		return new this(x2, y-height, x2+width-1, y-1, x, y);
	}

        throw new Error("dx or dy must be 1 or -1");
};

/**
 * Room of random size, positioned around center coords
 */
ROT.Map.Feature.Room.createRandomCenter = function(cx, cy, options) {
	var min = options.roomWidth[0];
	var max = options.roomWidth[1];
	var width = ROT.RNG.getUniformInt(min, max);
	
	var min = options.roomHeight[0];
	var max = options.roomHeight[1];
	var height = ROT.RNG.getUniformInt(min, max);

	var x1 = cx - Math.floor(ROT.RNG.getUniform()*width);
	var y1 = cy - Math.floor(ROT.RNG.getUniform()*height);
	var x2 = x1 + width - 1;
	var y2 = y1 + height - 1;

	return new this(x1, y1, x2, y2);
};

/**
 * Room of random size within a given dimensions
 */
ROT.Map.Feature.Room.createRandom = function(availWidth, availHeight, options) {
	var min = options.roomWidth[0];
	var max = options.roomWidth[1];
	var width = ROT.RNG.getUniformInt(min, max);
	
	var min = options.roomHeight[0];
	var max = options.roomHeight[1];
	var height = ROT.RNG.getUniformInt(min, max);
	
	var left = availWidth - width - 1;
	var top = availHeight - height - 1;

	var x1 = 1 + Math.floor(ROT.RNG.getUniform()*left);
	var y1 = 1 + Math.floor(ROT.RNG.getUniform()*top);
	var x2 = x1 + width - 1;
	var y2 = y1 + height - 1;

	return new this(x1, y1, x2, y2);
};

ROT.Map.Feature.Room.prototype.addDoor = function(x, y) {
	this._doors[x+","+y] = 1;
	return this;
};

/**
 * @param {function}
 */
ROT.Map.Feature.Room.prototype.getDoors = function(callback) {
	for (var key in this._doors) {
		var parts = key.split(",");
		callback(parseInt(parts[0]), parseInt(parts[1]));
	}
	return this;
};

ROT.Map.Feature.Room.prototype.clearDoors = function() {
	this._doors = {};
	return this;
};

ROT.Map.Feature.Room.prototype.addDoors = function(isWallCallback) {
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;

	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (x != left && x != right && y != top && y != bottom) { continue; }
			if (isWallCallback(x, y)) { continue; }

			this.addDoor(x, y);
		}
	}

	return this;
};

ROT.Map.Feature.Room.prototype.debug = function() {
	console.log("room", this._x1, this._y1, this._x2, this._y2);
};

ROT.Map.Feature.Room.prototype.isValid = function(isWallCallback, canBeDugCallback) { 
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;
	
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (x == left || x == right || y == top || y == bottom) {
				if (!isWallCallback(x, y)) { return false; }
			} else {
				if (!canBeDugCallback(x, y)) { return false; }
			}
		}
	}

	return true;
};

/**
 * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
 */
ROT.Map.Feature.Room.prototype.create = function(digCallback) { 
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;
	
	var value = 0;
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (x+","+y in this._doors) {
				value = 2;
			} else if (x == left || x == right || y == top || y == bottom) {
				value = 1;
			} else {
				value = 0;
			}
			digCallback(x, y, value);
		}
	}
};

ROT.Map.Feature.Room.prototype.getCenter = function() {
	return [Math.round((this._x1 + this._x2)/2), Math.round((this._y1 + this._y2)/2)];
};

ROT.Map.Feature.Room.prototype.getLeft = function() {
	return this._x1;
};

ROT.Map.Feature.Room.prototype.getRight = function() {
	return this._x2;
};

ROT.Map.Feature.Room.prototype.getTop = function() {
	return this._y1;
};

ROT.Map.Feature.Room.prototype.getBottom = function() {
	return this._y2;
};

/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
ROT.Map.Feature.Corridor = function(startX, startY, endX, endY) {
	this._startX = startX;
	this._startY = startY;
	this._endX = endX; 
	this._endY = endY;
	this._endsWithAWall = true;
};
ROT.Map.Feature.Corridor.extend(ROT.Map.Feature);

ROT.Map.Feature.Corridor.createRandomAt = function(x, y, dx, dy, options) {
	var min = options.corridorLength[0];
	var max = options.corridorLength[1];
	var length = ROT.RNG.getUniformInt(min, max);
	
	return new this(x, y, x + dx*length, y + dy*length);
};

ROT.Map.Feature.Corridor.prototype.debug = function() {
	console.log("corridor", this._startX, this._startY, this._endX, this._endY);
};

ROT.Map.Feature.Corridor.prototype.isValid = function(isWallCallback, canBeDugCallback){ 
	var sx = this._startX;
	var sy = this._startY;
	var dx = this._endX-sx;
	var dy = this._endY-sy;
	var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
	
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;
	
	var ok = true;
	for (var i=0; i<length; i++) {
		var x = sx + i*dx;
		var y = sy + i*dy;

		if (!canBeDugCallback(     x,      y)) { ok = false; }
		if (!isWallCallback  (x + nx, y + ny)) { ok = false; }
		if (!isWallCallback  (x - nx, y - ny)) { ok = false; }
		
		if (!ok) {
			length = i;
			this._endX = x-dx;
			this._endY = y-dy;
			break;
		}
	}
	
	/**
	 * If the length degenerated, this corridor might be invalid
	 */
	 
	/* not supported */
	if (length == 0) { return false; } 
	
	 /* length 1 allowed only if the next space is empty */
	if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) { return false; }
	
	/**
	 * We do not want the corridor to crash into a corner of a room;
	 * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
	 * 
	 * Situation:
	 * #######1
	 * .......?
	 * #######2
	 * 
	 * The corridor was dug from left to right.
	 * 1, 2 - problematic corners, ? = N+1th cell (not dug)
	 */
	var firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
	var secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
	this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
	if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) { return false; }

	return true;
};

/**
 * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
 */
ROT.Map.Feature.Corridor.prototype.create = function(digCallback) { 
	var sx = this._startX;
	var sy = this._startY;
	var dx = this._endX-sx;
	var dy = this._endY-sy;
	var length = 1+Math.max(Math.abs(dx), Math.abs(dy));
	
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;
	
	for (var i=0; i<length; i++) {
		var x = sx + i*dx;
		var y = sy + i*dy;
		digCallback(x, y, 0);
	}
	
	return true;
};

ROT.Map.Feature.Corridor.prototype.createPriorityWalls = function(priorityWallCallback) {
	if (!this._endsWithAWall) { return; }

	var sx = this._startX;
	var sy = this._startY;

	var dx = this._endX-sx;
	var dy = this._endY-sy;
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;

	priorityWallCallback(this._endX + dx, this._endY + dy);
	priorityWallCallback(this._endX + nx, this._endY + ny);
	priorityWallCallback(this._endX - nx, this._endY - ny);
};
/**
 * @class Base noise generator
 */
ROT.Noise = function() {
};

ROT.Noise.prototype.get = function(x, y) {};
/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */

/**
 * @class 2D simplex noise generator
 * @param {int} [gradients=256] Random gradients
 */
ROT.Noise.Simplex = function(gradients) {
	ROT.Noise.call(this);

	this._F2 = 0.5 * (Math.sqrt(3) - 1);
	this._G2 = (3 - Math.sqrt(3)) / 6;

	this._gradients = [
		[ 0, -1],
		[ 1, -1],
		[ 1,  0],
		[ 1,  1],
		[ 0,  1],
		[-1,  1],
		[-1,  0],
		[-1, -1]
	];

	var permutations = [];
	var count = gradients || 256;
	for (var i=0;i<count;i++) { permutations.push(i); }
	permutations = permutations.randomize();

	this._perms = [];
	this._indexes = [];

	for (var i=0;i<2*count;i++) {
		this._perms.push(permutations[i % count]);
		this._indexes.push(this._perms[i] % this._gradients.length);
	}

};
ROT.Noise.Simplex.extend(ROT.Noise);

ROT.Noise.Simplex.prototype.get = function(xin, yin) {
	var perms = this._perms;
	var indexes = this._indexes;
	var count = perms.length/2;
	var G2 = this._G2;

	var n0 =0, n1 = 0, n2 = 0, gi; // Noise contributions from the three corners

	// Skew the input space to determine which simplex cell we're in
	var s = (xin + yin) * this._F2; // Hairy factor for 2D
	var i = Math.floor(xin + s);
	var j = Math.floor(yin + s);
	var t = (i + j) * G2;
	var X0 = i - t; // Unskew the cell origin back to (x,y) space
	var Y0 = j - t;
	var x0 = xin - X0; // The x,y distances from the cell origin
	var y0 = yin - Y0;

	// For the 2D case, the simplex shape is an equilateral triangle.
	// Determine which simplex we are in.
	var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	if (x0 > y0) {
		i1 = 1;
		j1 = 0;
	} else { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
		i1 = 0;
		j1 = 1;
	} // upper triangle, YX order: (0,0)->(0,1)->(1,1)

	// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	// c = (3-sqrt(3))/6
	var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	var y1 = y0 - j1 + G2;
	var x2 = x0 - 1 + 2*G2; // Offsets for last corner in (x,y) unskewed coords
	var y2 = y0 - 1 + 2*G2;

	// Work out the hashed gradient indices of the three simplex corners
	var ii = i.mod(count);
	var jj = j.mod(count);

	// Calculate the contribution from the three corners
	var t0 = 0.5 - x0*x0 - y0*y0;
	if (t0 >= 0) {
		t0 *= t0;
		gi = indexes[ii+perms[jj]];
		var grad = this._gradients[gi];
		n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
	}
	
	var t1 = 0.5 - x1*x1 - y1*y1;
	if (t1 >= 0) {
		t1 *= t1;
		gi = indexes[ii+i1+perms[jj+j1]];
		var grad = this._gradients[gi];
		n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
	}
	
	var t2 = 0.5 - x2*x2 - y2*y2;
	if (t2 >= 0) {
		t2 *= t2;
		gi = indexes[ii+1+perms[jj+1]];
		var grad = this._gradients[gi];
		n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
	}

	// Add contributions from each corner to get the final noise value.
	// The result is scaled to return values in the interval [-1,1].
	return 70 * (n0 + n1 + n2);
}
/**
 * @class Abstract FOV algorithm
 * @param {function} lightPassesCallback Does the light pass through x,y?
 * @param {object} [options]
 * @param {int} [options.topology=8] 4/6/8
 */
ROT.FOV = function(lightPassesCallback, options) {
	this._lightPasses = lightPassesCallback;
	this._options = {
		topology: 8
	};
	for (var p in options) { this._options[p] = options[p]; }
};

/**
 * Compute visibility for a 360-degree circle
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.prototype.compute = function(x, y, R, callback) {};

/**
 * Return all neighbors in a concentric ring
 * @param {int} cx center-x
 * @param {int} cy center-y
 * @param {int} r range
 */
ROT.FOV.prototype._getCircle = function(cx, cy, r) {
	var result = [];
	var dirs, countFactor, startOffset;

	switch (this._options.topology) {
		case 4:
			countFactor = 1;
			startOffset = [0, 1];
			dirs = [
				ROT.DIRS[8][7],
				ROT.DIRS[8][1],
				ROT.DIRS[8][3],
				ROT.DIRS[8][5]
			];
		break;

		case 6:
			dirs = ROT.DIRS[6];
			countFactor = 1;
			startOffset = [-1, 1];
		break;

		case 8:
			dirs = ROT.DIRS[4];
			countFactor = 2;
			startOffset = [-1, 1];
		break;
	}

	/* starting neighbor */
	var x = cx + startOffset[0]*r;
	var y = cy + startOffset[1]*r;

	/* circle */
	for (var i=0;i<dirs.length;i++) {
		for (var j=0;j<r*countFactor;j++) {
			result.push([x, y]);
			x += dirs[i][0];
			y += dirs[i][1];

		}
	}

	return result;
};
/**
 * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
 * @augments ROT.FOV
 */
ROT.FOV.DiscreteShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
};
ROT.FOV.DiscreteShadowcasting.extend(ROT.FOV);

/**
 * @see ROT.FOV#compute
 */
ROT.FOV.DiscreteShadowcasting.prototype.compute = function(x, y, R, callback) {
	var center = this._coords;
	var map = this._map;

	/* this place is always visible */
	callback(x, y, 0, 1);

	/* standing in a dark place. FIXME is this a good idea?  */
	if (!this._lightPasses(x, y)) { return; }
	
	/* start and end angles */
	var DATA = [];
	
	var A, B, cx, cy, blocks;

	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		var neighbors = this._getCircle(x, y, r);
		var angle = 360 / neighbors.length;

		for (var i=0;i<neighbors.length;i++) {
			cx = neighbors[i][0];
			cy = neighbors[i][1];
			A = angle * (i - 0.5);
			B = A + angle;
			
			blocks = !this._lightPasses(cx, cy);
			if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) { callback(cx, cy, r, 1); }
			
			if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) { return; } /* cutoff? */

		} /* for all cells in this ring */
	} /* for all rings */
};

/**
 * @param {int} A start angle
 * @param {int} B end angle
 * @param {bool} blocks Does current cell block visibility?
 * @param {int[][]} DATA shadowed angle pairs
 */
ROT.FOV.DiscreteShadowcasting.prototype._visibleCoords = function(A, B, blocks, DATA) {
	if (A < 0) { 
		var v1 = this._visibleCoords(0, B, blocks, DATA);
		var v2 = this._visibleCoords(360+A, 360, blocks, DATA);
		return v1 || v2;
	}
	
	var index = 0;
	while (index < DATA.length && DATA[index] < A) { index++; }
	
	if (index == DATA.length) { /* completely new shadow */
		if (blocks) { DATA.push(A, B); } 
		return true;
	}
	
	var count = 0;
	
	if (index % 2) { /* this shadow starts in an existing shadow, or within its ending boundary */
		while (index < DATA.length && DATA[index] < B) {
			index++;
			count++;
		}
		
		if (count == 0) { return false; }
		
		if (blocks) { 
			if (count % 2) {
				DATA.splice(index-count, count, B);
			} else {
				DATA.splice(index-count, count);
			}
		}
		
		return true;

	} else { /* this shadow starts outside an existing shadow, or within a starting boundary */
		while (index < DATA.length && DATA[index] < B) {
			index++;
			count++;
		}
		
		/* visible when outside an existing shadow, or when overlapping */
		if (A == DATA[index-count] && count == 1) { return false; }
		
		if (blocks) { 
			if (count % 2) {
				DATA.splice(index-count, count, A);
			} else {
				DATA.splice(index-count, count, A, B);
			}
		}
			
		return true;
	}
};
/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
ROT.FOV.PreciseShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
};
ROT.FOV.PreciseShadowcasting.extend(ROT.FOV);

/**
 * @see ROT.FOV#compute
 */
ROT.FOV.PreciseShadowcasting.prototype.compute = function(x, y, R, callback) {
	/* this place is always visible */
	callback(x, y, 0, 1);

	/* standing in a dark place. FIXME is this a good idea?  */
	if (!this._lightPasses(x, y)) { return; }
	
	/* list of all shadows */
	var SHADOWS = [];
	
	var cx, cy, blocks, A1, A2, visibility;

	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		var neighbors = this._getCircle(x, y, r);
		var neighborCount = neighbors.length;

		for (var i=0;i<neighborCount;i++) {
			cx = neighbors[i][0];
			cy = neighbors[i][1];
			/* shift half-an-angle backwards to maintain consistency of 0-th cells */
			A1 = [i ? 2*i-1 : 2*neighborCount-1, 2*neighborCount];
			A2 = [2*i+1, 2*neighborCount]; 
			
			blocks = !this._lightPasses(cx, cy);
			visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
			if (visibility) { callback(cx, cy, r, visibility); }

			if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) { return; } /* cutoff? */

		} /* for all cells in this ring */
	} /* for all rings */
};

/**
 * @param {int[2]} A1 arc start
 * @param {int[2]} A2 arc end
 * @param {bool} blocks Does current arc block visibility?
 * @param {int[][]} SHADOWS list of active shadows
 */
ROT.FOV.PreciseShadowcasting.prototype._checkVisibility = function(A1, A2, blocks, SHADOWS) {
	if (A1[0] > A2[0]) { /* split into two sub-arcs */
		var v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
		var v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
		return (v1+v2)/2;
	}

	/* index1: first shadow >= A1 */
	var index1 = 0, edge1 = false;
	while (index1 < SHADOWS.length) {
		var old = SHADOWS[index1];
		var diff = old[0]*A1[1] - A1[0]*old[1];
		if (diff >= 0) { /* old >= A1 */
			if (diff == 0 && !(index1 % 2)) { edge1 = true; }
			break;
		}
		index1++;
	}

	/* index2: last shadow <= A2 */
	var index2 = SHADOWS.length, edge2 = false;
	while (index2--) {
		var old = SHADOWS[index2];
		var diff = A2[0]*old[1] - old[0]*A2[1];
		if (diff >= 0) { /* old <= A2 */
			if (diff == 0 && (index2 % 2)) { edge2 = true; }
			break;
		}
	}

	var visible = true;
	if (index1 == index2 && (edge1 || edge2)) {  /* subset of existing shadow, one of the edges match */
		visible = false; 
	} else if (edge1 && edge2 && index1+1==index2 && (index2 % 2)) { /* completely equivalent with existing shadow */
		visible = false;
	} else if (index1 > index2 && (index1 % 2)) { /* subset of existing shadow, not touching */
		visible = false;
	}
	
	if (!visible) { return 0; } /* fast case: not visible */
	
	var visibleLength, P;

	/* compute the length of visible arc, adjust list of shadows (if blocking) */
	var remove = index2-index1+1;
	if (remove % 2) {
		if (index1 % 2) { /* first edge within existing shadow, second outside */
			var P = SHADOWS[index1];
			visibleLength = (A2[0]*P[1] - P[0]*A2[1]) / (P[1] * A2[1]);
			if (blocks) { SHADOWS.splice(index1, remove, A2); }
		} else { /* second edge within existing shadow, first outside */
			var P = SHADOWS[index2];
			visibleLength = (P[0]*A1[1] - A1[0]*P[1]) / (A1[1] * P[1]);
			if (blocks) { SHADOWS.splice(index1, remove, A1); }
		}
	} else {
		if (index1 % 2) { /* both edges within existing shadows */
			var P1 = SHADOWS[index1];
			var P2 = SHADOWS[index2];
			visibleLength = (P2[0]*P1[1] - P1[0]*P2[1]) / (P1[1] * P2[1]);
			if (blocks) { SHADOWS.splice(index1, remove); }
		} else { /* both edges outside existing shadows */
			if (blocks) { SHADOWS.splice(index1, remove, A1, A2); }
			return 1; /* whole arc visible! */
		}
	}

	var arcLength = (A2[0]*A1[1] - A1[0]*A2[1]) / (A1[1] * A2[1]);

	return visibleLength/arcLength;
};
/**
 * @class Recursive shadowcasting algorithm
 * Currently only supports 4/8 topologies, not hexagonal.
 * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * @augments ROT.FOV
 */
ROT.FOV.RecursiveShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
};
ROT.FOV.RecursiveShadowcasting.extend(ROT.FOV);

/** Octants used for translating recursive shadowcasting offsets */
ROT.FOV.RecursiveShadowcasting.OCTANTS = [
	[-1,  0,  0,  1],
	[ 0, -1,  1,  0],
	[ 0, -1, -1,  0],
	[-1,  0,  0, -1],
	[ 1,  0,  0, -1],
	[ 0,  1, -1,  0],
	[ 0,  1,  1,  0],
	[ 1,  0,  0,  1]
];

/**
 * Compute visibility for a 360-degree circle
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute = function(x, y, R, callback) {
	//You can always see your own tile
	callback(x, y, 0, 1);
	for(var i = 0; i < ROT.FOV.RecursiveShadowcasting.OCTANTS.length; i++) {
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[i], R, callback);
	}
};

/**
 * Compute visibility for a 180-degree arc
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute180 = function(x, y, R, dir, callback) {
	//You can always see your own tile
	callback(x, y, 0, 1);
	var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
	var nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
	var nextOctant = (dir+ 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextPreviousOctant], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextOctant], R, callback);
};

/**
 * Compute visibility for a 90-degree arc
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute90 = function(x, y, R, dir, callback) {
	//You can always see your own tile
	callback(x, y, 0, 1);
	var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback);
};

/**
 * Render one octant (45-degree arc) of the viewshed
 * @param {int} x
 * @param {int} y
 * @param {int} octant Octant to be rendered
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype._renderOctant = function(x, y, octant, R, callback) {
	//Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
	this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
};

/**
 * Actually calculates the visibility
 * @param {int} startX The starting X coordinate
 * @param {int} startY The starting Y coordinate
 * @param {int} row The row to render
 * @param {float} visSlopeStart The slope to start at
 * @param {float} visSlopeEnd The slope to end at
 * @param {int} radius The radius to reach out to
 * @param {int} xx 
 * @param {int} xy 
 * @param {int} yx 
 * @param {int} yy 
 * @param {function} callback The callback to use when we hit a block that is visible
 */
ROT.FOV.RecursiveShadowcasting.prototype._castVisibility = function(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
	if(visSlopeStart < visSlopeEnd) { return; }
	for(var i = row; i <= radius; i++) {
		var dx = -i - 1;
		var dy = -i;
		var blocked = false;
		var newStart = 0;

		//'Row' could be column, names here assume octant 0 and would be flipped for half the octants
		while(dx <= 0) {
			dx += 1;

			//Translate from relative coordinates to map coordinates
			var mapX = startX + dx * xx + dy * xy;
			var mapY = startY + dx * yx + dy * yy;

			//Range of the row
			var slopeStart = (dx - 0.5) / (dy + 0.5);
			var slopeEnd = (dx + 0.5) / (dy - 0.5);
		
			//Ignore if not yet at left edge of Octant
			if(slopeEnd > visSlopeStart) { continue; }
			
			//Done if past right edge
			if(slopeStart < visSlopeEnd) { break; }
				
			//If it's in range, it's visible
			if((dx * dx + dy * dy) < (radius * radius)) {
				callback(mapX, mapY, i, 1);
			}
	
			if(!blocked) {
				//If tile is a blocking tile, cast around it
				if(!this._lightPasses(mapX, mapY) && i < radius) {
					blocked = true;
					this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);
					newStart = slopeEnd;
				}
			} else {
				//Keep narrowing if scanning across a block
				if(!this._lightPasses(mapX, mapY)) {
					newStart = slopeEnd;
					continue;
				}
			
				//Block has ended
				blocked = false;
				visSlopeStart = newStart;
			}
		}
		if(blocked) { break; }
	}
};
/**
 * @namespace Color operations
 */
ROT.Color = {
	fromString: function(str) {
		var cached, r;
		if (str in this._cache) {
			cached = this._cache[str];
		} else {
			if (str.charAt(0) == "#") { /* hex rgb */

				var values = str.match(/[0-9a-f]/gi).map(function(x) { return parseInt(x, 16); });
				if (values.length == 3) {
					cached = values.map(function(x) { return x*17; });
				} else {
					for (var i=0;i<3;i++) {
						values[i+1] += 16*values[i];
						values.splice(i, 1);
					}
					cached = values;
				}

			} else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { /* decimal rgb */
				cached = r[1].split(/\s*,\s*/).map(function(x) { return parseInt(x); });
			} else { /* html name */
				cached = [0, 0, 0];
			}

			this._cache[str] = cached;
		}

		return cached.slice();
	},

	/**
	 * Add two or more colors
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	add: function(color1, color2) {
		var result = color1.slice();
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				result[i] += arguments[j][i];
			}
		}
		return result;
	},

	/**
	 * Add two or more colors, MODIFIES FIRST ARGUMENT
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	add_: function(color1, color2) {
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				color1[i] += arguments[j][i];
			}
		}
		return color1;
	},

	/**
	 * Multiply (mix) two or more colors
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	multiply: function(color1, color2) {
		var result = color1.slice();
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				result[i] *= arguments[j][i] / 255;
			}
			result[i] = Math.round(result[i]);
		}
		return result;
	},

	/**
	 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	multiply_: function(color1, color2) {
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				color1[i] *= arguments[j][i] / 255;
			}
			color1[i] = Math.round(color1[i]);
		}
		return color1;
	},

	/**
	 * Interpolate (blend) two colors with a given factor
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @param {float} [factor=0.5] 0..1
	 * @returns {number[]}
	 */
	interpolate: function(color1, color2, factor) {
		if (arguments.length < 3) { factor = 0.5; }
		var result = color1.slice();
		for (var i=0;i<3;i++) {
			result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]));
		}
		return result;
	},

	/**
	 * Interpolate (blend) two colors with a given factor in HSL mode
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @param {float} [factor=0.5] 0..1
	 * @returns {number[]}
	 */
	interpolateHSL: function(color1, color2, factor) {
		if (arguments.length < 3) { factor = 0.5; }
		var hsl1 = this.rgb2hsl(color1);
		var hsl2 = this.rgb2hsl(color2);
		for (var i=0;i<3;i++) {
			hsl1[i] += factor*(hsl2[i]-hsl1[i]);
		}
		return this.hsl2rgb(hsl1);
	},

	/**
	 * Create a new random color based on this one
	 * @param {number[]} color
	 * @param {number[]} diff Set of standard deviations
	 * @returns {number[]}
	 */
	randomize: function(color, diff) {
		if (!(diff instanceof Array)) { diff = Math.round(ROT.RNG.getNormal(0, diff)); }
		var result = color.slice();
		for (var i=0;i<3;i++) {
			result[i] += (diff instanceof Array ? Math.round(ROT.RNG.getNormal(0, diff[i])) : diff);
		}
		return result;
	},

	/**
	 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
	 * @param {number[]} color
	 * @returns {number[]}
	 */
	rgb2hsl: function(color) {
		var r = color[0]/255;
		var g = color[1]/255;
		var b = color[2]/255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h, s, l];
	},

	/**
	 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
	 * @param {number[]} color
	 * @returns {number[]}
	 */
	hsl2rgb: function(color) {
		var l = color[2];

		if (color[1] == 0) {
			l = Math.round(l*255);
			return [l, l, l];
		} else {
			var hue2rgb = function(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var s = color[1];
			var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
			var p = 2 * l - q;
			var r = hue2rgb(p, q, color[0] + 1/3);
			var g = hue2rgb(p, q, color[0]);
			var b = hue2rgb(p, q, color[0] - 1/3);
			return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
		}
	},

	toRGB: function(color) {
		return "rgb(" + this._clamp(color[0]) + "," + this._clamp(color[1]) + "," + this._clamp(color[2]) + ")";
	},

	toHex: function(color) {
		var parts = [];
		for (var i=0;i<3;i++) {
			parts.push(this._clamp(color[i]).toString(16).lpad("0", 2));
		}
		return "#" + parts.join("");
	},

	_clamp: function(num) {
		if (num < 0) {
			return 0;
		} else if (num > 255) {
			return 255;
		} else {
			return num;
		}
	},

	_cache: {
		"black": [0,0,0],
		"navy": [0,0,128],
		"darkblue": [0,0,139],
		"mediumblue": [0,0,205],
		"blue": [0,0,255],
		"darkgreen": [0,100,0],
		"green": [0,128,0],
		"teal": [0,128,128],
		"darkcyan": [0,139,139],
		"deepskyblue": [0,191,255],
		"darkturquoise": [0,206,209],
		"mediumspringgreen": [0,250,154],
		"lime": [0,255,0],
		"springgreen": [0,255,127],
		"aqua": [0,255,255],
		"cyan": [0,255,255],
		"midnightblue": [25,25,112],
		"dodgerblue": [30,144,255],
		"forestgreen": [34,139,34],
		"seagreen": [46,139,87],
		"darkslategray": [47,79,79],
		"darkslategrey": [47,79,79],
		"limegreen": [50,205,50],
		"mediumseagreen": [60,179,113],
		"turquoise": [64,224,208],
		"royalblue": [65,105,225],
		"steelblue": [70,130,180],
		"darkslateblue": [72,61,139],
		"mediumturquoise": [72,209,204],
		"indigo": [75,0,130],
		"darkolivegreen": [85,107,47],
		"cadetblue": [95,158,160],
		"cornflowerblue": [100,149,237],
		"mediumaquamarine": [102,205,170],
		"dimgray": [105,105,105],
		"dimgrey": [105,105,105],
		"slateblue": [106,90,205],
		"olivedrab": [107,142,35],
		"slategray": [112,128,144],
		"slategrey": [112,128,144],
		"lightslategray": [119,136,153],
		"lightslategrey": [119,136,153],
		"mediumslateblue": [123,104,238],
		"lawngreen": [124,252,0],
		"chartreuse": [127,255,0],
		"aquamarine": [127,255,212],
		"maroon": [128,0,0],
		"purple": [128,0,128],
		"olive": [128,128,0],
		"gray": [128,128,128],
		"grey": [128,128,128],
		"skyblue": [135,206,235],
		"lightskyblue": [135,206,250],
		"blueviolet": [138,43,226],
		"darkred": [139,0,0],
		"darkmagenta": [139,0,139],
		"saddlebrown": [139,69,19],
		"darkseagreen": [143,188,143],
		"lightgreen": [144,238,144],
		"mediumpurple": [147,112,216],
		"darkviolet": [148,0,211],
		"palegreen": [152,251,152],
		"darkorchid": [153,50,204],
		"yellowgreen": [154,205,50],
		"sienna": [160,82,45],
		"brown": [165,42,42],
		"darkgray": [169,169,169],
		"darkgrey": [169,169,169],
		"lightblue": [173,216,230],
		"greenyellow": [173,255,47],
		"paleturquoise": [175,238,238],
		"lightsteelblue": [176,196,222],
		"powderblue": [176,224,230],
		"firebrick": [178,34,34],
		"darkgoldenrod": [184,134,11],
		"mediumorchid": [186,85,211],
		"rosybrown": [188,143,143],
		"darkkhaki": [189,183,107],
		"silver": [192,192,192],
		"mediumvioletred": [199,21,133],
		"indianred": [205,92,92],
		"peru": [205,133,63],
		"chocolate": [210,105,30],
		"tan": [210,180,140],
		"lightgray": [211,211,211],
		"lightgrey": [211,211,211],
		"palevioletred": [216,112,147],
		"thistle": [216,191,216],
		"orchid": [218,112,214],
		"goldenrod": [218,165,32],
		"crimson": [220,20,60],
		"gainsboro": [220,220,220],
		"plum": [221,160,221],
		"burlywood": [222,184,135],
		"lightcyan": [224,255,255],
		"lavender": [230,230,250],
		"darksalmon": [233,150,122],
		"violet": [238,130,238],
		"palegoldenrod": [238,232,170],
		"lightcoral": [240,128,128],
		"khaki": [240,230,140],
		"aliceblue": [240,248,255],
		"honeydew": [240,255,240],
		"azure": [240,255,255],
		"sandybrown": [244,164,96],
		"wheat": [245,222,179],
		"beige": [245,245,220],
		"whitesmoke": [245,245,245],
		"mintcream": [245,255,250],
		"ghostwhite": [248,248,255],
		"salmon": [250,128,114],
		"antiquewhite": [250,235,215],
		"linen": [250,240,230],
		"lightgoldenrodyellow": [250,250,210],
		"oldlace": [253,245,230],
		"red": [255,0,0],
		"fuchsia": [255,0,255],
		"magenta": [255,0,255],
		"deeppink": [255,20,147],
		"orangered": [255,69,0],
		"tomato": [255,99,71],
		"hotpink": [255,105,180],
		"coral": [255,127,80],
		"darkorange": [255,140,0],
		"lightsalmon": [255,160,122],
		"orange": [255,165,0],
		"lightpink": [255,182,193],
		"pink": [255,192,203],
		"gold": [255,215,0],
		"peachpuff": [255,218,185],
		"navajowhite": [255,222,173],
		"moccasin": [255,228,181],
		"bisque": [255,228,196],
		"mistyrose": [255,228,225],
		"blanchedalmond": [255,235,205],
		"papayawhip": [255,239,213],
		"lavenderblush": [255,240,245],
		"seashell": [255,245,238],
		"cornsilk": [255,248,220],
		"lemonchiffon": [255,250,205],
		"floralwhite": [255,250,240],
		"snow": [255,250,250],
		"yellow": [255,255,0],
		"lightyellow": [255,255,224],
		"ivory": [255,255,240],
		"white": [255,255,255]
	}
};
/**
 * @class Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 * @param {function} reflectivityCallback Callback to retrieve cell reflectivity (0..1)
 * @param {object} [options]
 * @param {int} [options.passes=1] Number of passes. 1 equals to simple FOV of all light sources, >1 means a *highly simplified* radiosity-like algorithm.
 * @param {int} [options.emissionThreshold=100] Cells with emissivity > threshold will be treated as light source in the next pass.
 * @param {int} [options.range=10] Max light range
 */
ROT.Lighting = function(reflectivityCallback, options) {
	this._reflectivityCallback = reflectivityCallback;
	this._options = {
		passes: 1,
		emissionThreshold: 100,
		range: 10
	};
	this._fov = null;

	this._lights = {};
	this._reflectivityCache = {};
	this._fovCache = {};

	this.setOptions(options);
};

/**
 * Adjust options at runtime
 * @see ROT.Lighting
 * @param {object} [options]
 */
ROT.Lighting.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
	if (options && options.range) { this.reset(); }
	return this;
};

/**
 * Set the used Field-Of-View algo
 * @param {ROT.FOV} fov
 */
ROT.Lighting.prototype.setFOV = function(fov) {
	this._fov = fov;
	this._fovCache = {};
	return this;
};

/**
 * Set (or remove) a light source
 * @param {int} x
 * @param {int} y
 * @param {null || string || number[3]} color
 */
ROT.Lighting.prototype.setLight = function(x, y, color) {
  var key = x + "," + y;

  if (color) {
    this._lights[key] = (typeof(color) == "string" ? ROT.Color.fromString(color) : color);
  } else {
    delete this._lights[key];
  }
  return this;
};

/**
 * Remove all light sources
 */
ROT.Lighting.prototype.clearLights = function() {
    this._lights = {};
};

/**
 * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
 */
ROT.Lighting.prototype.reset = function() {
	this._reflectivityCache = {};
	this._fovCache = {};

	return this;
};

/**
 * Compute the lighting
 * @param {function} lightingCallback Will be called with (x, y, color) for every lit cell
 */
ROT.Lighting.prototype.compute = function(lightingCallback) {
	var doneCells = {};
	var emittingCells = {};
	var litCells = {};

	for (var key in this._lights) { /* prepare emitters for first pass */
		var light = this._lights[key];
		emittingCells[key] = [0, 0, 0];
		ROT.Color.add_(emittingCells[key], light);
	}

	for (var i=0;i<this._options.passes;i++) { /* main loop */
		this._emitLight(emittingCells, litCells, doneCells);
		if (i+1 == this._options.passes) { continue; } /* not for the last pass */
		emittingCells = this._computeEmitters(litCells, doneCells);
	}

	for (var litKey in litCells) { /* let the user know what and how is lit */
		var parts = litKey.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		lightingCallback(x, y, litCells[litKey]);
	}

	return this;
};

/**
 * Compute one iteration from all emitting cells
 * @param {object} emittingCells These emit light
 * @param {object} litCells Add projected light to these
 * @param {object} doneCells These already emitted, forbid them from further calculations
 */
ROT.Lighting.prototype._emitLight = function(emittingCells, litCells, doneCells) {
	for (var key in emittingCells) {
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this._emitLightFromCell(x, y, emittingCells[key], litCells);
		doneCells[key] = 1;
	}
	return this;
};

/**
 * Prepare a list of emitters for next pass
 * @param {object} litCells
 * @param {object} doneCells
 * @returns {object}
 */
ROT.Lighting.prototype._computeEmitters = function(litCells, doneCells) {
	var result = {};

	for (var key in litCells) {
		if (key in doneCells) { continue; } /* already emitted */

		var color = litCells[key];

		if (key in this._reflectivityCache) {
			var reflectivity = this._reflectivityCache[key];
		} else {
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			var reflectivity = this._reflectivityCallback(x, y);
			this._reflectivityCache[key] = reflectivity;
		}

		if (reflectivity == 0) { continue; } /* will not reflect at all */

		/* compute emission color */
		var emission = [];
		var intensity = 0;
		for (var i=0;i<3;i++) {
			var part = Math.round(color[i]*reflectivity);
			emission[i] = part;
			intensity += part;
		}
		if (intensity > this._options.emissionThreshold) { result[key] = emission; }
	}

	return result;
};

/**
 * Compute one iteration from one cell
 * @param {int} x
 * @param {int} y
 * @param {number[]} color
 * @param {object} litCells Cell data to by updated
 */
ROT.Lighting.prototype._emitLightFromCell = function(x, y, color, litCells) {
	var key = x+","+y;
	if (key in this._fovCache) {
		var fov = this._fovCache[key];
	} else {
		var fov = this._updateFOV(x, y);
	}

	for (var fovKey in fov) {
		var formFactor = fov[fovKey];

		if (fovKey in litCells) { /* already lit */
			var result = litCells[fovKey];
		} else { /* newly lit */
			var result = [0, 0, 0];
			litCells[fovKey] = result;
		}

		for (var i=0;i<3;i++) { result[i] += Math.round(color[i]*formFactor); } /* add light color */
	}

	return this;
};

/**
 * Compute FOV ("form factor") for a potential light source at [x,y]
 * @param {int} x
 * @param {int} y
 * @returns {object}
 */
ROT.Lighting.prototype._updateFOV = function(x, y) {
	var key1 = x+","+y;
	var cache = {};
	this._fovCache[key1] = cache;
	var range = this._options.range;
	var cb = function(x, y, r, vis) {
		var key2 = x+","+y;
		var formFactor = vis * (1-r/range);
		if (formFactor == 0) { return; }
		cache[key2] = formFactor;
	};
	this._fov.compute(x, y, range, cb.bind(this));

	return cache;
};
/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
ROT.Path = function(toX, toY, passableCallback, options) {
	this._toX = toX;
	this._toY = toY;
	this._fromX = null;
	this._fromY = null;
	this._passableCallback = passableCallback;
	this._options = {
		topology: 8
	};
	for (var p in options) { this._options[p] = options[p]; }

	this._dirs = ROT.DIRS[this._options.topology];
	if (this._options.topology == 8) { /* reorder dirs for more aesthetic result (vertical/horizontal first) */
		this._dirs = [
			this._dirs[0],
			this._dirs[2],
			this._dirs[4],
			this._dirs[6],
			this._dirs[1],
			this._dirs[3],
			this._dirs[5],
			this._dirs[7]
		]
	}
};

/**
 * Compute a path from a given point
 * @param {int} fromX
 * @param {int} fromY
 * @param {function} callback Will be called for every path item with arguments "x" and "y"
 */
ROT.Path.prototype.compute = function(fromX, fromY, callback) {
};

ROT.Path.prototype._getNeighbors = function(cx, cy) {
	var result = [];
	for (var i=0;i<this._dirs.length;i++) {
		var dir = this._dirs[i];
		var x = cx + dir[0];
		var y = cy + dir[1];
		
		if (!this._passableCallback(x, y)) { continue; }
		result.push([x, y]);
	}
	
	return result;
};
/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
ROT.Path.Dijkstra = function(toX, toY, passableCallback, options) {
	ROT.Path.call(this, toX, toY, passableCallback, options);

	this._computed = {};
	this._todo = [];
	this._add(toX, toY, null);
};
ROT.Path.Dijkstra.extend(ROT.Path);

/**
 * Compute a path from a given point
 * @see ROT.Path#compute
 */
ROT.Path.Dijkstra.prototype.compute = function(fromX, fromY, callback) {
	var key = fromX+","+fromY;
	if (!(key in this._computed)) { this._compute(fromX, fromY); }
	if (!(key in this._computed)) { return; }
	
	var item = this._computed[key];
	while (item) {
		callback(item.x, item.y);
		item = item.prev;
	}
};

/**
 * Compute a non-cached value
 */
ROT.Path.Dijkstra.prototype._compute = function(fromX, fromY) {
	while (this._todo.length) {
		var item = this._todo.shift();
		if (item.x == fromX && item.y == fromY) { return; }
		
		var neighbors = this._getNeighbors(item.x, item.y);
		
		for (var i=0;i<neighbors.length;i++) {
			var neighbor = neighbors[i];
			var x = neighbor[0];
			var y = neighbor[1];
			var id = x+","+y;
			if (id in this._computed) { continue; } /* already done */	
			this._add(x, y, item); 
		}
	}
};

ROT.Path.Dijkstra.prototype._add = function(x, y, prev) {
	var obj = {
		x: x,
		y: y,
		prev: prev
	};
	this._computed[x+","+y] = obj;
	this._todo.push(obj);
};
/**
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
ROT.Path.AStar = function(toX, toY, passableCallback, options) {
	ROT.Path.call(this, toX, toY, passableCallback, options);

	this._todo = [];
	this._done = {};
	this._fromX = null;
	this._fromY = null;
};
ROT.Path.AStar.extend(ROT.Path);

/**
 * Compute a path from a given point
 * @see ROT.Path#compute
 */
ROT.Path.AStar.prototype.compute = function(fromX, fromY, callback) {
	this._todo = [];
	this._done = {};
	this._fromX = fromX;
	this._fromY = fromY;
	this._add(this._toX, this._toY, null);

	while (this._todo.length) {
		var item = this._todo.shift();
		var id = item.x+","+item.y;
		if (id in this._done) { continue; }
		this._done[id] = item;
		if (item.x == fromX && item.y == fromY) { break; }

		var neighbors = this._getNeighbors(item.x, item.y);

		for (var i=0;i<neighbors.length;i++) {
			var neighbor = neighbors[i];
			var x = neighbor[0];
			var y = neighbor[1];
			var id = x+","+y;
			if (id in this._done) { continue; }
			this._add(x, y, item); 
		}
	}
	
	var item = this._done[fromX+","+fromY];
	if (!item) { return; }
	
	while (item) {
		callback(item.x, item.y);
		item = item.prev;
	}
};

ROT.Path.AStar.prototype._add = function(x, y, prev) {
	var h = this._distance(x, y);
	var obj = {
		x: x,
		y: y,
		prev: prev,
		g: (prev ? prev.g+1 : 0),
		h: h
	};
	
	/* insert into priority queue */
	
	var f = obj.g + obj.h;
	for (var i=0;i<this._todo.length;i++) {
		var item = this._todo[i];
		var itemF = item.g + item.h;
		if (f < itemF || (f == itemF && h < item.h)) {
			this._todo.splice(i, 0, obj);
			return;
		}
	}
	
	this._todo.push(obj);
};

ROT.Path.AStar.prototype._distance = function(x, y) {
	switch (this._options.topology) {
		case 4:
			return (Math.abs(x-this._fromX) + Math.abs(y-this._fromY));
		break;

		case 6:
			var dx = Math.abs(x - this._fromX);
			var dy = Math.abs(y - this._fromY);
			return dy + Math.max(0, (dx-dy)/2);
		break;

		case 8: 
			return Math.max(Math.abs(x-this._fromX), Math.abs(y-this._fromY));
		break;
	}

        throw new Error("Illegal topology");
};
/**
 * @class Terminal backend
 * @private
 */
ROT.Display.Term = function(context) {
	ROT.Display.Backend.call(this, context);
	this._cx = -1;
	this._cy = -1;
	this._lastColor = "";
	this._options = {};
	this._ox = 0;
	this._oy = 0;
	this._termcolor = {};
}
ROT.Display.Term.extend(ROT.Display.Backend);

ROT.Display.Term.prototype.compute = function(options) {
	this._options = options;
	this._ox = Math.floor((process.stdout.columns - options.width) / 2);
	this._oy = Math.floor((process.stdout.rows - options.height) / 2);
	this._termcolor = new ROT.Display.Term[options.termColor.capitalize()](this._context);
	this._context._termcolor = this._termcolor;
}

ROT.Display.Term.prototype.draw = function(data, clearBefore) {
	// determine where to draw what with what colors
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	// determine if we need to move the terminal cursor
	var dx = this._ox + x;
	var dy = this._oy + y;
	if (dx < 0 || dx >= process.stdout.columns) { return; }
	if (dy < 0 || dy >= process.stdout.rows) { return; }
	if (dx !== this._cx || dy !== this._cy) {
		process.stdout.write(this._termcolor.positionToAnsi(dx,dy));
		this._cx = dx;
		this._cy = dy;
	}

	// terminals automatically clear, but if we're clearing when we're
	// not otherwise provided with a character, just use a space instead
	if (clearBefore) {
		if (!ch) {
			ch = " ";
		}
	}
		
	// if we're not clearing and not provided with a character, do nothing
	if (!ch) { return; }

	// determine if we need to change colors
	var newColor = this._termcolor.colorToAnsi(fg,bg);
	if (newColor !== this._lastColor) {
		process.stdout.write(newColor);
		this._lastColor = newColor;
	}

	// write the provided symbol to the display
	var chars = [].concat(ch);
	process.stdout.write(chars[0]);

	// update our position, given that we wrote a character
	this._cx++;
	if (this._cx >= process.stdout.columns) {
		this._cx = 0;
		this._cy++;
	}
}

ROT.Display.Term.prototype.computeSize = function(availWidth, availHeight) {
	return [process.stdout.columns, process.stdout.rows];
}

ROT.Display.Term.prototype.computeFontSize = function(availWidth, availHeight) {
	return 12;
}

ROT.Display.Term.prototype.eventToPosition = function(x, y) {
	return [x,y]
}
/**
 * @class Abstract terminal code module
 * @private
 */
ROT.Display.Term.Color = function(context) {
	this._context = context;
}

ROT.Display.Term.Color.prototype.clearToAnsi = function(bg) {
}

ROT.Display.Term.Color.prototype.colorToAnsi = function(fg, bg) {
}

ROT.Display.Term.Color.prototype.positionToAnsi = function(x, y) {
}
/**
 * @class xterm terminal code module
 * @private
 */
ROT.Display.Term.Xterm = function(context) {
	ROT.Display.Term.Color.call(this, context);
}
ROT.Display.Term.Xterm.extend(ROT.Display.Term.Color);

ROT.Display.Term.Xterm.prototype.clearToAnsi = function(bg) {
	return "\x1b[0;48;5;"
		+ this._termcolor(bg)
		+ "m\x1b[2J";
}

ROT.Display.Term.Xterm.prototype.colorToAnsi = function(fg, bg) {
	return "\x1b[0;38;5;"
		+ this._termcolor(fg)
		+ ";48;5;"
		+ this._termcolor(bg)
		+ "m";
}

ROT.Display.Term.Xterm.prototype.positionToAnsi = function(x, y) {
	return "\x1b[" + (y+1) + ";" + (x+1) + "H";
}

ROT.Display.Term.Xterm.prototype._termcolor = function(color) {
	var SRC_COLORS = 256.0;
	var DST_COLORS = 6.0;
	var COLOR_RATIO = DST_COLORS / SRC_COLORS;
	var rgb = ROT.Color.fromString(color);
	var r = Math.floor(rgb[0] * COLOR_RATIO);
	var g = Math.floor(rgb[1] * COLOR_RATIO);
	var b = Math.floor(rgb[2] * COLOR_RATIO);
	return r*36 + g*6 + b*1 + 16;
}
/**
 * Export to Node.js module
 */
for (var p in ROT) {
	exports[p] = ROT[p];
}
  return ROT;
}));

},{"process":34}],4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  black: "#000010",
  darkBlue: "#283a6d",
  darkPurple: "#7e2553",
  darkGreen: "#008751",
  brown: "#ab5236",
  darkGray: "#5f574f",
  lightGray: "#c2c3c7",
  white: "#fff1f8",
  red: "#ff0040",
  orange: "#ffa300",
  yellow: "#ffec27",
  green: "#00e436",
  blue: "#29adff",
  indigo: "#83769c",
  pink: "#ff77a8",
  peach: "#ffccaa"
};
},{}],25:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require("./colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Glyph = function () {
  function Glyph(_ref) {
    var _ref$fg = _ref.fg,
        fg = _ref$fg === undefined ? _colors2.default.white : _ref$fg,
        _ref$bg = _ref.bg,
        bg = _ref$bg === undefined ? _colors2.default.black : _ref$bg,
        _ref$char = _ref.char,
        char = _ref$char === undefined ? " " : _ref$char;

    _classCallCheck(this, Glyph);

    this.fg = fg;
    this.bg = bg;
    this.char = char;
  }

  _createClass(Glyph, [{
    key: "getFg",
    value: function getFg() {
      return this.fg;
    }
  }, {
    key: "getBg",
    value: function getBg() {
      return this.bg;
    }
  }, {
    key: "getChar",
    value: function getChar() {
      return this.char;
    }
  }]);

  return Glyph;
}();

exports.default = Glyph;
},{"./colors":4}],26:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _glyph = require("./glyph");

var _glyph2 = _interopRequireDefault(_glyph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DynamicGlyph = function (_Glyph) {
  _inherits(DynamicGlyph, _Glyph);

  function DynamicGlyph(_ref) {
    var _arguments = arguments;
    var _ref$name = _ref.name,
        name = _ref$name === undefined ? "" : _ref$name,
        _ref$mixins = _ref.mixins,
        mixins = _ref$mixins === undefined ? [] : _ref$mixins;

    _classCallCheck(this, DynamicGlyph);

    var _this = _possibleConstructorReturn(this, (DynamicGlyph.__proto__ || Object.getPrototypeOf(DynamicGlyph)).apply(this, arguments));

    _this.name = name;
    _this.attachedMixins = {};
    _this.attachedMixinGroups = {};
    _this.setupFunctions = [];

    mixins.forEach(function (mixinFactory) {
      var mixin = new (Function.prototype.bind.apply(mixinFactory, [null].concat(Array.prototype.slice.call(_arguments))))();

      _this.attachedMixins[mixin.name] = true;
      delete mixin.name;
      if (mixin.groupName) {
        _this.attachedMixinGroups[mixin.groupName] = true;
        delete mixin.groupName;
      }
      if (mixin.setup) {
        _this.setupFunctions.push(mixin.setup.bind(_this));
      }
      Object.assign(_this, mixin);
    });
    _this.setupFunctions.forEach(function (fun) {
      return fun();
    });
    return _this;
  }

  _createClass(DynamicGlyph, [{
    key: "hasMixin",
    value: function hasMixin(mixin) {
      return this.attachedMixins.hasOwnProperty(mixin) || this.attachedMixinGroups.hasOwnProperty(mixin);
    }
  }, {
    key: "describe",
    value: function describe() {
      return this.name;
    }
  }, {
    key: "describeA",
    value: function describeA(capitalize) {
      var prefixes = capitalize ? ["A", "An"] : ["a", "an"];
      var prefix = "aeiou".indexOf(this.describe()[0].toLowerCase()) >= 0 ? 1 : 0;
      return prefixes[prefix] + " " + this.describe();
    }
  }, {
    key: "describeThe",
    value: function describeThe(capitalize) {
      var prefix = capitalize ? "The" : "the";
      return prefix + " " + this.describe();
    }
  }]);

  return DynamicGlyph;
}(_glyph2.default);

exports.default = DynamicGlyph;
},{"./glyph":25}],13:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dynamicGlyph = require("../dynamicGlyph");

var _dynamicGlyph2 = _interopRequireDefault(_dynamicGlyph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entity = function (_DynamicGlyph) {
  _inherits(Entity, _DynamicGlyph);

  function Entity(_ref) {
    var _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        _ref$name = _ref.name,
        name = _ref$name === undefined ? " " : _ref$name,
        _ref$level = _ref.level,
        level = _ref$level === undefined ? null : _ref$level,
        _ref$Game = _ref.Game,
        Game = _ref$Game === undefined ? null : _ref$Game,
        _ref$speed = _ref.speed,
        speed = _ref$speed === undefined ? 1000 : _ref$speed,
        _ref$description = _ref.description,
        description = _ref$description === undefined ? "" : _ref$description;

    _classCallCheck(this, Entity);

    var _this = _possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).apply(this, arguments));

    _this.x = x;
    _this.y = y;
    _this.description = description;
    _this.name = name;
    _this.level = level;
    _this.game = Game;
    _this.speed = speed;
    _this.alive = true;
    return _this;
  }

  _createClass(Entity, [{
    key: "isAlive",
    value: function isAlive() {
      return this.alive;
    }
  }, {
    key: "kill",
    value: function kill() {
      if (!this.isAlive()) return;
      this.alive = false;
      if (this.hasMixin("PlayerActor")) {
        this.act();
      } else {
        this.getLevel().removeEntity(this);
      }
    }
  }, {
    key: "getSpeed",
    value: function getSpeed() {
      var mod = 0;
      if (this.hasMixin("TimedStatusEffects")) {
        this.getTimedStatusEffects().forEach(function (s) {
          if (s.property == "speed") {
            mod += s.value;
          }
        });
      }
      if (this.armor && this.armor.length > 1) {
        mod -= Math.pow(5, this.armor.length);
      }
      return Math.max(this.speed + mod, 100);
    }
  }, {
    key: "setGame",
    value: function setGame(game) {
      this.game = game;
    }
  }, {
    key: "getGame",
    value: function getGame() {
      return this.game;
    }
  }, {
    key: "getLevel",
    value: function getLevel() {
      return this.level;
    }
  }, {
    key: "setLevel",
    value: function setLevel(newLevel) {
      this.level = newLevel;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "setName",
    value: function setName(newName) {
      this.name = newName;
    }
  }, {
    key: "getX",
    value: function getX() {
      return this.x;
    }
  }, {
    key: "getY",
    value: function getY() {
      return this.y;
    }
  }, {
    key: "setX",
    value: function setX(newX) {
      this.x = newX;
    }
  }, {
    key: "setY",
    value: function setY(newY) {
      this.y = newY;
    }
  }, {
    key: "setPosition",
    value: function setPosition(newX, newY) {
      if (this.level) {
        this.level.updateEntityPosition(this.x, this.y, newX, newY);
      }
      this.x = newX;
      this.y = newY;
    }
  }]);

  return Entity;
}(_dynamicGlyph2.default);

exports.default = Entity;
},{"../dynamicGlyph":26}],14:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _startScreen = require("./startScreen");

var _startScreen2 = _interopRequireDefault(_startScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var gameOverScreen = function () {
  function gameOverScreen(Game) {
    _classCallCheck(this, gameOverScreen);

    this.game = Game;
  }

  _createClass(gameOverScreen, [{
    key: "exit",
    value: function exit() {}
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode == _rotJs2.default.VK_RETURN) {
        window.location.reload();
      }
    }
  }, {
    key: "render",
    value: function render(Game) {
      var display = Game.getDisplay();
      display.drawText(0, 0, "game over!");
    }
  }]);

  return gameOverScreen;
}();

exports.default = gameOverScreen;
},{"rot-js":33,"./startScreen":7}],15:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _startScreen = require("./startScreen");

var _startScreen2 = _interopRequireDefault(_startScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WinScreen = function () {
  function WinScreen(Game) {
    _classCallCheck(this, WinScreen);

    this.game = Game;
  }

  _createClass(WinScreen, [{
    key: "exit",
    value: function exit() {}
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode == _rotJs2.default.VK_RETURN) {
        this.game.switchScreen(_startScreen2.default);
      }
    }
  }, {
    key: "render",
    value: function render(Game) {
      var display = Game.getDisplay();
      display.drawText(0, 0, "YOU WIN.  CONGRATZ");
    }
  }]);

  return WinScreen;
}();

exports.default = WinScreen;
},{"rot-js":33,"./startScreen":7}],35:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, attributes /*, ...rest*/) {
  var node;
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) rest.push(arguments[length]);

  while (rest.length) {
    if ((node = rest.pop()) && node.pop /* Array? */) {
        for (length = node.length; length--;) {
          rest.push(node[length]);
        }
      } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(attributes || {}, children) : {
    nodeName: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  };
}

function app(state, actions, view, container) {
  var renderLock;
  var invokeLaterStack = [];
  var rootElement = container && container.children[0] || null;
  var oldNode = rootElement && toVNode(rootElement, [].map);
  var globalState = clone(state);
  var wiredActions = clone(actions);

  scheduleRender(wireStateToActions([], globalState, wiredActions));

  return wiredActions;

  function toVNode(element, map) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : toVNode(element, map);
      })
    };
  }

  function render() {
    renderLock = !renderLock;

    var next = view(globalState, wiredActions);
    if (container && !renderLock) {
      rootElement = patch(container, rootElement, oldNode, oldNode = next);
    }

    while (next = invokeLaterStack.pop()) next();
  }

  function scheduleRender() {
    if (!renderLock) {
      renderLock = !renderLock;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var obj = {};

    for (var i in target) obj[i] = target[i];
    for (var i in source) obj[i] = source[i];

    return obj;
  }

  function set(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] = path.length > 1 ? set(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }
    return value;
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]];
    }
    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          if (typeof (data = action(data)) === "function") {
            data = data(get(path, globalState), actions);
          }

          if (data && data !== (state = get(path, globalState)) && !data.then // Promise
          ) {
              scheduleRender(globalState = set(path, clone(state, data), globalState));
            }

          return data;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = state[key] || {}, actions[key] = clone(actions[key]));
    }
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function setElementProp(element, name, value, isSVG, oldValue) {
    if (name === "key") {} else if (name === "style") {
      for (var i in clone(oldValue, value)) {
        element[name][i] = value == null || value[i] == null ? "" : value[i];
      }
    } else {
      if (typeof value === "function" || name in element && !isSVG) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSVG) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSVG = isSVG || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);

    if (node.attributes) {
      if (node.attributes.oncreate) {
        invokeLaterStack.push(function () {
          node.attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG));
      }

      for (var name in node.attributes) {
        setElementProp(element, name, node.attributes[name], isSVG);
      }
    }

    return element;
  }

  function updateElement(element, oldProps, attributes, isSVG) {
    for (var name in clone(oldProps, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldProps[name])) {
        setElementProp(element, name, attributes[name], isSVG, oldProps[name]);
      }
    }

    if (attributes.onupdate) {
      invokeLaterStack.push(function () {
        attributes.onupdate(element, oldProps);
      });
    }
  }

  function removeChildren(element, node, attributes) {
    if (attributes = node.attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node, cb) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    if (node.attributes && (cb = node.attributes.onremove)) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (node === oldNode) {} else if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element);
    } else if (node.nodeName && node.nodeName === oldNode.nodeName) {
      updateElement(element, oldNode.attributes, node.attributes, isSVG = isSVG || node.nodeName === "svg");

      var oldElements = [];
      var oldKeyed = {};
      var newKeyed = {};

      for (var i = 0; i < oldNode.children.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElements[i], oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < node.children.length) {
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKey(oldChild);
        var newKey = getKey(newChild);

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey == null) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChild, newChild, isSVG);
            j++;
          }
          i++;
        } else {
          var recyledNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, recyledNode[0], recyledNode[1], newChild, isSVG);
            i++;
          } else if (recyledNode[0]) {
            patch(element, element.insertBefore(recyledNode[0], oldElements[i]), recyledNode[1], newChild, isSVG);
          } else {
            patch(element, oldElements[i], null, newChild, isSVG);
          }

          j++;
          newKeyed[newKey] = newChild;
        }
      }

      while (i < oldNode.children.length) {
        var oldChild = oldNode.children[i];
        if (getKey(oldChild) == null) {
          removeElement(element, oldElements[i], oldChild);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[oldKeyed[i][1].key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    } else if (node.nodeName === oldNode.nodeName) {
      element.nodeValue = node;
    } else {
      element = parent.insertBefore(createElement(node, isSVG), nextSibling = element);
      removeElement(parent, nextSibling, oldNode);
    }
    return element;
  }
}
},{}],28:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _hyperapp = require("hyperapp");

var _colors = require("../colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ItemDetailDialog = function () {
  function ItemDetailDialog(item) {
    var simple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ItemDetailDialog);

    this.item = item;
    this.display = document.createElement("div");
    this.display.classList.add("item-detail-dialog");
    this.actions = {};
    this.simple = simple;
    this.state = { item: this.item, simple: this.simple };
    this.functions = (0, _hyperapp.app)(this.state, this.actions, this.view, this.display);
  }

  _createClass(ItemDetailDialog, [{
    key: "view",
    value: function view(_ref, actions) {
      var item = _ref.item,
          simple = _ref.simple;

      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          item.name
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          item.description
        ),
        simple ? "" : (0, _hyperapp.h)(
          "div",
          null,
          (0, _hyperapp.h)(
            "div",
            null,
            "Actions:"
          ),
          (0, _hyperapp.h)(
            "div",
            null,
            "(d)rop"
          ),
          (0, _hyperapp.h)(
            "div",
            null,
            item.equipped ? "(u)nequip" : item.wieldable ? "(w)ield" : item.wearable ? "(w)ear" : item.hasMixin("Usable") ? "(a)pply" : ""
          ),
          (0, _hyperapp.h)(
            "p",
            null,
            "Press key to use, press 'q' to go back"
          ),
          (0, _hyperapp.h)(
            "p",
            null,
            "hint: you can use the letter shortcuts above from the main inventory screen"
          )
        )
      );
    }
  }]);

  return ItemDetailDialog;
}();

exports.default = ItemDetailDialog;
},{"rot-js":33,"hyperapp":35,"../colors":4}],16:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _hyperapp = require("hyperapp");

var _colors = require("../colors");

var _colors2 = _interopRequireDefault(_colors);

var _itemDetailDialog = require("./itemDetailDialog");

var _itemDetailDialog2 = _interopRequireDefault(_itemDetailDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ItemListDialog = function () {
  function ItemListDialog(items, masterScreen, player) {
    var title = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "INVENTORY";

    _classCallCheck(this, ItemListDialog);

    this.items = items;
    this.masterScreen = masterScreen;
    this.player = player;
    this.subscreen = null;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.display.classList.add("item-list-dialog");
    this.title = title;
    this.actions = {
      inc: this.incSelectedItem.bind(this),
      dec: this.decSelectedItem.bind(this),
      getIndex: function getIndex(value) {
        return function (state) {
          return state.selectedItemIndex;
        };
      },
      getItems: function getItems(valie) {
        return function (state) {
          return state.items;
        };
      },
      getState: function getState(value) {
        return function (state) {
          return state;
        };
      },
      getSelectedItem: function getSelectedItem(value) {
        return function (state) {
          return state.items[state.selectedItemIndex];
        };
      },
      removeItem: function removeItem(itemToRemove) {
        return function (state) {
          var items = state.items.filter(function (item) {
            return item !== itemToRemove;
          });
          var selectedItemIndex = Math.min(state.selectedItemIndex, items.length - 1);
          return { items: items, selectedItemIndex: selectedItemIndex };
        };
      }
    };
    this.state = {
      player: this.player,
      title: this.title,
      items: this.items,
      selectedItemIndex: 0
    };
    this.functions = (0, _hyperapp.app)(this.state, this.actions, this.view, this.display);
  }

  _createClass(ItemListDialog, [{
    key: "view",
    value: function view(_ref, actions) {
      var player = _ref.player,
          items = _ref.items,
          selectedItemIndex = _ref.selectedItemIndex,
          title = _ref.title;

      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          title,
          title == "INVENTORY" ? "- " + items.length + "/" + player.getInventorySize() : ""
        ),
        items.map(function (item, i) {
          return (0, _hyperapp.h)(
            "div",
            null,
            (0, _hyperapp.h)(
              "span",
              { style: { color: item.fg, marginRight: "4px" } },
              item.char
            ),
            (0, _hyperapp.h)(
              "span",
              { "class": i == selectedItemIndex ? "selected" : "" },
              item.name,
              item.charges ? "(" + item.charges + ")" : "",
              item == player.weapon ? " (wielding)" : "",
              player.isWearing(item) ? " (wearing)" : ""
            )
          );
        })
      );
    }
  }, {
    key: "render",
    value: function render() {
      document.body.appendChild(this.display);
    }
  }, {
    key: "incSelectedItem",
    value: function incSelectedItem() {
      return function (_ref2) {
        var selectedItemIndex = _ref2.selectedItemIndex,
            items = _ref2.items;
        return {
          selectedItemIndex: (selectedItemIndex + 1) % items.length
        };
      };
    }
  }, {
    key: "decSelectedItem",
    value: function decSelectedItem() {
      return function (_ref3) {
        var selectedItemIndex = _ref3.selectedItemIndex,
            items = _ref3.items;

        var newValue = selectedItemIndex - 1;
        if (newValue < 0) {
          newValue = items.length - 1;
        }

        return {
          selectedItemIndex: newValue
        };
      };
    }
  }, {
    key: "exit",
    value: function exit() {
      this.masterScreen.exitSubscreen();
      this.display.remove();
    }
  }, {
    key: "renderItemList",
    value: function renderItemList() {
      this.functions = (0, _hyperapp.app)(this.functions.getState(), this.functions, this.view, this.display);
    }
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      var item = this.functions.getSelectedItem();

      if (inputData.keyCode === _rotJs2.default.VK_ESCAPE) {
        this.exit();
      }

      if (!item) {
        return;
      }

      if (inputData.keyCode === _rotJs2.default.VK_RETURN) {
        // view selected item
        var equipped = item == this.player.armor || item == this.player.weapon;
        var detailDialog = new _itemDetailDialog2.default(Object.assign(item, { equipped: equipped }));
        this.display.innerHTML = "";
        this.display.appendChild(detailDialog.display);
      } else if (inputData.keyCode == _rotJs2.default.VK_Q) {
        this.display.innerHTML = "";
        this.renderItemList();
      } else if (inputData.keyCode === _rotJs2.default.VK_J || inputData.keyCode === _rotJs2.default.VK_DOWN || inputData.keyCode === _rotJs2.default.VK_2) {
        this.functions.inc();
      } else if (inputData.keyCode === _rotJs2.default.VK_K || inputData.keyCode === _rotJs2.default.VK_UP || inputData.keyCode === _rotJs2.default.VK_8) {
        this.functions.dec();
      } else if (inputData.keyCode === _rotJs2.default.VK_W) {
        if (item.wieldable) {
          this.player.wield(item);
          this.player.getGame().messageDisplay.add("You wield the " + item.name);
          this.exit();
        }
        if (item.wearable) {
          this.player.wear(item);
          this.player.getGame().messageDisplay.add("You put on the " + item.name);
          this.exit();
        }
      } else if (inputData.keyCode === _rotJs2.default.VK_A) {
        if (item.hasMixin("Usable")) {
          if (item.use(this.player)) {
            this.player.removeItem(item);
            this.functions.removeItem(item);
            this.player.getGame().messageDisplay.add("You apply the " + item.name);
            this.exit();
          } else {
            this.player.getGame().messageDisplay.add({
              text: "You can't use that right now",
              color: "red"
            });
          }
        }
      } else if (inputData.keyCode === _rotJs2.default.VK_U) {
        this.player.unequip(item);
        this.renderItemList();
      } else if (inputData.keyCode === _rotJs2.default.VK_D) {
        this.player.removeItem(item);
        this.functions.removeItem(item);
        this.masterScreen.level.addItem(item, this.player.getX(), this.player.getY());
        this.renderItemList();
      }
    }
  }]);

  return ItemListDialog;
}();

exports.default = ItemListDialog;
},{"rot-js":33,"hyperapp":35,"../colors":4,"./itemDetailDialog":28}],17:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _itemListDialog = require("./itemListDialog");

var _itemListDialog2 = _interopRequireDefault(_itemListDialog);

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PickUpScreen = function (_ItemListDialog) {
  _inherits(PickUpScreen, _ItemListDialog);

  function PickUpScreen() {
    var _ref;

    _classCallCheck(this, PickUpScreen);

    var _this = _possibleConstructorReturn(this, (_ref = PickUpScreen.__proto__ || Object.getPrototypeOf(PickUpScreen)).call.apply(_ref, [this].concat(Array.prototype.slice.call(arguments), ["Pick Up What?"])));

    _this.title = "Pick up what?";
    return _this;
  }

  _createClass(PickUpScreen, [{
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode == _rotJs2.default.VK_D || inputData.keyCode == _rotJs2.default.VK_W) {
        return;
      }
      if (inputData.keyCode == _rotJs2.default.VK_RETURN) {
        var item = this.functions.getSelectedItem();
        if (item.canPickUp) {
          this.player.addItem(item);
          this.functions.removeItem(item);
        } else {
          this.masterScreen.level.game.messageDisplay.add("Can't pick that up!");
        }
        var items = this.functions.getItems();
        this.masterScreen.level.setItemsAt(this.player.getX(), this.player.getY(), items);
        if (items.length == 0) {
          this.exit();
        }
        return;
      }
      _get(PickUpScreen.prototype.__proto__ || Object.getPrototypeOf(PickUpScreen.prototype), "handleInput", this).call(this, inputData);
    }
  }]);

  return PickUpScreen;
}(_itemListDialog2.default);

exports.default = PickUpScreen;
},{"./itemListDialog":16,"rot-js":33}],18:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _itemListDialog = require("./itemListDialog");

var _itemListDialog2 = _interopRequireDefault(_itemListDialog);

var _itemDetailDialog = require("./itemDetailDialog");

var _itemDetailDialog2 = _interopRequireDefault(_itemDetailDialog);

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VisibleThingsDialog = function (_ItemListDialog) {
  _inherits(VisibleThingsDialog, _ItemListDialog);

  function VisibleThingsDialog() {
    var _ref;

    _classCallCheck(this, VisibleThingsDialog);

    var _this = _possibleConstructorReturn(this, (_ref = VisibleThingsDialog.__proto__ || Object.getPrototypeOf(VisibleThingsDialog)).call.apply(_ref, [this].concat(Array.prototype.slice.call(arguments), ["Visible Creatures and Items"])));

    _this.title = "Visible Creatures and Items";
    return _this;
  }

  _createClass(VisibleThingsDialog, [{
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode == _rotJs2.default.VK_D || inputData.keyCode == _rotJs2.default.VK_W || inputData.keyCode == _rotJs2.default.VK_A) {
        return;
      }
      if (inputData.keyCode == _rotJs2.default.VK_RETURN) {
        var item = this.functions.getSelectedItem();
        var detailDialog = new _itemDetailDialog2.default(item, true);
        this.display.innerHTML = "";
        this.display.appendChild(detailDialog.display);
        return;
      }
      _get(VisibleThingsDialog.prototype.__proto__ || Object.getPrototypeOf(VisibleThingsDialog.prototype), "handleInput", this).call(this, inputData);
    }
  }]);

  return VisibleThingsDialog;
}(_itemListDialog2.default);

exports.default = VisibleThingsDialog;
},{"./itemListDialog":16,"./itemDetailDialog":28,"rot-js":33}],8:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hyperapp = require("hyperapp");

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Confirmation = function () {
  function Confirmation(text, func, cancelFunction, masterScreen) {
    _classCallCheck(this, Confirmation);

    this.text = text;
    this.masterScreen = masterScreen;
    this.function = func;
    this.cancelFunction = cancelFunction;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.display.classList.add("confirmation");
    (0, _hyperapp.app)({
      text: this.text,
      confirm: this.confirm.bind(this),
      cancel: this.cancel.bind(this)
    }, {}, this.view, this.display);
  }

  _createClass(Confirmation, [{
    key: "view",
    value: function view(_ref) {
      var text = _ref.text,
          confirm = _ref.confirm,
          cancel = _ref.cancel;

      return (0, _hyperapp.h)(
        "div",
        null,
        text,
        (0, _hyperapp.h)(
          "div",
          null,
          (0, _hyperapp.h)(
            "button",
            { onclick: confirm },
            "YES (ENTER)"
          ),
          (0, _hyperapp.h)(
            "button",
            { onclick: cancel },
            "NO (ESCAPE)"
          )
        )
      );
    }
  }, {
    key: "render",
    value: function render() {
      document.body.appendChild(this.display);
    }
  }, {
    key: "confirm",
    value: function confirm() {
      this.masterScreen.exitSubscreen();
      this.display.remove();
      this.function();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.masterScreen.exitSubscreen();
      this.display.remove();
      this.cancelFunction();
    }
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode === _rotJs2.default.VK_ESCAPE) {
        this.cancel();
      }
      if (inputData.keyCode === _rotJs2.default.VK_RETURN) {
        this.confirm();
      }
    }
  }]);

  return Confirmation;
}();

exports.default = Confirmation;
},{"hyperapp":35,"rot-js":33}],19:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hyperapp = require("hyperapp");

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StoryScreen = function () {
  function StoryScreen(masterScreen, text, func) {
    _classCallCheck(this, StoryScreen);

    this.func = func;
    this.masterScreen = masterScreen;
    this.text = text;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.display.classList.add("story-screen");
    this.actions = {};
    this.app = (0, _hyperapp.app)({ text: this.text }, this.actions, this.view.bind(this), this.display);
  }

  _createClass(StoryScreen, [{
    key: "view",
    value: function view(_ref) {
      var text = _ref.text;

      return (0, _hyperapp.h)(
        "div",
        null,
        text.map(function (p) {
          return (0, _hyperapp.h)(
            "p",
            null,
            p
          );
        }),
        (0, _hyperapp.h)(
          "p",
          null,
          "Press [Enter] to continue"
        )
      );
    }
  }, {
    key: "render",
    value: function render() {
      this.display.remove();
      document.body.appendChild(this.display);
    }
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode === _rotJs2.default.VK_ESCAPE || inputData.keyCode === _rotJs2.default.VK_RETURN) {
        this.masterScreen.exitSubscreen();
        this.display.remove();
        if (this.func) {
          this.func();
        }
      }
    }
  }]);

  return StoryScreen;
}();

exports.default = StoryScreen;
},{"hyperapp":35,"rot-js":33}],20:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hyperapp = require("hyperapp");

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HelpScreen = function () {
  function HelpScreen(masterScreen) {
    _classCallCheck(this, HelpScreen);

    this.masterScreen = masterScreen;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.screens = ["otherKeys", "movement", "inventory", "weaponsAndArmor", "blasters"];
    this.actions = {
      switchScreen: function switchScreen(value) {
        return function (state) {
          return {
            screen: value
          };
        };
      }
    };
    this.app = (0, _hyperapp.app)({ screen: this.screens[0] }, this.actions, this.view.bind(this), this.display);
  }

  _createClass(HelpScreen, [{
    key: "view",
    value: function view(_ref) {
      var screen = _ref.screen;

      switch (screen) {
        case "movement":
          return (0, _hyperapp.h)(this.movementScreen, null);
        case "otherKeys":
          return (0, _hyperapp.h)(this.otherKeys, null);
        case "inventory":
          return (0, _hyperapp.h)(this.inventory, null);
        case "weaponsAndArmor":
          return (0, _hyperapp.h)(this.weaponsAndArmor, null);
        case "blasters":
          return (0, _hyperapp.h)(this.blasters, null);
        default:
          return (0, _hyperapp.h)(
            "div",
            null,
            "error"
          );
      }
    }
  }, {
    key: "weaponsAndArmor",
    value: function weaponsAndArmor() {
      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          "HELP - WEAPONS AND ARMOR"
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "You can wield or wear certain items from the inventory screen. Weapons and Armor items can give you stat boosts or special abilities. Check your player status (press 'p') to see how various weapons and armor affect your attack and defense values."
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "You may only wield one weapon at a time, but wielding weapons does not use up a turn, so feel free to switch often during combat."
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "Multiple pieces of Armor may be worn, but wearing more than one piece will negatively affect your speed... so use with care!"
        ),
        (0, _hyperapp.h)(
          "p",
          { "class": "gray" },
          "(press < or > to view more help topics)"
        )
      );
    }
  }, {
    key: "blasters",
    value: function blasters() {
      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          "HELP - BLASTERS"
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "Blasters can be fired by pressing 'f' and then one of the direction keys while wielding the weapon. Blasters can only be fired in one of the 8 movement directions and may or may not have a limited range. Blasters have a limited amount of charges and once they have run out will no longer fire. It is possible to find \"blaster chargers\" throughout the game that can recharge the wielded weapon."
        ),
        (0, _hyperapp.h)(
          "p",
          { "class": "gray" },
          "(press < or > to view more help topics)"
        )
      );
    }
  }, {
    key: "inventory",
    value: function inventory() {
      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          "HELP - INVENTORY"
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "Press 'i' to interact with you inventory. On the inventory screen, the various items can be selected using \"up\" or \"down\" from any set of movement keys (see HELP-MOVEMENT)."
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "Be aware that you can only carry a few items at a time, and this includes items that you might be wearing or wielding. It ",
          (0, _hyperapp.h)(
            "em",
            null,
            "may"
          ),
          " ",
          "be possible to find items that increase your inventory size... but whether or not that happens lies in the hands of the Gods of RNG."
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "Items can be examined by pressing enter, and can be used by pressing any of the keys shown on the details view. You do not need to go to the details view to use an item. Simply pressing the correct key from the main inventory screen will perform the action specified. For example, pressing 'd' from the main inventory screen will drop the selected item."
        ),
        (0, _hyperapp.h)(
          "p",
          { "class": "gray" },
          "(press < or > to view more help topics)"
        )
      );
    }
  }, {
    key: "otherKeys",
    value: function otherKeys() {
      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          "HELP - KEYS"
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "i - inventory"
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "g - pick up item"
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "v - inspect visible creatures and items"
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "p - view player status"
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "c - close door"
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "f - fire weapon"
        ),
        (0, _hyperapp.h)(
          "p",
          { "class": "gray" },
          "(press < or > to view more help topics)"
        )
      );
    }
  }, {
    key: "movementScreen",
    value: function movementScreen() {
      var movement = "\n  y k u    7 8 9\n   \\|/      \\|/\n  h- -l    4- -6\n   /|\\      /|\\\n  b j m    1 2 3\n ";
      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          "HELP - MOVEMENT"
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "You can move your character with the arrow-keys, numpad or \"vi-keys\" as seen below"
        ),
        (0, _hyperapp.h)(
          "pre",
          { style: { margin: 0 } },
          movement
        ),
        (0, _hyperapp.h)(
          "div",
          null,
          "press 5 or . to wait for one turn"
        ),
        (0, _hyperapp.h)(
          "p",
          { "class": "gray" },
          "(press < or > to view more help topics)"
        )
      );
    }
  }, {
    key: "render",
    value: function render() {
      this.display.remove();
      document.body.appendChild(this.display);
    }
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode === _rotJs2.default.VK_ESCAPE) {
        this.masterScreen.exitSubscreen();
        this.display.remove();
      }
      if (inputData.keyCode === _rotJs2.default.VK_PERIOD) {
        this.screens.push(this.screens.shift());
        this.app.switchScreen(this.screens[0]);
      }
      if (inputData.keyCode === _rotJs2.default.VK_COMMA) {
        this.screens.unshift(this.screens.pop());
        this.app.switchScreen(this.screens[0]);
      }
    }
  }]);

  return HelpScreen;
}();

exports.default = HelpScreen;
},{"hyperapp":35,"rot-js":33}],21:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hyperapp = require("hyperapp");

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerStatusScreen = function () {
  function PlayerStatusScreen(masterScreen) {
    _classCallCheck(this, PlayerStatusScreen);

    this.masterScreen = masterScreen;
    this.display = document.createElement("div");
    this.display.classList.add("subscreen");
    this.actions = {};
    this.app = (0, _hyperapp.app)({ player: this.masterScreen.player }, this.actions, this.view.bind(this), this.display);
  }

  _createClass(PlayerStatusScreen, [{
    key: "view",
    value: function view(_ref) {
      var player = _ref.player;

      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          "player status"
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "name: ",
          player.name
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "attack: ",
          player.getAttackValue()
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "defense: ",
          player.getDefenseValue()
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "speed: ",
          player.getSpeed() / 10,
          "%"
        )
      );
    }
  }, {
    key: "render",
    value: function render() {
      this.display.remove();
      document.body.appendChild(this.display);
    }
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode === _rotJs2.default.VK_ESCAPE) {
        this.masterScreen.exitSubscreen();
        this.display.remove();
      }
    }
  }]);

  return PlayerStatusScreen;
}();

exports.default = PlayerStatusScreen;
},{"hyperapp":35,"rot-js":33}],27:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repository = function () {
  function Repository(_ref) {
    var _ref$name = _ref.name,
        name = _ref$name === undefined ? "repository" : _ref$name,
        _ref$ctor = _ref.ctor,
        ctor = _ref$ctor === undefined ? null : _ref$ctor;

    _classCallCheck(this, Repository);

    this.templates = {};
    this.randomTemplates = {};
    this.ctor = ctor;
  }

  _createClass(Repository, [{
    key: "define",
    value: function define(template) {
      this.templates[template.name] = template;
      if (!template.disableRandomCreation) {
        this.randomTemplates[template.name] = template;
      }
    }
  }, {
    key: "create",
    value: function create(name) {
      var template = this.templates[name];
      if (!template) {
        throw new Error("no template named " + name);
      }
      if (template) {
        return new this.ctor(template);
      }
    }
  }, {
    key: "maybeCreateRandom",
    value: function maybeCreateRandom(rank, probability) {
      if (Math.random() < probability) {
        return this.createRandom(rank);
      }
    }
  }, {
    key: "createRandom",
    value: function createRandom(rank) {
      var _this = this;

      var weightMap = Object.keys(this.randomTemplates).reduce(function (obj, template) {
        var item = _this.randomTemplates[template];
        if (rank && item.rank <= rank || !rank) {
          obj[template] = item.rngWeight || 1;
        }
        return obj;
      }, {});
      var item = _rotJs2.default.RNG.getWeightedValue(weightMap);
      if (item) {
        return this.create(item);
      }
    }
  }]);

  return Repository;
}();

exports.default = Repository;
},{"rot-js":33}],29:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dynamicGlyph = require("../dynamicGlyph");

var _dynamicGlyph2 = _interopRequireDefault(_dynamicGlyph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = function (_DynamicGlyph) {
  _inherits(Item, _DynamicGlyph);

  function Item(_ref) {
    var _ref$name = _ref.name,
        name = _ref$name === undefined ? "item" : _ref$name,
        _ref$canPickUp = _ref.canPickUp,
        canPickUp = _ref$canPickUp === undefined ? true : _ref$canPickUp,
        _ref$description = _ref.description,
        description = _ref$description === undefined ? "" : _ref$description,
        _ref$rank = _ref.rank,
        rank = _ref$rank === undefined ? 1 : _ref$rank;

    _classCallCheck(this, Item);

    var _this = _possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));

    _this.rank = rank;
    _this.name = name;
    _this.canPickUp = canPickUp;
    _this.description = description;
    return _this;
  }

  return Item;
}(_dynamicGlyph2.default);

exports.default = Item;
},{"../dynamicGlyph":26}],11:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openDoorTile = exports.closedDoorTile = exports.wallTile = exports.floorTile = exports.stairsDownTile = exports.stairsUpTile = undefined;

var _glyph = require("./glyph");

var _glyph2 = _interopRequireDefault(_glyph);

var _colors = require("./colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = function (_Glyph) {
  _inherits(Tile, _Glyph);

  function Tile(_ref) {
    var _ref$isWalkable = _ref.isWalkable,
        isWalkable = _ref$isWalkable === undefined ? false : _ref$isWalkable,
        _ref$blocksLight = _ref.blocksLight,
        blocksLight = _ref$blocksLight === undefined ? false : _ref$blocksLight;

    _classCallCheck(this, Tile);

    var _this = _possibleConstructorReturn(this, (Tile.__proto__ || Object.getPrototypeOf(Tile)).apply(this, arguments));

    _this.isWalkable = isWalkable;
    _this.blocksLight = blocksLight;
    return _this;
  }

  return Tile;
}(_glyph2.default);

var stairsUpTile = exports.stairsUpTile = new Tile({
  char: "<",
  fg: _colors2.default.gray,
  isWalkable: true
});

var stairsDownTile = exports.stairsDownTile = new Tile({
  char: ">",
  fg: _colors2.default.gray,
  isWalkable: true
});

var floorTile = exports.floorTile = new Tile({
  char: ".",
  fg: _colors2.default.darkGray,
  isWalkable: true
});

var wallTile = exports.wallTile = new Tile({
  char: "#",
  fg: _colors2.default.brown,
  blocksLight: true
});

var closedDoorTile = exports.closedDoorTile = new Tile({
  char: "+",
  fg: _colors2.default.peach,
  blocksLight: true,
  isWalkable: false
});

var openDoorTile = exports.openDoorTile = new Tile({
  char: "-",
  fg: _colors2.default.peach,
  blocksLight: false,
  isWalkable: true
});
},{"./glyph":25,"./colors":4}],30:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fireable = exports.StatusBooster = exports.Equippable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require("../game");

var _game2 = _interopRequireDefault(_game);

var _tile = require("../tile");

var _colors = require("../colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Equippable = exports.Equippable = function Equippable(_ref) {
  var _ref$attackValue = _ref.attackValue,
      attackValue = _ref$attackValue === undefined ? 0 : _ref$attackValue,
      _ref$defenseValue = _ref.defenseValue,
      defenseValue = _ref$defenseValue === undefined ? 0 : _ref$defenseValue,
      _ref$sightBoost = _ref.sightBoost,
      sightBoost = _ref$sightBoost === undefined ? 0 : _ref$sightBoost,
      _ref$inventoryBoost = _ref.inventoryBoost,
      inventoryBoost = _ref$inventoryBoost === undefined ? 0 : _ref$inventoryBoost,
      _ref$wieldable = _ref.wieldable,
      wieldable = _ref$wieldable === undefined ? false : _ref$wieldable,
      _ref$wearable = _ref.wearable,
      wearable = _ref$wearable === undefined ? false : _ref$wearable;

  _classCallCheck(this, Equippable);

  this.attackValue = attackValue;
  this.defenseValue = defenseValue;
  this.wieldable = wieldable;
  this.wearable = wearable;
  this.sightBoost = sightBoost;
  this.inventoryBoost = inventoryBoost;
  this.name = "Equippable";
};

var StatusBooster = exports.StatusBooster = function () {
  function StatusBooster(_ref2) {
    var _ref2$hpUp = _ref2.hpUp,
        hpUp = _ref2$hpUp === undefined ? 0 : _ref2$hpUp,
        _ref2$statusEffect = _ref2.statusEffect,
        statusEffect = _ref2$statusEffect === undefined ? null : _ref2$statusEffect,
        _ref2$weaponRecharge = _ref2.weaponRecharge,
        weaponRecharge = _ref2$weaponRecharge === undefined ? 0 : _ref2$weaponRecharge,
        _ref2$maxHpUp = _ref2.maxHpUp,
        maxHpUp = _ref2$maxHpUp === undefined ? 0 : _ref2$maxHpUp;

    _classCallCheck(this, StatusBooster);

    this.name = "StatusBooster";
    this.groupName = "Usable";
    this.hpUp = hpUp;
    this.maxHpUp = maxHpUp;
    this.weaponRecharge = weaponRecharge;
    this.use = this._use;
    this.statusEffect = statusEffect;
  }

  _createClass(StatusBooster, [{
    key: "_use",
    value: function _use(entity) {
      if (entity.weapon && entity.weapon.charges) {
        entity.weapon.recharge(this.weaponRecharge);
        return true;
      }
      if (this.hpUp) {
        if (this.hpUp >= 0) {
          entity.addHp(this.hpUp);
        } else {
          _game2.default.messageDisplay.add({ color: "red", text: "ouch" });
          entity.takeDamage(-this.hpUp, _colors2.default.darkPurple);
        }
        entity.addMaxHp(this.maxHpUp);
        return true;
      }
      if (this.statusEffect) {
        entity.addTimedStatusEffect(Object.assign({}, this.statusEffect));
        return true;
      }
      return false;
    }
  }]);

  return StatusBooster;
}();

var Fireable = exports.Fireable = function () {
  function Fireable(_ref3) {
    var _ref3$chargesPerShot = _ref3.chargesPerShot,
        chargesPerShot = _ref3$chargesPerShot === undefined ? 1 : _ref3$chargesPerShot,
        charges = _ref3.charges,
        _ref3$maxCharges = _ref3.maxCharges,
        maxCharges = _ref3$maxCharges === undefined ? 20 : _ref3$maxCharges,
        _ref3$rangeDamage = _ref3.rangeDamage,
        rangeDamage = _ref3$rangeDamage === undefined ? 10 : _ref3$rangeDamage,
        _ref3$blastRadius = _ref3.blastRadius,
        blastRadius = _ref3$blastRadius === undefined ? 0 : _ref3$blastRadius;

    _classCallCheck(this, Fireable);

    this.name = "Fireable";
    this.maxCharges = maxCharges;
    this.charges = charges || this.maxCharges;
    this.rangeDamage = rangeDamage;
    this.recharge = this._recharge;
    this.fire = this._fire;
    this.blastRadius = blastRadius;
    this.chargesPerShot = chargesPerShot;
  }

  _createClass(Fireable, [{
    key: "_recharge",
    value: function _recharge(charges) {
      this.charges = Math.min(this.charges + charges, this.maxCharges);
    }
  }, {
    key: "_fire",
    value: function _fire(targetObj) {
      var _this = this;

      if (this.charges - this.chargesPerShot < 0) {
        if (targetObj.coords[0].name == "ME") {
          _game2.default.messageDisplay.add({
            color: "blue",
            text: "Your weapon does not have enough charges to fire"
          });
        }
        return false;
      }
      this.charges -= this.chargesPerShot;
      console.log(this.charges);
      var targetArray = targetObj.coords;
      var displayArray = [];

      var _loop = function _loop(i) {
        var target = targetArray[i];
        var shooter = targetArray[0];
        if (targetArray[i] && (targetArray[i].blocksLight || targetArray[i].constructor.name == "Entity")) {
          if (_this.blastRadius > 0) {
            // cause explosion
            var explosionDisplay = [];
            var level = _game2.default.currentScreen.gameWorld.currentLevel;
            var area = level.getSurroundingTiles(target.x, target.y, _this.blastRadius);
            area.forEach(function (tile) {
              if (tile.tile) {
                explosionDisplay.push(tile.x + "," + tile.y);
                if (tile.tile.blocksLight || tile.tile == _tile.openDoorTile) {
                  level.map.setTile(tile.x, tile.y, _tile.floorTile);
                }
              } else if (tile.hasMixin && tile.hasMixin("Destructible")) {
                var attack = _this.rangeDamage;
                var defense = tile.getDefenseValue();
                var damage = Math.max(attack - defense, 0);
                if (shooter.name == "ME" && tile.name !== "ME") {
                  _game2.default.messageDisplay.add({
                    color: "white",
                    text: "The " + tile.name + " is caught in the explosion for " + damage + " damage."
                  });
                  tile.takeDamage(damage, _colors2.default.orange);
                } else if (tile.name == "ME") {
                  _game2.default.messageDisplay.add({
                    color: "red",
                    text: "You are caught in the explosion!  Ouch!"
                  });
                  tile.takeDamage(damage, _colors2.default.orange);
                }
              }
            });
            _game2.default.explosionDisplay = explosionDisplay;
            return "break";
          }
          if (target.hasMixin && target.hasMixin("Destructible")) {
            var attack = _this.rangeDamage;
            var defense = target.getDefenseValue();
            var damage = Math.max(attack - defense, 0);
            if (shooter.name == "ME") {
              _game2.default.messageDisplay.add({
                color: "white",
                text: "You hit the " + target.name + " for " + damage + " damage."
              });
              target.takeDamage(damage, _this.fg);
              return "break";
            } else if (target.name == "ME") {
              _game2.default.messageDisplay.add({
                color: "red",
                text: "The " + shooter.name + " shoots you for " + damage + " damage!"
              });
              target.takeDamage(damage, _this.fg);
              return "break";
            } else {
              target.takeDamage(damage, _this.fg);
            }
          }
          return "break";
        } else if (!target.blocksLight) {
          displayArray.push(target.x + "," + target.y);
        } else {
          return "break";
        }
      };

      for (var i = 1; i < targetArray.length; i++) {
        var _ret = _loop(i);

        if (_ret === "break") break;
      }
      return { coords: displayArray, xMod: targetObj.xMod, yMod: targetObj.yMod };
    }
  }]);

  return Fireable;
}();
},{"../game":3,"../tile":11,"../colors":4}],22:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WeaponRepository = exports.ArmorRepository = exports.ItemRepository = undefined;

var _repository = require("../repository");

var _repository2 = _interopRequireDefault(_repository);

var _colors = require("../colors");

var _colors2 = _interopRequireDefault(_colors);

var _item = require("./item");

var _item2 = _interopRequireDefault(_item);

var _itemMixins = require("./itemMixins");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ItemRepository = exports.ItemRepository = new _repository2.default({ name: "Items", ctor: _item2.default });

ItemRepository.define({
  name: "med pack",
  description: "Will restore a small amount of health.  Single use.",
  char: "†",
  fg: _colors2.default.pink,
  hpUp: 10,
  rngWeight: 10,
  rank: 1,
  mixins: [_itemMixins.StatusBooster]
});

ItemRepository.define({
  name: "health generator",
  description: "Using this item will increase you maxHP by 15 points, but installing it hurts and will decrease your health points by 15.. you might want to have a medpack handy.",
  fg: _colors2.default.orange,
  char: "‡",
  hpUp: -15,
  maxHpUp: 10,
  rngWeight: 3,
  rank: 3,
  mixins: [_itemMixins.StatusBooster]
});

ItemRepository.define({
  name: "big med pack",
  description: "Will restore a moderate amount of health.  Single use.",
  char: "†",
  fg: _colors2.default.red,
  hpUp: 25,
  rngWeight: 5,
  rank: 2,
  mixins: [_itemMixins.StatusBooster]
});

ItemRepository.define({
  name: "blaster charges",
  description: "Will add 50 charges the wielded weapon.  Single use.",
  weaponRecharge: 50,
  char: "*",
  fg: _colors2.default.blue,
  rngWeight: 5,
  rank: 1,
  mixins: [_itemMixins.StatusBooster]
});

ItemRepository.define({
  name: "strength stim syringe",
  description: "A syringe filled with a thick, dark liquid.  Will temporarily increase your strength. May reduce HP.",
  char: "!",
  fg: _colors2.default.darkPurple,
  hpDown: 3,
  rngWeight: 5,
  rank: 1,
  statusEffect: {
    property: "strength",
    value: 10,
    label: "Strength boost",
    timer: 25
  },
  mixins: [_itemMixins.StatusBooster]
});

ItemRepository.define({
  name: "speed-boost syringe",
  description: "A syringe filled with a dark liquid that smells of coffee.  Will temporarily increase your speed.",
  char: "!",
  fg: _colors2.default.darkGreen,
  rank: 1,
  rngWeight: 5,
  statusEffect: {
    property: "speed",
    value: 1000,
    label: "Speed boost",
    timer: 25
  },
  mixins: [_itemMixins.StatusBooster]
});

ItemRepository.define({
  name: "armor-boost syringe",
  description: "No clue how this tech is supposed to work.. but shooting this baby up will temporarily increase your defense value.  It's a game, get over it.",
  char: "!",
  fg: _colors2.default.darkGreen,
  rngWeight: 5,
  rank: 1,
  statusEffect: {
    property: "defense",
    value: 10,
    label: "Armor boost",
    timer: 25
  },
  mixins: [_itemMixins.StatusBooster]
});

ItemRepository.define({
  name: "Space Ship",
  char: "§",
  description: "Your personal mining rig, large enough for one person and a handful of tools. Equipped with heavy blasters meant for breaking rock.",
  fg: _colors2.default.blue,
  canPickUp: false,
  disableRandomCreation: true
});

ItemRepository.define({
  name: "keys",
  char: '"',
  description: "Your keys!  You can't get off this rock without them!",
  fg: _colors2.default.blue,
  disableRandomCreation: true
});

var ArmorRepository = exports.ArmorRepository = new _repository2.default({ name: "Items", ctor: _item2.default });

ArmorRepository.define({
  name: "backpack",
  description: "Increases your inventory size and provides a teeny-tiny amount of defense, might slow you down a bit though.",
  char: "[",
  fg: _colors2.default.blue,
  wearable: true,
  defenseValue: 2,
  inventoryBoost: 5,
  rngWeight: 3,
  mixins: [_itemMixins.Equippable]
});

ArmorRepository.define({
  name: "night-vision goggles",
  char: "[",
  fg: _colors2.default.green,
  description: "Increases your sight-radius while worn, and offers a small amount of protection. Could be useful in these caverns.",
  wearable: true,
  sightBoost: 8,
  defenseValue: 3,
  rngWeight: 5,
  mixins: [_itemMixins.Equippable]
});

ArmorRepository.define({
  name: "techno chain mail shirt",
  char: "[",
  fg: _colors2.default.indigo,
  description: "Huh... why do these aliens have bits of armor just randomly strewn about their weirdo cave system?  No matter, I guess I'll take the defense boost.",
  wearable: true,
  defenseValue: 8,
  rngWeight: 1,
  mixins: [_itemMixins.Equippable]
});

ArmorRepository.define({
  name: "Plate mail",
  char: "[",
  fg: _colors2.default.indigo,
  description: "What is this? Dungeons and Dragons?  Whatever.",
  wearable: true,
  defenseValue: 12,
  rngWeight: 1,
  mixins: [_itemMixins.Equippable]
});

ArmorRepository.define({
  name: "Sparkley helmet",
  char: "[",
  fg: _colors2.default.indigo,
  description: "Looks like it will provide a lot of protection for your noggin.",
  wearable: true,
  defenseValue: 8,
  rngWeight: 1,
  mixins: [_itemMixins.Equippable]
});

ArmorRepository.define({
  name: "Leathery vest",
  char: "[",
  fg: _colors2.default.brown,
  description: "Let's not think about what this is actually made of.. just put it on.",
  wearable: true,
  defenseValue: 5,
  rngWeight: 4,
  mixins: [_itemMixins.Equippable]
});

ArmorRepository.define({
  name: "Arm Guards",
  char: "[",
  fg: _colors2.default.darkGreen,
  description: "Moderate protection for yer arms.",
  wearable: true,
  defenseValue: 5,
  rngWeight: 4,
  mixins: [_itemMixins.Equippable]
});

ArmorRepository.define({
  name: "A shirt",
  char: "[",
  fg: _colors2.default.darkBlue,
  description: "You're already wearing a shirt.. but dressing in layers might help.",
  wearable: true,
  defenseValue: 2,
  rngWeight: 5,
  mixins: [_itemMixins.Equippable]
});

var WeaponRepository = exports.WeaponRepository = new _repository2.default({ name: "Weapons", ctor: _item2.default });

WeaponRepository.define({
  name: "crowbar",
  char: "(",
  description: "Not the best weapon, but it'll get the job done.",
  fg: _colors2.default.blue,
  wieldable: true,
  attackValue: 5,
  mixins: [_itemMixins.Equippable]
});

WeaponRepository.define({
  name: "hammer",
  char: "(",
  description: "Not the best weapon, but it'll get the job done.",
  fg: _colors2.default.gray,
  wieldable: true,
  attackValue: 3,
  rank: 1,
  mixins: [_itemMixins.Equippable]
});

WeaponRepository.define({
  name: "monkey wrench",
  char: "(",
  description: "Heavy, rusty, not particularly useful as a tool anymore--but if you need to bash someone's brains in....",
  fg: _colors2.default.gray,
  wieldable: true,
  attackValue: 3,
  rank: 1,
  mixins: [_itemMixins.Equippable]
});

WeaponRepository.define({
  name: "lazer sword",
  char: "(",
  description: "Now we're talking, this thing will really mess up some aliens.",
  fg: _colors2.default.pink,
  wieldable: true,
  attackValue: 15,
  rank: 2,
  mixins: [_itemMixins.Equippable]
});

WeaponRepository.define({
  name: "pocket knife",
  description: "Old trusty pocket knife.. it's not worth much, but it's better than bare hands.",
  char: ")",
  fg: _colors2.default.brown,
  wieldable: true,
  attackValue: 3,
  rank: 1,
  mixins: [_itemMixins.Equippable]
});

WeaponRepository.define({
  name: "small blaster",
  char: "┌",
  description: "doesn't pack much punch, but only costs 1 charge to shoot... not bad!",
  fg: _colors2.default.green,
  wieldable: true,
  maxCharges: 30,
  chargesPerShot: 1,
  attackValue: 0,
  rangeDamage: 4,
  rank: 1,
  mixins: [_itemMixins.Equippable, _itemMixins.Fireable]
});

WeaponRepository.define({
  name: "turret blaster",
  char: "┌",
  description: "a blaster ripped off of a turret",
  fg: _colors2.default.darkPurple,
  wieldable: true,
  maxCharges: 30,
  chargesPerShot: 5,
  attackValue: 0,
  rangeDamage: 6,
  rank: 1,
  mixins: [_itemMixins.Equippable, _itemMixins.Fireable]
});

WeaponRepository.define({
  name: "mean blaster",
  char: "┌",
  description: "Holds 30 charges, takes 5 to shoot... but packs a mean punch",
  fg: _colors2.default.blue,
  wieldable: true,
  maxCharges: 30,
  chargesPerShot: 5,
  attackValue: 0,
  rangeDamage: 15,
  rank: 2,
  mixins: [_itemMixins.Equippable, _itemMixins.Fireable]
});

WeaponRepository.define({
  name: "light plasma cannon",
  char: "┌",
  description: "Uses up 10 charges per shot. This one really leaves a mark.",
  fg: _colors2.default.red,
  wieldable: true,
  maxCharges: 50,
  chargesPerShot: 10,
  attackValue: 0,
  blastRadius: 1,
  rangeDamage: 25,
  rank: 2,
  mixins: [_itemMixins.Equippable, _itemMixins.Fireable]
});

WeaponRepository.define({
  name: "heavy plasma cannon",
  char: "┌",
  description: "stand back",
  fg: _colors2.default.white,
  wieldable: true,
  maxCharges: 150,
  chargesPerShot: 25,
  attackValue: 0,
  blastRadius: 2,
  rangeDamage: 20,
  rank: 2,
  mixins: [_itemMixins.Equippable, _itemMixins.Fireable]
});
},{"../repository":27,"../colors":4,"./item":29,"./itemMixins":30}],31:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimedStatusEffects = exports.Equipper = exports.Attacker = exports.Movable = exports.MonsterActor = exports.InventoryHolder = exports.TaskActor = exports.Sight = exports.Destructible = exports.PlayerActor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _colors = require("../colors");

var _colors2 = _interopRequireDefault(_colors);

var _confirmation = require("../screens/confirmation");

var _confirmation2 = _interopRequireDefault(_confirmation);

var _tile = require("../tile");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerActor = exports.PlayerActor = function () {
  function PlayerActor() {
    _classCallCheck(this, PlayerActor);

    this.name = "PlayerActor";
    this.groupName = "Actor";
    this.act = this._act;
  }

  _createClass(PlayerActor, [{
    key: "_act",
    value: function _act() {
      var Game = this.getGame();
      this.incrementTimedStatusEffects();
      Game.refresh();
      Game.getEngine().lock();
    }
  }]);

  return PlayerActor;
}();

var Destructible = exports.Destructible = function () {
  function Destructible(_ref) {
    var _ref$maxHp = _ref.maxHp,
        maxHp = _ref$maxHp === undefined ? 10 : _ref$maxHp,
        hp = _ref.hp,
        _ref$defenseValue = _ref.defenseValue,
        defenseValue = _ref$defenseValue === undefined ? 0 : _ref$defenseValue;

    _classCallCheck(this, Destructible);

    this.name = "Destructible";
    this.maxHp = maxHp;
    this.hp = hp || this.maxHp;
    this.defenseValue = defenseValue;
    this.takeDamage = this._takeDamage;
    this.addHp = this._addHp;
    this.addMaxHp = this._addMaxHp;
    this.getDefenseValue = this._getDefenseValue;
    this.hit = false;
  }

  _createClass(Destructible, [{
    key: "_getDefenseValue",
    value: function _getDefenseValue() {
      var mod = 0;
      if (this.hasMixin("TimedStatusEffects")) {
        this.getTimedStatusEffects().forEach(function (s) {
          if (s.property == "defense") {
            mod += s.value;
          }
        });
      }
      if (this.armor) {
        this.armor.forEach(function (a) {
          mod += a.defenseValue;
        });
      }
      return this.defenseValue + mod;
    }
  }, {
    key: "_addHp",
    value: function _addHp(value) {
      this.hp = Math.min(this.hp + value, this.maxHp);
    }
  }, {
    key: "_addMaxHp",
    value: function _addMaxHp(value) {
      this.maxHp += value;
    }
  }, {
    key: "_takeDamage",
    value: function _takeDamage(damage) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _colors2.default.red;

      this.hp -= damage;
      this.hit = color;
      if (this.hp <= 0) {
        if (this.hasMixin("PlayerActor")) {
          this.game.messageDisplay.add({ text: "You DIE", color: "red" });
        } else {
          this.game.messageDisplay.add({
            color: "white",
            text: "You kill the " + this.name + "."
          });
        }
        this.kill();
        if (this.hasMixin("InventoryHolder")) {
          // drop items
          if (this.inventory.filter(function (i) {
            return i;
          }).length) {
            this.level.setItemsAt(this.getX(), this.getY(), this.inventory);
          }
        }
      }
    }
  }]);

  return Destructible;
}();

var Sight = exports.Sight = function () {
  function Sight(_ref2) {
    var _ref2$sightRadius = _ref2.sightRadius,
        sightRadius = _ref2$sightRadius === undefined ? 15 : _ref2$sightRadius;

    _classCallCheck(this, Sight);

    this.name = "Sight";
    this.sightRadius = sightRadius;
    this.canSee = this._canSee;
    this.getSightRadius = this._getSightRadius;
    this.getVisible = this._getVisible;
  }

  _createClass(Sight, [{
    key: "_getSightRadius",
    value: function _getSightRadius() {
      var mod = 0;
      if (this.hasMixin("TimedStatusEffects")) {
        this.getTimedStatusEffects().forEach(function (s) {
          if (s.property == "sight") {
            mod += s.value;
          }
        });
      }

      if (this.armor) {
        this.armor.forEach(function (a) {
          mod += a.sightBoost;
        });
      }

      return this.sightRadius + mod;
    }
  }, {
    key: "_getVisible",
    value: function _getVisible() {
      var _this = this;

      var fov = new _rotJs2.default.FOV.PreciseShadowcasting(function (x, y) {
        if (_this.game.currentScreen.level.map.getTile(x, y)) {
          return !_this.game.currentScreen.map.getTile(x, y).blocksLight;
        }
        return false;
      });
      var visibleTiles = {};

      fov.compute(this.getX(), this.getY(), this.sightRadius, function (x, y, radius, visibility) {
        visibleTiles[x + "," + y] = true;
      });
      var entitiesItems = [];
      Object.keys(visibleTiles).forEach(function (tile) {
        var xy = tile.split(",");
        var entity = _this.game.currentScreen.level.getEntityAt(xy[0], xy[1]);
        var items = _this.game.currentScreen.level.getItemsAt(xy[0], xy[1]);
        if (entity) {
          entitiesItems.push(entity);
        }
        if (items && items.length) {
          entitiesItems.push.apply(entitiesItems, _toConsumableArray(items));
        }
      });
      return entitiesItems.filter(function (x) {
        return x.name !== "ME";
      });
    }
  }, {
    key: "_canSee",
    value: function _canSee(entity) {
      var _this2 = this;

      var otherX = entity.getX();
      var otherY = entity.getY();
      if ((otherX - this.getX()) * (otherX - this.getX()) + (otherY - this.getY()) * (otherY - this.getY()) > this.sightRadius * this.sightRadius) {
        return false;
      }
      var found = false;
      var fov = new _rotJs2.default.FOV.PreciseShadowcasting(function (x, y) {
        if (_this2.level.map.getTile(x, y)) {
          return !_this2.level.map.getTile(x, y).blocksLight;
        }
        return false;
      });

      fov.compute(this.getX(), this.getY(), this.sightRadius, function (x, y, radius, visibility) {
        if (x === otherX && y === otherY) {
          found = true;
        }
      });
      return found;
      return true;
    }
  }]);

  return Sight;
}();

var TaskActor = exports.TaskActor = function () {
  function TaskActor(_ref3) {
    var _ref3$tasks = _ref3.tasks,
        tasks = _ref3$tasks === undefined ? ["hunt", "wander"] : _ref3$tasks;

    _classCallCheck(this, TaskActor);

    this.huntingTarget = null;
    this.tasks = tasks;
    this.name = "TaskActor";
    this.groupName = "Actor";
    this.act = this._act;
    this.canDoTask = this._canDoTask;
    this.wander = this._wander;
    this.hunt = this._hunt;
    this.flee = this._flee;
    this.shoot = this._shoot;
  }

  _createClass(TaskActor, [{
    key: "_act",
    value: function _act() {
      if (this.level.gameWorld.currentLevel !== this.level) {
        return false;
      }
      for (var i = 0; i < this.tasks.length; i++) {
        var task = this.tasks[i];
        if (this.canDoTask(task)) {
          this[task]();
          break;
        }
      }
    }
  }, {
    key: "_canDoTask",
    value: function _canDoTask(task) {
      if (task === "hunt") {
        return this.hasMixin("Sight") && (this.canSee(this.getLevel().player) || this.huntingTarget);
      } else if (task === "shoot") {
        var player = this.getLevel().player;
        var xOffset = this.getX() - player.getX();
        var yOffset = this.getY() - player.getY();
        if (this.canSee(player)) {
          if (Math.abs(xOffset) == Math.abs(yOffset) || xOffset == 0 || yOffset == 0) {
            return true;
          }
        }
        return false;
      } else if (task === "flee") {
        var _player = this.getLevel().player;
        var otherX = _player.getX();
        var otherY = _player.getY();
        if ((otherX - this.getX()) * (otherX - this.getX()) + (otherY - this.getY()) * (otherY - this.getY()) < 9) {
          return true;
        }
        return false;
      } else if (task === "wander") {
        return true;
      } else {
        throw new Error("tried to perform undefined task");
      }
    }
  }, {
    key: "_shoot",
    value: function _shoot() {
      var player = this.getLevel().player;
      var xOffset = this.getX() - player.getX();
      var yOffset = this.getY() - player.getY();
      var dX = xOffset == 0 ? 0 : xOffset > 0 ? -1 : 1;
      var dY = yOffset == 0 ? 0 : yOffset > 0 ? -1 : 1;
      var fireArray = this.getLevel().lookInDirection(dX, dY, this);
      var rangeDisplayArray = this.weapon.fire(fireArray);
      if (rangeDisplayArray) {
        this.game.rangeWeaponDisplay = Object.assign(rangeDisplayArray, {
          color: this.weapon.fg
        });
      }
    }
  }, {
    key: "_flee",
    value: function _flee() {
      var player = this.getLevel().player;
      var xOffset = this.getX() - player.getX();
      var yOffset = this.getY() - player.getY();
      var dX = xOffset == 0 ? 0 : xOffset > 0 ? 1 : -1;
      var dY = yOffset == 0 ? 0 : yOffset > 0 ? 1 : -1;
      this.tryMove(this.getX() + dX, this.getY() + dY, this.getLevel());
    }
  }, {
    key: "_hunt",
    value: function _hunt() {
      var player = this.getLevel().player;
      var offsets = Math.abs(player.getX() - this.getX()) + Math.abs(player.getY() - this.getY());
      if (offsets === 1 && this.hasMixin("Attacker")) {
        this.attack(player);
        return;
      }

      if (this.canSee(player)) {
        this.huntingTarget = { x: player.getX(), y: player.getY() };
      }

      var source = this;
      var path = new _rotJs2.default.Path.AStar(this.huntingTarget.x, this.huntingTarget.y, function (x, y) {
        var entity = source.getLevel().getEntityAt(x, y);
        if (entity && entity !== player && entity !== source) {
          return false;
        }
        return source.getLevel().getMap().getTile(x, y).isWalkable;
      });
      var count = 0;
      path.compute(source.getX(), source.getY(), function (x, y) {
        if (count == 1) {
          source.tryMove(x, y, source.getLevel());
        }
        count++;
      });
    }
  }, {
    key: "_wander",
    value: function _wander() {
      var dX = Math.floor(Math.random() * 3) - 1;
      var dY = Math.floor(Math.random() * 3) - 1;
      if (this.level.player) {
        this.tryMove(this.getX() + dX, this.getY() + dY, this.getLevel());
      }
    }
  }]);

  return TaskActor;
}();

var InventoryHolder = exports.InventoryHolder = function () {
  function InventoryHolder(_ref4) {
    var _ref4$inventorySize = _ref4.inventorySize,
        inventorySize = _ref4$inventorySize === undefined ? 8 : _ref4$inventorySize,
        _ref4$inventory = _ref4.inventory,
        inventory = _ref4$inventory === undefined ? [] : _ref4$inventory,
        _ref4$inventoryConstr = _ref4.inventoryConstructor,
        inventoryConstructor = _ref4$inventoryConstr === undefined ? null : _ref4$inventoryConstr;

    _classCallCheck(this, InventoryHolder);

    this.name = "InventoryHolder";
    this.inventorySize = inventorySize;
    this.inventory = inventory;
    this.addItem = this._addItem;
    this.removeItem = this._removeItem;
    this.hasItem = this._hasItem;
    this.getInventorySize = this._getInventorySize;
    if (inventoryConstructor) {
      this.inventory.push(inventoryConstructor());
    }
  }

  _createClass(InventoryHolder, [{
    key: "_getInventorySize",
    value: function _getInventorySize() {
      var mod = 0;
      if (this.armor) {
        this.armor.forEach(function (a) {
          mod += a.inventoryBoost;
        });
      }
      return this.inventorySize + mod;
    }
  }, {
    key: "_hasItem",
    value: function _hasItem(item) {
      return this.inventory.filter(function (i) {
        return i.name == item;
      }).length > 0;
    }
  }, {
    key: "_addItem",
    value: function _addItem(item) {
      var _this3 = this;

      if (this.inventory.length < this.getInventorySize()) {
        if (item.hasMixin("Fireable") && this.hasItem(item.name)) {
          var exitFunction = function exitFunction() {
            _this3.inventory.find(function (i) {
              return i.name == item.name;
            }).recharge(item.charges);
          };
          this.game.currentScreen.enterSubscreen(new _confirmation2.default("You already have one of those. Would you like to recharge your existing one(YES) or add it to your inventory(NO)?", exitFunction, function () {
            return _this3.inventory.push(item);
          }, this.game.currentScreen));
          return true;
        }
        this.inventory.push(item);
        return true;
      }
      this.game.messageDisplay.add({
        color: "blue",
        text: "Your inventory seems to be full!"
      });
      return false;
    }
  }, {
    key: "_removeItem",
    value: function _removeItem(itemToRemove) {
      this.unequip(itemToRemove);
      this.inventory = this.inventory.filter(function (item) {
        return item !== itemToRemove;
      });
    }
  }]);

  return InventoryHolder;
}();

var MonsterActor = exports.MonsterActor = function () {
  function MonsterActor() {
    _classCallCheck(this, MonsterActor);

    this.name = "MonsterActor";
    this.groupName = "Actor";
    this.act = this._act;
  }

  _createClass(MonsterActor, [{
    key: "_act",
    value: function _act() {
      var dX = Math.floor(Math.random() * 3) - 1;
      var dY = Math.floor(Math.random() * 3) - 1;
      if (this.level.player && this.canSee(this.level.player)) {
        this.tryMove(this.getX() + dX, this.getY() + dY, this.getLevel());
      }
    }
  }]);

  return MonsterActor;
}();

var Movable = exports.Movable = function () {
  function Movable() {
    _classCallCheck(this, Movable);

    this.name = "Movable";
    this.tryMove = this._tryMove;
  }

  _createClass(Movable, [{
    key: "_tryMove",
    value: function _tryMove(x, y, level) {
      var tile = level.getMap().getTile(x, y);

      var target = level.getEntityAt(x, y);
      if (target) {
        if (this.hasMixin("Attacker")) {
          this.attack(target);
        }
        return false;
      }

      if (tile.isWalkable) {
        this.setPosition(x, y);
        return true;
      }

      if (tile == _tile.closedDoorTile) {
        level.getMap().openDoor(x, y);
      }
      return false;
    }
  }]);

  return Movable;
}();

var Attacker = exports.Attacker = function () {
  function Attacker(_ref5) {
    var _ref5$strength = _ref5.strength,
        strength = _ref5$strength === undefined ? 1 : _ref5$strength;

    _classCallCheck(this, Attacker);

    this.name = "Attacker";
    this.strength = strength;
    this.attack = this._attack;
    this.getAttackValue = this._getAttackValue;
  }

  _createClass(Attacker, [{
    key: "_getAttackValue",
    value: function _getAttackValue() {
      var mod = 0;
      if (this.hasMixin("Equipper")) {
        if (this.weapon) {
          mod += this.weapon.attackValue;
        }
      }
      if (this.hasMixin("TimedStatusEffects")) {
        this.getTimedStatusEffects().forEach(function (s) {
          if (s.property == "strength") {
            mod += s.value;
          }
        });
      }
      return this.strength + mod;
    }
  }, {
    key: "_attack",
    value: function _attack(target) {
      var game = this.getGame();
      if (target.hasMixin("PlayerActor")) {
        var dieRoll = parseInt(Math.random() * 3) - 1;
        var attack = this.getAttackValue() + dieRoll;
        var defense = target.getDefenseValue();
        var damage = Math.max(attack - defense, 1);
        if (game) {
          game.messageDisplay.add({
            color: "red",
            text: "The " + this.name + " hits you for " + damage + " damage."
          });
        }
        target.takeDamage(damage);
      }
      if (this.hasMixin("PlayerActor") && target.hasMixin("Destructible")) {
        var _attack2 = this.getAttackValue();
        var _defense = target.getDefenseValue();
        var _damage = Math.max(_attack2 - _defense, 0);
        if (game && this.hasMixin("PlayerActor")) {
          game.messageDisplay.add({
            color: "white",
            text: "You hit the " + target.name + " for " + _damage + " damage."
          });
        }
        target.takeDamage(_damage);
      }
    }
  }]);

  return Attacker;
}();

var Equipper = exports.Equipper = function () {
  function Equipper(_ref6) {
    var _ref6$weapon = _ref6.weapon,
        weapon = _ref6$weapon === undefined ? null : _ref6$weapon,
        _ref6$armor = _ref6.armor,
        armor = _ref6$armor === undefined ? [] : _ref6$armor;

    _classCallCheck(this, Equipper);

    this.name = "Equipper";
    this.weapon = weapon;
    this.armor = armor;
    this.wield = this._wield;
    this.unwield = this._unwield;
    this.wear = this._wear;
    this.takeOff = this._takeOff;
    this.unequip = this._unequip;
    this.isWearing = this._isWearing;
    this.setup = this._setup;
  }

  _createClass(Equipper, [{
    key: "_setup",
    value: function _setup() {
      if (this.weapon === "inventory" && this.hasMixin("InventoryHolder")) {
        this.wield(this.inventory[0]);
      }
    }
  }, {
    key: "_isWearing",
    value: function _isWearing(item) {
      return this.armor.includes(item);
    }
  }, {
    key: "_wield",
    value: function _wield(weapon) {
      this.weapon = weapon;
    }
  }, {
    key: "_unwield",
    value: function _unwield() {
      this.weapon = null;
    }
  }, {
    key: "_wear",
    value: function _wear(armor) {
      this.armor.push(armor);
    }
  }, {
    key: "_takeOff",
    value: function _takeOff(item) {
      this.armor.splice(this.armor.indexOf(item), 1);
    }
  }, {
    key: "_unequip",
    value: function _unequip(item) {
      if (this.armor.includes(item)) {
        this.takeOff(item);
      }
      if (item === this.weapon) {
        this.unwield();
      }
    }
  }]);

  return Equipper;
}();

var TimedStatusEffects = exports.TimedStatusEffects = function () {
  function TimedStatusEffects() {
    _classCallCheck(this, TimedStatusEffects);

    this.name = "TimedStatusEffects";
    //array of objects
    // {property, label, value, timer}
    this.statusEffects = [
      // { property: "speed", label: "Speed up", value: 1000, timer: 135 }
    ];
    this.incrementTimedStatusEffects = this._incrementTimedStatusEffects;
    this.getTimedStatusEffects = this._getTimedStatusEffects;
    this.addTimedStatusEffect = this._addTimedStatusEffect;
  }

  _createClass(TimedStatusEffects, [{
    key: "_addTimedStatusEffect",
    value: function _addTimedStatusEffect(effect) {
      this.statusEffects.push(effect);
    }
  }, {
    key: "_getTimedStatusEffects",
    value: function _getTimedStatusEffects() {
      return this.statusEffects;
    }
  }, {
    key: "_incrementTimedStatusEffects",
    value: function _incrementTimedStatusEffects() {
      var _this4 = this;

      this.statusEffects.forEach(function (s) {
        s.timer -= 1;
        if (s.timer <= 0) {
          var i = _this4.statusEffects.indexOf(s);
          _this4.statusEffects.splice(i, 1);
        }
      });
    }
  }]);

  return TimedStatusEffects;
}();
},{"rot-js":33,"../colors":4,"../screens/confirmation":8,"../tile":11}],23:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnemyRepository = exports.PlayerTemplate = undefined;

var _colors = require("../colors");

var _colors2 = _interopRequireDefault(_colors);

var _repository = require("../repository");

var _repository2 = _interopRequireDefault(_repository);

var _entity = require("./entity");

var _entity2 = _interopRequireDefault(_entity);

var _items = require("../item/items");

var _entityMixins = require("./entityMixins");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayerTemplate = exports.PlayerTemplate = {
  name: "ME",
  char: "@",
  fg: _colors2.default.white,
  sightRadius: 6,
  strength: 6,
  maxHp: 50,
  mixins: [_entityMixins.PlayerActor, _entityMixins.Destructible, _entityMixins.Movable, _entityMixins.InventoryHolder, _entityMixins.Attacker, _entityMixins.Equipper, _entityMixins.Sight, _entityMixins.TimedStatusEffects]
};

var EnemyRepository = exports.EnemyRepository = new _repository2.default({
  name: "Enemies",
  ctor: _entity2.default
});

EnemyRepository.define({
  name: "Small Alien",
  description: "A small, slimy creature.  Has claws.  Looks mean.",
  char: "a",
  fg: _colors2.default.indigo,
  rank: 1,
  speed: 800,
  strength: 3,
  maxHp: 10,
  rngWeight: 10,
  inventoryConstructor: function inventoryConstructor() {
    return _items.ItemRepository.maybeCreateRandom(1, 0.5);
  },
  mixins: [_entityMixins.Movable, _entityMixins.InventoryHolder, _entityMixins.TaskActor, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});

// EnemyRepository.define({
//   name: "Thieving Alien",
//   char: "a",
//   fg: Colors.indigo,
//   speed: 800,
//   strength: 3,
//   maxHp: 10,
//   rngWeight: 10,
//   tasks: ["steal", "flee", "wander"],
//   mixins: [Movable, InventoryHolder, TaskActor, Destructible, Sight, Attacker]
// });

EnemyRepository.define({
  name: "Flying Insect",
  description: "BIG BUG.  Looks like a type of beetle, buzzes around near the top of the Cavern, swooping in to attack.  Moves faster than you.",
  char: "b",
  fg: _colors2.default.darkGreen,
  rank: 1,
  speed: 1500,
  strength: 2,
  maxHp: 8,
  sightRadius: 15,
  rngWeight: 7,
  mixins: [_entityMixins.Movable, _entityMixins.TaskActor, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});

EnemyRepository.define({
  name: "Big Alien",
  description: "A large, slimy thing with long claws and teeth.  It moves slow, but looks like it hits hard.",
  char: "A",
  fg: _colors2.default.pink,
  rank: 2,
  speed: 600,
  maxHp: 32,
  sightRadius: 10,
  strength: 7,
  rngWeight: 4,
  inventoryConstructor: function inventoryConstructor() {
    return _items.ItemRepository.maybeCreateRandom(3, 0.5);
  },
  mixins: [_entityMixins.Movable, _entityMixins.TaskActor, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});

EnemyRepository.define({
  name: "Tough Alien",
  description: "Slightly shorter than you, but rippling with muscles.  Maybe run?",
  char: "A",
  fg: _colors2.default.red,
  speed: 900,
  maxHp: 52,
  sightRadius: 10,
  strength: 16,
  rngWeight: 3,
  rank: 3,
  inventoryConstructor: function inventoryConstructor() {
    return _items.WeaponRepository.createRandom();
  },
  mixins: [_entityMixins.Movable, _entityMixins.TaskActor, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});

EnemyRepository.define({
  name: "Shooter",
  char: "s",
  description: "IT HAS A GUN.  Seems to flee when you get close, but takes a shot when it gets a chance... taking that gun might be handy though.",
  fg: _colors2.default.orange,
  speed: 1000,
  maxHp: 15,
  sightRadius: 10,
  strength: 3,
  rngWeight: 4,
  rank: 2,
  tasks: ["shoot", "flee", "wander"],
  inventoryConstructor: function inventoryConstructor() {
    return _items.WeaponRepository.create("small blaster");
  },
  weapon: "inventory",
  mixins: [_entityMixins.Movable, _entityMixins.TaskActor, _entityMixins.Equipper, _entityMixins.InventoryHolder, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});

EnemyRepository.define({
  name: "Turret",
  char: "t",
  description: "Stationary, but strangely organic looking.  It's blaster is weak but persistent.",
  fg: _colors2.default.darkPurple,
  speed: 1400,
  maxHp: 15,
  sightRadius: 10,
  strength: 3,
  rngWeight: 4,
  rank: 1,
  tasks: ["shoot"],
  inventoryConstructor: function inventoryConstructor() {
    return _items.WeaponRepository.create("turret blaster");
  },
  weapon: "inventory",
  mixins: [_entityMixins.Movable, _entityMixins.TaskActor, _entityMixins.Equipper, _entityMixins.InventoryHolder, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});

EnemyRepository.define({
  name: "Bomber",
  char: "S",
  description: "small buggy looking critter with some sort of plasma cannon.",
  fg: _colors2.default.red,
  speed: 800,
  maxHp: 25,
  sightRadius: 10,
  strength: 3,
  rngWeight: 2,
  rank: 3,
  tasks: ["shoot", "flee", "wander"],
  inventoryConstructor: function inventoryConstructor() {
    return _items.WeaponRepository.create("light plasma cannon");
  },
  weapon: "inventory",
  mixins: [_entityMixins.Movable, _entityMixins.TaskActor, _entityMixins.Equipper, _entityMixins.InventoryHolder, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});

EnemyRepository.define({
  name: "Alien with huge gun",
  description: "seems weak.. like you could just kick it over.  Or maybe it's the huge cannon it's manuvering that makes it look small.",
  char: "s",
  fg: _colors2.default.pink,
  speed: 500,
  maxHp: 25,
  sightRadius: 10,
  strength: 3,
  rngWeight: 1,
  rank: 4,
  tasks: ["shoot", "flee", "wander"],
  inventoryConstructor: function inventoryConstructor() {
    return _items.WeaponRepository.create("heavy plasma cannon");
  },
  weapon: "inventory",
  mixins: [_entityMixins.Movable, _entityMixins.TaskActor, _entityMixins.Equipper, _entityMixins.InventoryHolder, _entityMixins.Destructible, _entityMixins.Sight, _entityMixins.Attacker]
});
},{"../colors":4,"../repository":27,"./entity":13,"../item/items":22,"./entityMixins":31}],32:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _tile = require("./tile");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DungeonMap = function () {
  function DungeonMap(_ref) {
    var _this = this;

    var _ref$width = _ref.width,
        width = _ref$width === undefined ? 40 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === undefined ? 20 : _ref$height,
        Game = _ref.Game;

    _classCallCheck(this, DungeonMap);

    this.game = Game;
    this.width = width;
    this.height = height;
    this.tiles = new Array(width);

    for (var w = 0; w < width; w++) {
      this.tiles[w] = new Array(height);
    }

    var maxRoomWidth = Math.random() > 0.3 ? 10 : 22;
    var maxRoomHeight = maxRoomWidth !== 32 && Math.random() > 0.8 ? 22 : 12;

    var generator = new _rotJs2.default.Map.Digger(width, height, {
      roomWidth: [6, maxRoomWidth],
      roomHeight: [6, maxRoomHeight],
      dugPercentage: 0.3
    });

    generator.create(function (x, y, value) {
      this.tiles[x][y] = value == 1 ? _tile.wallTile : _tile.floorTile;
    }.bind(this));
    this.rooms = generator.getRooms();
    this.rooms.forEach(function (room, i) {
      room.getDoors(function (x, y) {
        _this.tiles[x][y] = i == 0 ? _tile.closedDoorTile : Math.random() > 0.8 ? _tile.openDoorTile : Math.random() > 0.8 ? _tile.closedDoorTile : _tile.floorTile;
      });
    });
  }

  _createClass(DungeonMap, [{
    key: "openDoor",
    value: function openDoor(x, y) {
      if (this.tiles[x][y] === _tile.closedDoorTile) {
        this.tiles[x][y] = _tile.openDoorTile;
      }
    }
  }, {
    key: "closeDoor",
    value: function closeDoor(x, y) {
      if (this.tiles[x][y] === _tile.openDoorTile) {
        this.tiles[x][y] = _tile.closedDoorTile;
        this.game.messageDisplay.add("You close the door");
      }
    }
  }, {
    key: "getRooms",
    value: function getRooms() {
      return this.rooms;
    }
  }, {
    key: "getTiles",
    value: function getTiles() {
      return this.tiles;
    }
  }, {
    key: "setTile",
    value: function setTile(x, y, tile) {
      try {
        this.tiles[x][y] = tile;
        return tile;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "getTile",
    value: function getTile(x, y) {
      try {
        return this.tiles[x][y];
      } catch (e) {}
    }
  }]);

  return DungeonMap;
}();

exports.default = DungeonMap;
},{"rot-js":33,"./tile":11}],24:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dungeonMap = require("./dungeonMap");

var _dungeonMap2 = _interopRequireDefault(_dungeonMap);

var _entity = require("./entity/entity");

var _entity2 = _interopRequireDefault(_entity);

var _items = require("./item/items");

var _entities = require("./entity/entities");

var _tile = require("./tile");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Level = function () {
  function Level(_ref) {
    var Game = _ref.Game,
        gameWorld = _ref.gameWorld,
        _ref$topLevel = _ref.topLevel,
        topLevel = _ref$topLevel === undefined ? false : _ref$topLevel,
        _ref$bottomLevel = _ref.bottomLevel,
        bottomLevel = _ref$bottomLevel === undefined ? false : _ref$bottomLevel;

    _classCallCheck(this, Level);

    this.game = Game;
    this.gameWorld = gameWorld;
    this.width = this.game.getScreenWidth();
    this.height = this.game.getScreenHeight() * 1.5;
    this.entities = {};
    this.map = new _dungeonMap2.default({
      width: this.width,
      height: this.height,
      Game: this.game
    });
    this.exploredTiles = {};
    this.items = {};
    this.player = null;

    this.firstRoom = this.map.getRooms()[0];

    if (topLevel) {
      this.playerStartPosition = this.getRandomRoomPosition(this.firstRoom);
    }

    if (!topLevel) {
      this.stairsUp = this.getRandomFloorPosition();
      this.map.setTile(this.stairsUp.x, this.stairsUp.y, _tile.stairsUpTile);
    }
    if (!bottomLevel) {
      this.stairsDown = this.getRandomFloorPosition();
      this.map.setTile(this.stairsDown.x, this.stairsDown.y, _tile.stairsDownTile);
    }

    for (var i = 0; i < 8; i++) {
      var alien = _entities.EnemyRepository.createRandom(1);
      this.addEntityAtRandomPosition(alien);
    }
    if (!topLevel) {
      for (var _i = 0; _i < 10; _i++) {
        var _alien = _entities.EnemyRepository.createRandom(2);
        this.addEntityAtRandomPosition(_alien);
      }
      for (var _i2 = 0; _i2 < 6; _i2++) {
        var _alien2 = _entities.EnemyRepository.createRandom();
        this.addEntityAtRandomPosition(_alien2);
      }
    }

    if (Math.random() < 0.8) {
      var bugRoom = this.map.getRooms()[4];
      for (var _i3 = 0; _i3 < 10; _i3++) {
        var roomPosition = this.getRandomRoomPosition(bugRoom);
        var bug = _entities.EnemyRepository.create("Flying Insect");
        bug.setPosition(roomPosition.x, roomPosition.y);
        this.addEntity(bug);
      }
    }

    if (!topLevel && Math.random() < 0.5) {
      var _bugRoom = this.map.getRooms()[3];
      for (var _i4 = 0; _i4 < 5; _i4++) {
        var _roomPosition = this.getRandomRoomPosition(_bugRoom);
        var _bug = _entities.EnemyRepository.create("Turret");
        _bug.setPosition(_roomPosition.x, _roomPosition.y);
        this.addEntity(_bug);
      }
    }

    if (bottomLevel) {
      for (var _i5 = 0; _i5 < 6; _i5++) {
        var _alien3 = _entities.EnemyRepository.createRandom(4);
        this.addEntityAtRandomPosition(_alien3);
      }
    }

    for (var _i6 = 0; _i6 < 2; _i6++) {
      this.addItemAtRandomPosition(_items.ItemRepository.createRandom());
    }

    var weaponOrArmor = Math.random() > 0.3 ? _items.ArmorRepository : _items.WeaponRepository;

    this.addItemAtRandomPosition(weaponOrArmor.createRandom());

    if (topLevel) {
      var firstRoomPosition = this.getRandomRoomPosition(this.firstRoom);

      this.addItem(_items.WeaponRepository.createRandom(), firstRoomPosition.x, firstRoomPosition.y);
      this.addItem(_items.ItemRepository.create("med pack"), firstRoomPosition.x, firstRoomPosition.y);

      var otherRoomPosition = this.getRandomRoomPosition();
      var ship = _items.ItemRepository.create("Space Ship");
      this.addItem(ship, otherRoomPosition.x, otherRoomPosition.y);
      this.addItem(_items.WeaponRepository.create("crowbar"), otherRoomPosition.x, otherRoomPosition.y);
      this.addItem(_items.ItemRepository.createRandom(), otherRoomPosition.x, otherRoomPosition.y);
    }
    if (bottomLevel) {
      this.addItemAtRandomPosition(_items.ItemRepository.create("keys"));
    }
  }

  _createClass(Level, [{
    key: "getSurroundingTiles",
    value: function getSurroundingTiles(originX, originY) {
      var range = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

      // returns an array of all the surrounding tiles with an optional range
      var coords = [];
      for (var i = -range; i < range + 1; i++) {
        for (var j = -range; j < range + 1; j++) {
          var x = originX + i;
          var y = originY + j;
          if (this.getEntityAt(x, y)) {
            coords.push(this.getEntityAt(x, y));
          } else if (this.map.getTile(x, y)) {
            coords.push({ x: x, y: y, tile: this.map.getTile(x, y) });
          }
        }
      }
      return coords;
    }
  }, {
    key: "lookInDirection",
    value: function lookInDirection(xMod, yMod) {
      var entity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.player;
      var range = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 25;

      var coords = [];
      for (var i = 0; i < range + 1; i++) {
        var x = entity.getX() + xMod * i;
        var y = entity.getY() + yMod * i;
        if (this.getEntityAt(x, y)) {
          coords.push(this.getEntityAt(x, y));
        } else if (this.map.getTile(x, y)) {
          coords.push({ x: x, y: y, blocksLight: this.map.getTile(x, y).blocksLight });
        }
      }
      return { coords: coords, xMod: xMod, yMod: yMod };
    }
  }, {
    key: "getRandomRoomPosition",
    value: function getRandomRoomPosition() {
      var room = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.map.getRooms().random();

      return {
        y: Math.floor(Math.random() * (room.getBottom() - room.getTop())) + room.getTop(),
        x: Math.floor(Math.random() * (room.getLeft() - room.getRight())) + room.getRight()
      };
    }
  }, {
    key: "getItems",
    value: function getItems() {
      return this.items;
    }
  }, {
    key: "getEntities",
    value: function getEntities() {
      return this.entities;
    }
  }, {
    key: "getRandomFloorPosition",
    value: function getRandomFloorPosition() {
      var x = Math.floor(Math.random() * this.width);
      var y = Math.floor(Math.random() * this.height);
      if (this.map.getTile(x, y) === _tile.floorTile && !this.getEntityAt(x, y)) {
        return { x: x, y: y };
      } else {
        return this.getRandomFloorPosition();
      }
    }
  }, {
    key: "addItemAtRandomPosition",
    value: function addItemAtRandomPosition(item) {
      var coords = this.getRandomFloorPosition();
      this.addItem(item, coords.x, coords.y);
    }
  }, {
    key: "addItem",
    value: function addItem(item, x, y) {
      var key = x + "," + y;
      if (this.items[key]) {
        this.items[key].push(item);
      } else {
        this.items[key] = [item];
      }
    }
  }, {
    key: "getItemsAt",
    value: function getItemsAt(x, y) {
      var key = x + "," + y;
      return this.items[key];
    }
  }, {
    key: "setItemsAt",
    value: function setItemsAt(x, y, items) {
      var key = x + "," + y;
      if (items.length === 0) {
        if (this.items[key]) {
          delete this.items[key];
        }
      } else {
        this.items[key] = items;
      }
    }
  }, {
    key: "addEntityAtRandomPosition",
    value: function addEntityAtRandomPosition(entity) {
      var coords = this.getRandomFloorPosition();
      entity.setPosition(coords.x, coords.y);
      this.addEntity(entity);
    }
  }, {
    key: "getEntityAt",
    value: function getEntityAt(x, y) {
      if (this.player && this.player.getX() == x && this.player.getY() == y) {
        return this.player;
      }
      return this.entities[x + "," + y];
    }
  }, {
    key: "updateEntityPosition",
    value: function updateEntityPosition(oldX, oldY, newX, newY) {
      this.entities[newX + "," + newY] = this.entities[oldX + "," + oldY];
      delete this.entities[oldX + "," + oldY];
    }
  }, {
    key: "addEntity",
    value: function addEntity(entity) {
      if (!this.getEntityAt(entity.getX(), entity.getY())) {
        this.entities[entity.getX() + "," + entity.getY()] = entity;
        entity.setLevel(this);
        entity.setGame(this.game);
        if (entity.hasMixin("Actor")) {
          this.game.getScheduler().add(entity, true);
        }
      }
    }
  }, {
    key: "removeEntity",
    value: function removeEntity(entityToRemove) {
      var key = entityToRemove.getX() + "," + entityToRemove.getY();
      if (this.entities[key] == entityToRemove) {
        delete this.entities[key];
        if (entityToRemove.hasMixin("Actor")) {
          this.game.getScheduler().remove(entityToRemove);
        }
      }
    }
  }, {
    key: "getMap",
    value: function getMap() {
      return this.map;
    }
  }]);

  return Level;
}();

exports.default = Level;
},{"./dungeonMap":32,"./entity/entity":13,"./item/items":22,"./entity/entities":23,"./tile":11}],10:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _level = require("./level");

var _level2 = _interopRequireDefault(_level);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameWorld = function () {
  function GameWorld(Game) {
    _classCallCheck(this, GameWorld);

    var topLevel = new _level2.default({ Game: Game, gameWorld: this, topLevel: true });
    var bottomLevel = new _level2.default({ Game: Game, gameWorld: this, bottomLevel: true });
    var middleLevels = [];
    for (var i = 0; i < 3; i++) {
      middleLevels.push(new _level2.default({ Game: Game, gameWorld: this }));
    }
    this.levels = [topLevel].concat(middleLevels, [bottomLevel]);
    this.currentLevel = this.levels[0];
  }

  _createClass(GameWorld, [{
    key: "getCurrentLevel",
    value: function getCurrentLevel() {
      return this.currentLevel;
    }
  }, {
    key: "goDownLevel",
    value: function goDownLevel() {
      var index = this.levels.indexOf(this.currentLevel);
      if (index < this.levels.length) {
        this.currentLevel = this.levels[index + 1];
        return this.currentLevel;
      }
      return false;
    }
  }, {
    key: "goUpLevel",
    value: function goUpLevel() {
      var index = this.levels.indexOf(this.currentLevel);
      if (index > 0) {
        this.currentLevel = this.levels[index - 1];
        return this.currentLevel;
      }
      return false;
    }
  }]);

  return GameWorld;
}();

exports.default = GameWorld;
},{"./level":24}],12:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var text = {
  introduction: ["You wake up in a dimly lit room struggling to remember where you are and how you got there.  ", "Slowly it comes to you...", "You are the pilot of a small mining ship, and you were on your way back to the main station when you came across a large undocumented asteroid. You, the grand opportunist you are, undocked your drilling rig and floated over to check it out. Turns out it was occupied. You're a bit foggy on what came next, but you need to get to your rig and get off this rock.", "Fast."],
  foundShipNoKeys: ["You've found your ship!", "You jump into the one-man mining rig and start to fire it up only to discover that your keys have gone missing.  Frantically you check your pockets but come up with nothing but lint.  These alien monsters must have taken the keys when they ripped you from the cockpit.  Fortunately, the thing seems to be in working order.", "You find a couple of useful items in the back. (Pick them up with 'g')", "Let's find those keys."],
  foundKeys: ["Your keys... now don't lose them.", "Back to the ship!"],
  foundKeysAndShip: ["You jam your keys into the ignition and the rig fires up.", "Now that you're back in the cockpit blasting yourself free from this cavern is a simple task, and this time you won't let those slimy space-bugs surround you.", "You blast yourself free, turn on your navigational systems and head home.", "You win."]
};

exports.default = text;
},{}],9:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _colors = require("../colors");

var _colors2 = _interopRequireDefault(_colors);

var _entity = require("../entity/entity");

var _entity2 = _interopRequireDefault(_entity);

var _gameOverScreen = require("./gameOverScreen");

var _gameOverScreen2 = _interopRequireDefault(_gameOverScreen);

var _winScreen = require("./winScreen");

var _winScreen2 = _interopRequireDefault(_winScreen);

var _itemListDialog = require("./itemListDialog");

var _itemListDialog2 = _interopRequireDefault(_itemListDialog);

var _pickUpDialog = require("./pickUpDialog");

var _pickUpDialog2 = _interopRequireDefault(_pickUpDialog);

var _visibleThingsDialog = require("./visibleThingsDialog");

var _visibleThingsDialog2 = _interopRequireDefault(_visibleThingsDialog);

var _confirmation = require("./confirmation");

var _confirmation2 = _interopRequireDefault(_confirmation);

var _storyScreen = require("./storyScreen");

var _storyScreen2 = _interopRequireDefault(_storyScreen);

var _helpScreen = require("./helpScreen");

var _helpScreen2 = _interopRequireDefault(_helpScreen);

var _playerStatusScreen = require("./playerStatusScreen");

var _playerStatusScreen2 = _interopRequireDefault(_playerStatusScreen);

var _items = require("../item/items");

var _entities = require("../entity/entities");

var _gameWorld = require("../gameWorld");

var _gameWorld2 = _interopRequireDefault(_gameWorld);

var _tile2 = require("../tile");

var _text = require("../text");

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var playScreen = function () {
  function playScreen(Game) {
    _classCallCheck(this, playScreen);

    this.game = Game;
    this.gameWorld = new _gameWorld2.default(this.game);
    this.level = this.gameWorld.getCurrentLevel();
    this.map = this.level.getMap();
    this.subscreen = null;
    this.closing = false;
    this.firing = false;
    this.foundShip = false;
    this.gameOver = false;
    this.win = false;
    this.game.rangeWeaponDisplay = null;

    this.game.player = new _entity2.default(Object.assign(_entities.PlayerTemplate, { map: this.map, Game: this.game }));
    this.player = this.game.player;
    this.level.player = this.game.player;

    this.game.messageDisplay.clear();

    this.game.messageDisplay.add({
      color: "white",
      text: "Press ? at any time for help"
    });

    var position = this.level.playerStartPosition;
    this.player.setPosition(position.x, position.y);
    this.game.getScheduler().add(this.player, true);
    this.game.getEngine().start();

    this.enterSubscreen(new _storyScreen2.default(this, _text2.default.introduction));
  }

  _createClass(playScreen, [{
    key: "exit",
    value: function exit() {
      console.log("exit play screen");
    }
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (this.subscreen) {
        this.subscreen.handleInput(inputData);
        return;
      }
      //movement
      var move = function (dX, dY) {
        if (this.firing) {
          var array = this.level.lookInDirection(dX, dY);
          var fireArray = this.player.weapon.fire(array);
          if (fireArray) {
            this.game.rangeWeaponDisplay = fireArray;
            this.game.rangeWeaponDisplay.color = this.player.weapon.fg;
          }
          this.firing = false;
          this.game.getEngine().unlock();
          return;
        }
        if (this.closing) {
          closeDoor(dX, dY);
          this.game.getEngine().unlock();
          return;
        }
        this.player.tryMove(this.player.getX() + dX, this.player.getY() + dY, this.level);
        this.game.getEngine().unlock();
      }.bind(this);

      var closeDoor = function (dX, dY) {
        this.level.getMap().closeDoor(this.player.getX() + dX, this.player.getY() + dY);
        this.closing = false;
        this.game.getEngine().unlock();
      }.bind(this);

      if (inputData.keyCode === _rotJs2.default.VK_H || inputData.keyCode == _rotJs2.default.VK_4 || inputData.keyCode === _rotJs2.default.VK_NUMPAD4 || inputData.keyCode == _rotJs2.default.VK_LEFT) {
        move(-1, 0);
      } else if (inputData.keyCode === _rotJs2.default.VK_L || inputData.keyCode == _rotJs2.default.VK_6 || inputData.keyCode === _rotJs2.default.VK_NUMPAD6 || inputData.keyCode == _rotJs2.default.VK_RIGHT) {
        move(1, 0);
      } else if (inputData.keyCode === _rotJs2.default.VK_K || inputData.keyCode == _rotJs2.default.VK_8 || inputData.keyCode === _rotJs2.default.VK_NUMPAD8 || inputData.keyCode == _rotJs2.default.VK_UP) {
        move(0, -1);
      } else if (inputData.keyCode === _rotJs2.default.VK_J || inputData.keyCode == _rotJs2.default.VK_2 || inputData.keyCode === _rotJs2.default.VK_NUMPAD2 || inputData.keyCode == _rotJs2.default.VK_DOWN) {
        move(0, 1);
      } else if (inputData.keyCode === _rotJs2.default.VK_Y || inputData.keyCode === _rotJs2.default.VK_NUMPAD7 || inputData.keyCode == _rotJs2.default.VK_7) {
        move(-1, -1);
      } else if (inputData.keyCode === _rotJs2.default.VK_U || inputData.keyCode === _rotJs2.default.VK_NUMPAD9 || inputData.keyCode == _rotJs2.default.VK_9) {
        move(1, -1);
      } else if (inputData.keyCode === _rotJs2.default.VK_B || inputData.keyCode === _rotJs2.default.VK_NUMPAD1 || inputData.keyCode == _rotJs2.default.VK_1) {
        move(-1, 1);
      } else if (inputData.keyCode === _rotJs2.default.VK_N || inputData.keyCode === _rotJs2.default.VK_NUMPAD3 || inputData.keyCode == _rotJs2.default.VK_3) {
        move(1, 1);
      } else if (inputData.keyCode === _rotJs2.default.VK_5 || inputData.keyCode === _rotJs2.default.VK_NUMPAD5 || inputData.keyCode === _rotJs2.default.VK_PERIOD) {
        if (inputData.shiftKey) {
          // go down level
          if (this.level.getMap().getTile(this.player.getX(), this.player.getY()) !== _tile2.stairsDownTile) {
            return false;
          }
          var newLevel = this.gameWorld.goDownLevel();
          if (newLevel) {
            this.level = newLevel;
            this.player.setPosition(this.level.stairsUp.x, this.level.stairsUp.y);
            this.level.player = this.player;
            this.map = this.level.getMap();
            this.game.refresh();
          }
          return;
        }

        // if no shift key, then wait
        this.game.getEngine().unlock();
      } else if (inputData.keyCode === _rotJs2.default.VK_COMMA && inputData.shiftKey) {
        // go up level
        if (this.level.getMap().getTile(this.player.getX(), this.player.getY()) !== _tile2.stairsUpTile) {
          return false;
        }
        var _newLevel = this.gameWorld.goUpLevel();
        if (_newLevel) {
          this.level = _newLevel;
          this.player.setPosition(this.level.stairsDown.x, this.level.stairsDown.y);
          this.level.player = this.player;
          this.map = this.level.getMap();
          this.game.refresh();
          return;
        }
      } else if (inputData.keyCode == _rotJs2.default.VK_C) {
        this.game.messageDisplay.add({ text: "Close where?", color: "white" });
        this.closing = true;
        return;
      }
      if (this.closing) {
        this.game.messageDisplay.add("Nevermind");
        this.closing = false;
      }
      if (this.firing) {
        this.game.messageDisplay.add("Nevermind");
        this.firing = false;
      }
      // fire weapon

      if (inputData.keyCode === _rotJs2.default.VK_F) {
        if (this.player.weapon && this.player.weapon.hasMixin("Fireable")) {
          this.game.messageDisplay.add({
            text: "Fire weapon where?",
            color: "white"
          });
          this.firing = true;
        }
      }
      // pick up item
      if (inputData.keyCode === _rotJs2.default.VK_G || inputData.keyCode == _rotJs2.default.VK_COMMA) {
        var item = this.level.getItems()[this.player.getX() + "," + this.player.getY()];
        if (item.length == 1 && item[0].canPickUp && this.player.addItem(item[0])) {
          this.level.setItemsAt(this.player.getX(), this.player.getY(), []);
          this.game.messageDisplay.add("you pick up " + item[0].describeA());
          if (item[0].hasMixin("Equippable")) {
            this.game.messageDisplay.add("wield it from the (i)nventory screen");
          }
          if (item[0].hasMixin("Fireable")) {
            this.game.messageDisplay.add("then (f)ire it with 'f'");
          }
        }
        if (item.length > 1) {
          this.enterSubscreen(new _pickUpDialog2.default(item, this, this.player));
        }
      }
      // subscreens
      if (inputData.keyCode == _rotJs2.default.VK_I) {
        this.enterSubscreen(new _itemListDialog2.default(this.player.inventory, this, this.player));
      }
      if (inputData.keyCode == _rotJs2.default.VK_SLASH) {
        this.enterSubscreen(new _helpScreen2.default(this));
      }
      if (inputData.keyCode == _rotJs2.default.VK_P) {
        this.enterSubscreen(new _playerStatusScreen2.default(this));
      }
      if (inputData.keyCode === _rotJs2.default.VK_V) {
        var visibleThings = this.player.getVisible();
        this.enterSubscreen(new _visibleThingsDialog2.default(visibleThings, this, this.player));
      }
    }
  }, {
    key: "enterSubscreen",
    value: function enterSubscreen(subscreen) {
      this.subscreen = subscreen;
      this.game.refresh();
    }
  }, {
    key: "exitSubscreen",
    value: function exitSubscreen() {
      this.subscreen = null;
      this.game.refresh();
    }
  }, {
    key: "render",
    value: function render(Game) {
      var _this = this;

      this.level.getSurroundingTiles(this.player.getX(), this.player.getY());
      if (!this.player.isAlive()) {
        this.game.switchScreen(_gameOverScreen2.default);
      }
      var playerStatusDisplay = Game.playerStatusDisplay;
      var display = Game.getDisplay();
      var map = this.level.getMap();

      playerStatusDisplay.render({
        name: this.player.name,
        hp: this.player.hp,
        maxHp: this.player.maxHp,
        statusEffects: this.player.getTimedStatusEffects(),
        weapon: this.player.weapon,
        x: this.player.x,
        y: this.player.y
      });

      var tile = this.level.getMap().getTile(this.player.getX(), this.player.getY());
      if (tile == _tile2.stairsDownTile) {
        this.game.messageDisplay.add({
          color: "white",
          text: "You see a staircase, press > to go down"
        });
      }

      if (tile == _tile2.stairsUpTile) {
        this.game.messageDisplay.add({
          color: "white",
          text: "You see a staircase, press < to go up"
        });
      }
      var items = this.level.getItems();
      if (items[this.player.getX() + "," + this.player.getY()]) {
        var item = items[this.player.getX() + "," + this.player.getY()];
        if (!this.foundShip && item.filter(function (i) {
          return i.name == "Space Ship";
        }).length > 0) {
          this.foundShip = true;
          this.enterSubscreen(new _storyScreen2.default(this, _text2.default.foundShipNoKeys));
          return;
        }
        if (!this.foundKeys && item.filter(function (i) {
          return i.name == "keys";
        }).length > 0) {
          this.foundKeys = true;
          this.enterSubscreen(new _storyScreen2.default(this, _text2.default.foundKeys));
          return;
        }
        if (!this.win && this.player.hasItem("keys") && item.filter(function (i) {
          return i.name == "Space Ship";
        }).length > 0) {
          this.win = true;
          this.enterSubscreen(new _storyScreen2.default(this, _text2.default.foundKeysAndShip, function () {
            _this.game.switchScreen(_winScreen2.default);
          }));
          return;
        }
        if (item.length == 1) {
          this.game.messageDisplay.add({
            text: "you see " + item[0].describeA(),
            color: "gray"
          });
          if (this.player.inventory.length <= 0) {
            this.game.messageDisplay.add({
              text: "press 'g' to pick it up",
              color: "gray"
            });
          }
        } else {
          this.game.messageDisplay.add({
            text: "you see several items here",
            color: "gray"
          });
          if (this.player.inventory.length <= 0) {
            this.game.messageDisplay.add({
              text: "press 'g' to pick them up",
              color: "gray"
            });
          }
        }
      }

      var screenWidth = Game.getScreenWidth();
      var screenHeight = Game.getScreenHeight();
      var topLeftX = Math.max(0, this.player.getX() - screenWidth / 2);
      topLeftX = Math.min(topLeftX, this.level.width - screenWidth);

      var topLeftY = Math.max(0, this.player.getY() - screenHeight / 2);
      topLeftY = Math.min(topLeftY, this.level.height - screenHeight);

      var fov = new _rotJs2.default.FOV.PreciseShadowcasting(function (x, y) {
        if (map.getTile(x, y)) {
          return !map.getTile(x, y).blocksLight;
        }

        return false;
      });

      var visibleTiles = {};
      var exploredTiles = this.level.exploredTiles;
      fov.compute(this.player.getX(), this.player.getY(), this.player.getSightRadius(), function (x, y, r, visibility) {
        visibleTiles[x + "," + y] = true;
        exploredTiles[x + "," + y] = true;
      });

      for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
        for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
          var _tile = map.getTile(x, y);
          if (visibleTiles[x + "," + y]) {
            display.draw(x - topLeftX, y - topLeftY, _tile.getChar(), _tile.getFg(), _tile.getBg());
          } else if (this.level.exploredTiles[x + "," + y]) {
            display.draw(x - topLeftX, y - topLeftY, _tile.getChar(), _colors2.default.darkBlue, _colors2.default.black);
          }
        }
      }

      Object.keys(items).forEach(function (itemKey) {
        var _itemKey$split = itemKey.split(","),
            _itemKey$split2 = _slicedToArray(_itemKey$split, 2),
            x = _itemKey$split2[0],
            y = _itemKey$split2[1];

        var item = items[itemKey];
        if (visibleTiles[x + "," + y]) {
          display.draw(parseInt(x) - topLeftX, parseInt(y) - topLeftY, item[0].getChar(), item[0].getFg(), item[0].getBg());
        }
      });

      if (this.game.explosionDisplay) {
        this.game.explosionDisplay.forEach(function (coord) {
          var xy = coord.split(",");
          display.draw(xy[0] - topLeftX, xy[1] - topLeftY, "•", _colors2.default.orange, _colors2.default.black);
        });
        setTimeout(function () {
          _this.game.explosionDisplay = null;
          _this.render(_this.game);
        }, 100);
      }

      if (this.game.rangeWeaponDisplay) {
        var xMod = this.game.rangeWeaponDisplay.xMod;
        var yMod = this.game.rangeWeaponDisplay.yMod;
        var char = ""; //"/" : "|" : "\\" :
        if (xMod == 1 && yMod == -1 || xMod == -1 && yMod == 1) {
          char = "/";
        } else if (xMod == -1 && yMod == -1 || xMod == 1 && yMod == 1) {
          char = "\\";
        } else if (xMod == 0) {
          char = "|";
        } else if (yMod == 0) {
          char = "-";
        }
        this.game.rangeWeaponDisplay.coords.forEach(function (coord) {
          var xy = coord.split(",");
          var fg = _this.game.rangeWeaponDisplay.color || _colors2.default.blue;
          display.draw(xy[0] - topLeftX, xy[1] - topLeftY, char, fg, _this.player.getBg());
        });

        setTimeout(function () {
          _this.game.rangeWeaponDisplay = null;
          _this.render(_this.game);
        }, 100);
      }

      var entities = this.level.getEntities();
      Object.values(entities).forEach(function (entity) {
        if (visibleTiles[entity.getX() + "," + entity.getY()]) {
          display.draw(entity.getX() - topLeftX, entity.getY() - topLeftY, entity.getChar(), entity.hit ? _colors2.default.black : entity.getFg(), entity.hit || entity.getBg());
          if (entity.hit) {
            setTimeout(function () {
              entity.hit = false;
              _this.render(_this.game);
            }, 100);
          }
        }
      });
      display.draw(this.player.getX() - topLeftX, this.player.getY() - topLeftY, this.player.getChar(), this.player.hit ? _colors2.default.black : this.player.getFg(), this.player.hit || this.player.getBg());
      if (this.player.hit) {
        setTimeout(function () {
          _this.player.hit = false;
          _this.render(_this.game);
        }, 300);
      }
      if (this.subscreen) {
        this.subscreen.render(Game);
        return;
      }
    }
  }]);

  return playScreen;
}();

exports.default = playScreen;
},{"rot-js":33,"../colors":4,"../entity/entity":13,"./gameOverScreen":14,"./winScreen":15,"./itemListDialog":16,"./pickUpDialog":17,"./visibleThingsDialog":18,"./confirmation":8,"./storyScreen":19,"./helpScreen":20,"./playerStatusScreen":21,"../item/items":22,"../entity/entities":23,"../gameWorld":10,"../tile":11,"../text":12}],7:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _playScreen = require("./playScreen");

var _playScreen2 = _interopRequireDefault(_playScreen);

var _hyperapp = require("hyperapp");

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var startScreen = function () {
  function startScreen(Game) {
    _classCallCheck(this, startScreen);

    this.game = Game;
    this.display = document.createElement("div");
    this.display.classList.add("start-screen");
    (0, _hyperapp.app)({}, {}, this.view, this.display);
  }

  _createClass(startScreen, [{
    key: "view",
    value: function view(_ref) {
      var text = _ref.text,
          confirm = _ref.confirm,
          cancel = _ref.cancel;

      return (0, _hyperapp.h)(
        "div",
        null,
        (0, _hyperapp.h)(
          "h1",
          null,
          "SPACE DUNGEON"
        ),
        (0, _hyperapp.h)(
          "h1",
          { id: "pew" },
          "PEW PEW"
        ),
        (0, _hyperapp.h)(
          "p",
          null,
          "PRESS ENTER TO START"
        )
      );
    }
  }, {
    key: "exit",
    value: function exit() {
      this.display.remove();
    }
  }, {
    key: "render",
    value: function render() {
      document.body.appendChild(this.display);
    }
  }, {
    key: "handleInput",
    value: function handleInput(inputData) {
      if (inputData.keyCode == _rotJs2.default.VK_RETURN) {
        this.game.switchScreen(_playScreen2.default);
        this.display.remove();
      }
    }
  }]);

  return startScreen;
}();

exports.default = startScreen;
},{"./playScreen":9,"hyperapp":35,"rot-js":33}],6:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require("./colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageDisplay = function () {
  function MessageDisplay() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "800px";

    _classCallCheck(this, MessageDisplay);

    this.messages = [];
    this.messageScreen = document.createElement("div");
    Object.assign(this.messageScreen.style, {
      width: width,
      "font-size": "15px",
      "letter-spacing": "1px",
      background: _colors2.default.black,
      color: _colors2.default.white,
      "font-family": "Courier, monospace",
      height: "88px",
      overflow: "hidden",
      "margin-top": "-8px",
      "border-top": "8px solid " + _colors2.default.black
    });

    this.messageScreen.textContent = "  ";
  }

  _createClass(MessageDisplay, [{
    key: "getDisplay",
    value: function getDisplay() {
      return this.messageScreen;
    }
  }, {
    key: "add",
    value: function add(message) {
      this.messages.push(message);
      this.render();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.messages = [];
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      this.messageScreen.innerHTML = "";
      this.messages.slice(Math.max(this.messages.length - 5, 0)).forEach(function (message) {
        var color = "gray";
        if ((typeof message === "undefined" ? "undefined" : _typeof(message)) == "object") {
          color = message.color;
          message = message.text;
        }
        _this.messageScreen.innerHTML += "<div class=\"" + color + "\">" + message + "</div>";
      });
    }
  }]);

  return MessageDisplay;
}();

exports.default = MessageDisplay;
},{"./colors":4}],5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require("./colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerStatusDisplay = function () {
  function PlayerStatusDisplay() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;

    _classCallCheck(this, PlayerStatusDisplay);

    this.playerStatus = document.createElement("div");
    this.playerStatus.classList.add("player-status");
    Object.assign(this.playerStatus.style, {
      width: "800px",
      "font-size": "15px",
      "letter-spacing": "1px",
      background: _colors2.default.black,
      color: _colors2.default.white,
      "font-family": "Courier, monospace",
      height: "18px",
      overflow: "hidden",
      display: "flex"
    });

    this.playerStatus.textContent = "  ";
  }

  _createClass(PlayerStatusDisplay, [{
    key: "getDisplay",
    value: function getDisplay() {
      return this.playerStatus;
    }
  }, {
    key: "render",
    value: function render(_ref) {
      var _this = this;

      var _ref$name = _ref.name,
          name = _ref$name === undefined ? "Player Name" : _ref$name,
          hp = _ref.hp,
          maxHp = _ref.maxHp,
          statusEffects = _ref.statusEffects,
          weapon = _ref.weapon,
          x = _ref.x,
          y = _ref.y;

      var hpColor = hp <= 10 ? "red" : "";
      this.playerStatus.innerHTML = "";
      this.playerStatus.innerHTML = "<div class=\"" + hpColor + "\" style=\"flex: 1\">HEALTH \u2665" + hp + "/" + maxHp + "<span>" + (weapon ? weapon.name : "NO WEAPON") + "</span></div>";
      this.playerStatus.innerHTML += "<div>";
      statusEffects.forEach(function (s) {
        _this.playerStatus.innerHTML += s.label + "/" + s.timer + " ";
      });
      if (weapon && (weapon.charges == 0 || weapon.charges)) {
        this.playerStatus.innerHTML += " Weapon charges remaining: " + weapon.charges;
      }
      this.playerStatus.innerHTML += "</div>";
    }
  }]);

  return PlayerStatusDisplay;
}();

exports.default = PlayerStatusDisplay;
},{"./colors":4}],3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rotJs = require("rot-js");

var _rotJs2 = _interopRequireDefault(_rotJs);

var _colors = require("./colors");

var _colors2 = _interopRequireDefault(_colors);

var _startScreen = require("./screens/startScreen");

var _startScreen2 = _interopRequireDefault(_startScreen);

var _messageDisplay = require("./messageDisplay");

var _messageDisplay2 = _interopRequireDefault(_messageDisplay);

var _playerStatusDisplay = require("./playerStatusDisplay");

var _playerStatusDisplay2 = _interopRequireDefault(_playerStatusDisplay);

var _confirmation = require("./screens/confirmation");

var _confirmation2 = _interopRequireDefault(_confirmation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game() {
    var _this = this;

    _classCallCheck(this, Game);

    this.screenWidth = 80;
    this.screenHeight = 30;
    this.scheduler = new _rotJs2.default.Scheduler.Speed();
    this.engine = new _rotJs2.default.Engine(this.scheduler);
    this.display = new _rotJs2.default.Display({
      width: this.screenWidth,
      height: this.screenHeight,
      fontFamily: "Courier, monospace",
      fg: _colors2.default.white,
      bg: _colors2.default.black
    });
    this.currentScreen;
    this.player = null;
    this.messageDisplay = new _messageDisplay2.default();
    this.playerStatusDisplay = new _playerStatusDisplay2.default();

    window.addEventListener("keydown", function (e) {
      if (_this.currentScreen) {
        _this.currentScreen.handleInput(e);
      }
    });
  }

  _createClass(Game, [{
    key: "getScheduler",
    value: function getScheduler() {
      return this.scheduler;
    }
  }, {
    key: "getEngine",
    value: function getEngine() {
      return this.engine;
    }
  }, {
    key: "getDisplay",
    value: function getDisplay() {
      return this.display;
    }
  }, {
    key: "getScreenWidth",
    value: function getScreenWidth() {
      return this.screenWidth;
    }
  }, {
    key: "getScreenHeight",
    value: function getScreenHeight() {
      return this.screenHeight;
    }
  }, {
    key: "switchScreen",
    value: function switchScreen(screen) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.currentScreen) {
        this.currentScreen.exit();
      }
      this.currentScreen = new screen(this, options);
      this.refresh();
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.display.clear();
      this.currentScreen.render(this);
    }
  }]);

  return Game;
}();

var game = new Game();
exports.default = game;


window.onload = function () {
  if (!_rotJs2.default.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
  } else {
    document.body.appendChild(game.playerStatusDisplay.getDisplay());
    document.body.appendChild(game.getDisplay().getContainer());
    document.body.appendChild(game.messageDisplay.getDisplay());
    game.switchScreen(_startScreen2.default);
  }
};
},{"rot-js":33,"./colors":4,"./screens/startScreen":7,"./messageDisplay":6,"./playerStatusDisplay":5,"./screens/confirmation":8}]},{},[3])