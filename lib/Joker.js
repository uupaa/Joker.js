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
function Joker(token,    // @arg String - secure token.
               spec,     // @arg Spec - Spec instance
               worker) { // @arg Worker - SecureWorker instance
    this._spec = spec;

    if (IN_NW || IN_BROWSER) {
        WebModule["exports"] = Joker_moduleExporter; // override
        _hookScriptExecute();

        this._worker = worker;
        this._worker.onerror = function(error) { };
        this._worker.onmessage = function(event) { };
        this._worker.postMessage(["#INIT", token]);
        this._worker.postMessage(["#2D", _getFingerprint2D("https://github.com/uupaa/")]);
        this._worker.postMessage(["#3D", _getFingerprint3D(this._spec["WEBGL_CONTEXT"])]);

        this._heartBeatTimerID = setInterval(_heartBeat.bind(this), Joker.HEART_BEAT);
    }
}

Joker.HEART_BEAT = 3000;
Joker.codes = {}; // { moduleName: sourceCode, ... }
Joker["repository"] = "https://github.com/uupaa/Joker.js";
Joker["prototype"] = Object.create(Joker, {
    "constructor": { "value": Joker }, // new Joker(token:String, spec:Spec, worker:Worker):Joker
});

// --- implements ------------------------------------------
function _heartBeat() { // @bind this
    this._worker.postMessage(["#HB", Joker.codes]); // with payload
    Joker.codes = {};
}

function Joker_moduleExporter(name, closure) {
    var aka = this[name] ? (name + "_") : name;

    return this[aka] || (this[aka] = _publish(this, aka, closure));

    function _publish(wm, aka, closure) {
        Joker.codes[aka] = closure; // stock

        var entity = closure(GLOBAL);

        return (!WebModule["publish"] || GLOBAL[aka]) ? entity
                                                      : (GLOBAL[aka] = entity);
    }
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
            return var glVersion = gl["getParameter"]( gl["VERSION"] );
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

