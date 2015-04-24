var ModuleTestJoker = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var test = new Test("Joker", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
    }).add([
    ]);

var spec = new Spec();
var joker = new Joker(spec);

if (_runOnBrowser || _runOnNodeWebKit) {
    test.add([ testJoker_CanvasFingerprint ]);
} else if (_runOnWorker) {
    //test.add([]);
} else if (_runOnNode) {
    //test.add([]);
}

// --- test cases ------------------------------------------
function testJoker_CanvasFingerprint(test, pass, miss) {

    console.log( JSON.stringify(joker, null, 2) );

    var result = {
            DEVICE:             spec.DEVICE,
            MAX_TEXTURE_SIZE:   spec.MAX_TEXTURE_SIZE,
            USER_AGENT:         spec.USER_AGENT,
            GPU_VERSION:        spec.GPU_VERSION,
            WEBGL_CONTEXT:      spec.WEBGL_CONTEXT,
            DISPLAY_DPR:        spec.DISPLAY_DPR,
            DISPLAY_LONG:       spec.DISPLAY_LONG,
            DISPLAY_SHORT:      spec.DISPLAY_SHORT,
            MAX_TOUCH_POINTS:   spec.MAX_TOUCH_POINTS,
            CPU_CORES:          spec.CPU_CORES,
            GPU_FINGERPRINT:    joker.GPU_FINGERPRINT.toString(16),
            CANVAS_FINGERPRINT: joker.CANVAS_FINGERPRINT.toString(16),
        };

    console.log( JSON.stringify(result, null, 2) );

    test.done(pass());
}

return test.run().clone();

})((this || 0).self || global);

