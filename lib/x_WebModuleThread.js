importScripts("../lib/WebModule.js");

/*
var modules = {}; // { name: { ... }, ... }

var thread = new WebModule.Thread("", function(event, key, value) {
    switch (key) {
    case "#start":
        thread.post(event, "ok");
        break;
    case "#notify":
        var perf  = GLOBAL["performance"] ? GLOBAL["performance"] : Date;
        var time  = perf["now"]();
        var info = value; // { name, blob, repo }

        WebModule.TypedArray.toArrayBuffer(info.blob, function(result) {

            var u8 = new Uint8Array(result);
            var hash = WebModule.Hash["SourceCode"](u8);

console.log(info.name, hash, (perf.now() - time));

            modules[info.name] = { hash: hash, repo: info.repo };
            URL.revokeObjectURL(info.blob);

            // thread.post(event, "#notify#done", info.name);
        }, function(error) {
        });

        break;
    }

}, function(yes, no) {
    yes();
});
 */

onmessage = function(event) {
    switch (event.data) {
    case "#init":
        var port2 = event["ports"][0];
        GLOBAL["postMessage"] = port2.postMessage.bind(port2); // export messageChannel.port2
        //postMessage({ "key": "#init_ok" });

        importScripts("../node_modules/uupaa.hash.js/lib/Hash.js");
        importScripts("../node_modules/uupaa.typedarray.js/lib/TypedArray.js");
        importScripts("../node_modules/uupaa.thread.js/lib/Thread.js");
        importScripts("../node_modules/uupaa.spec.js/lib/Spec.js");
        importScripts("../node_modules/uupaa.spec.js/lib/SpecCatalog.js");
        importScripts("../test/wmtools.js");
        importScripts("Joker.js");
        //importScripts("../test/testcase.js");
        break;
    default:
    }
};

