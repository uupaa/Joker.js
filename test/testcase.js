var ModuleTestJoker = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("Joker", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     true,  // enable worker test.
        node:       true,  // enable node test.
        nw:         true,  // enable nw.js test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        // generic test
        testJoker_value,
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        // browser and node-webkit test
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testJoker_value(test, pass, miss) {
    var spec = new WebModule.Spec();
    var joker = new WebModule.Joker(spec);

    console.log( joker.CANVAS_FINGERPRINT );
    console.log( joker.GPU_FINGERPRINT );

/*
    webModule.startThread("../lib/WebModuleWorker.js", function() {
        ;
    }, function(error) {
        throw error;
    });
 */
}


return test.run();

})(GLOBAL);

