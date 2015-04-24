(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var Hash = global["Hash"];

// --- define / local variables ----------------------------
var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
//var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
//var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var FINGERPRINTING      = false;
var CANVAS_FINGERPRINT  = 0x00000000;
var GPU_FINGERPRINT     = 0x00000000;

// --- class / interfaces ----------------------------------
function Joker(spec,      // @arg Spec - Spec instance
               options) { // @arg Object = {} - { }
    options = options || {};

    this._spec = spec;

    if (_runOnNodeWebKit || _runOnBrowser) {
        if (FINGERPRINTING) {
            ;
        } else {
            CANVAS_FINGERPRINT = _getCanvasFingerprint(spec);
            GPU_FINGERPRINT    = _getGPUFingerprint(spec);
            FINGERPRINTING     = true;
        }
    }
}

//{@dev
Joker["repository"] = "https://github.com/uupaa/Joker.js"; // GitHub repository URL. http://git.io/Help
//}@dev

Joker["prototype"] = Object.create(Joker, {
    "constructor":          { "value": Joker          }, // new Joker(options:Object = {}):Joker
    "CANVAS_FINGERPRINT":   { "get":   function()  { return CANVAS_FINGERPRINT;     } },
    "GPU_FINGERPRINT":      { "get":   function()  { return GPU_FINGERPRINT;        } },
});

// --- implements ------------------------------------------
function _getCanvasFingerprint(spec) {
    var canvas = document.createElement("canvas");

    if (canvas) {
        canvas.width = 220;
        canvas.height = 22;

        try {
            // https://www.browserleaks.com/canvas#how-does-it-work
            var ctx = canvas.getContext("2d");
            var txt = "https://github.com/uupaa/Spec.js";

            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);

            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixelData = new Uint8Array(imageData.data.buffer);

            return Hash["XXHash"](pixelData);
        } catch (o_O) {}
    }
    return 0;
}

function _getGPUFingerprint(spec) {
    var canvas = document.createElement("canvas");

    if (canvas) {
        var gl = canvas.getContext( spec["WEBGL_CONTEXT"] ); // eg: "webgl2"
        if (gl) {
            var glVersion = gl["getParameter"]( gl["VERSION"] );

            return Hash["XXHash"](glVersion);
        }
    }
    return 0;
}

// --- validate / assertions -------------------------------
//{@dev
//function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if (typeof module !== "undefined") {
    module["exports"] = Joker;
}
global["Joker" in global ? "Joker_" : "Joker"] = Joker; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

