(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("Joker", function moduleClosure(global) {

"use strict";

// --- dependency modules ----------------------------------
var WebModule = global["WebModule"];

// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function Joker(pulse,     // @arg Integer - vital pulse.
               token,     // @arg String - secure token.
               spec,      // @arg Spec - Spec instance
               worker,    // @arg Worker - SecureWorker instance
               scripts) { // @arg URLArray = [] - importScripts(scripts...)
    this._spec = spec;

    if (IN_NW || IN_BROWSER) {
        _hookScriptExecute();

        var pixelData    = _getFingerprint2D("https://github.com/uupaa/");
        var webglVersion = _getFingerprint3D(this._spec["WEBGL_CONTEXT"]);

        this._worker = worker;
        this._worker.onerror = function(error) { };
        this._worker.onmessage = function(event) { };
        this._worker.postMessage(["#INIT", token, pulse, scripts || []]);
        this._worker.postMessage(["#FP2D", pixelData.buffer], [pixelData.buffer]);
        this._worker.postMessage(["#FP3D", webglVersion]);

        this._vitalPluseID = setInterval(_vital.bind(this), pulse);
    }
}

Joker["repository"] = "https://github.com/uupaa/Joker.js";
Joker["prototype"] = Object.create(Joker, {
    "constructor":  { "value": Joker        }, // new Joker(token:String, spec:Spec, worker:Worker):Joker
    "judge":        { "value": Joker_judge  }, // Joker#judge():void
});

// --- implements ------------------------------------------
function Joker_judge() {
    this._worker.postMessage(["#JUDGE", WebModule["closure"]]);
    WebModule["closure"] = {};
}

function _vital() { // @bind this
    this._worker.postMessage(["#VITAL"]);
}


function _getFingerprint2D(txt) { // @arg String
                                  // @ret Uint8Array - pixel data
    var canvas = document.createElement("canvas");

    if (canvas) {
        canvas.width = 160;
        canvas.height = 16;

        // https://www.browserleaks.com/canvas#how-does-it-work
        var ctx = canvas.getContext("2d");

        ctx.textBaseline = "top";
        ctx.font = "13px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,34,14);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 0, 12);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 2, 14);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        return new Uint8Array(imageData.data.buffer);
    }
    return new Uint8Array();
}

function _getFingerprint3D(wglContextID) { // @arg String
                                           // @ret String - glVersion
    var canvas = document.createElement("canvas");

    if (canvas) {
        var gl = canvas.getContext(wglContextID); // eg: "webgl2"

        if (gl) {
            return gl["getParameter"](gl["VERSION"]);
        }
    }
    return "";
}

function _hookScriptExecute() {
    if (document.onbeforescriptexecute !== undefined) {
        document.addEventListener("beforescriptexecute", function(event) {
            var target = event.target;
            var aka = target.src || target.id;

            if (target.src) {
                // <script src="..."></script> block
                var xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        Joker.codes[aka] = xhr.responseText;
                    }
                };
                xhr.open("GET", event.target.src);
                xhr.send();
            } else if (target.text) {
                // <script>...</script> block
                if (!target.type || /javascript/i.test(target)) {
                    // <script>..</script> or
                    // <script type="text/javascript">..</script>
                    Joker.codes[aka] = event.target.text; // stock
                } else {
                    // <script type="text/oreore">...</script>
                }
            }
        });
    }
}

return Joker; // return entity

});

