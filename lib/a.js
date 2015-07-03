WebModule.prototype.dump = function() {
    console.table( JSON.parse(JSON.stringify(this._modules)) );
};

WebModule.prototype.notify = function(info) {
    if (!GLOBAL["Thread"]) {
        return;
    }
    var that = this;

    if (!this._thread) {
        this["startThread"]("../lib/WebModuleWorker.js", function() {
            that._threadReady = true;
            that["notify"]();
        }, function(error) {
            throw error;
        });
    }
    if (this._thread && this._threadReady) {
        for (var name in this._modules) {
            var mod = this._modules[name];

            if (!mod["done"]++) {
                this._thread.post(null, "#notify", mod);
            }
        }
    }
};

WebModule.prototype.startThread = function(src,         // @arg WorkerURL
                                           callback,    // @arg Function - callback():void
                                           errorback) { // @arg Function - callback(error):void

    this._thread = new Thread(src, function(event, key, value) {
                            // "ok"
                            console.log(key, value);
                            callback();
                        }, function(exitCode) {
                            console.log("close thread", exitCode);
                            errorback(new Error(exitCode));
                        });
    this._thread.post(null, "#start");
};

WebModule.prototype.stopThread = function() {
    this._thread.close();
};



