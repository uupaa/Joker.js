// Joker test

onmessage = function(event) {
    self.TEST_DATA = event.data;
    self.TEST_ERROR_MESSAGE = "";

    if (!self.console) {
        self.console = function() {};
        self.console.log = function() {};
        self.console.warn = function() {};
        self.console.error = function() {};
    }

    importScripts("../node_modules/uupaa.hash.js/lib/Hash.js");
    importScripts("../node_modules/uupaa.spec.js/lib/SpecCatalog.js");
    importScripts("../node_modules/uupaa.spec.js/lib/Spec.js");
    importScripts(".././test/wmtools.js");
    importScripts("../lib/Joker.js");
    importScripts("../release/Joker.w.min.js");
    importScripts("./testcase.js");

    self.postMessage({ TEST_ERROR_MESSAGE: self.TEST_ERROR_MESSAGE || "" });
};

