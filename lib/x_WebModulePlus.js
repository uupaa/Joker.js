
/*
WebModule.notify = function(info) {
    if (!GLOBAL.WebModule.Thread) {
        return;
    }
    var that = this;

    if (!this._thread) {
        this["startThread"]("../lib/WebModuleThread.js", function() {
            that._threadReady = true;
            that["notify"]();
        }, function(error) {
            throw error;
        });
    }
    if (this._thread && this._threadReady) {
        for (var name in this.modules) {
            var mod = this.modules[name];

            if (!mod["done"]++) {
                this._thread.post(null, "#notify", mod);
            }
        }
    }
};
 */

WebModule.modules = {}; // { name: { name, blob, repo, done }, ... }
WebModule.dump = function() {
    console.table( JSON.parse(JSON.stringify(this.modules)) );
};
WebModule.start = function(src,         // @arg WorkerURL
                           callback,    // @arg Function = null - callback():void
                           errorback) { // @arg Function = null - callback(error:Error):void
    this._msgch = new MessageChannel();
    this._msgch["port1"]["onmessage"] = function(event) {
        switch (event.data.key) {
        case "#init_ok":
            if (callback) {
                callback();
            }
            break;
        case "#import":
            var name = event.data.name;
            var closure = event.data.value;
            var entity = eval( "(" + closure + ")(GLOBAL)" );

            GLOBAL.WebModule[name] = entity;
        }
    };
    this._worker = new Worker(src);
    this._worker.onerror = errorback || null;
    this._worker.postMessage("#init", [ this._msgch["port2"] ]);
};

WebModule.toUint8Array = function(source) {
    var result = new Uint8Array(source.length);

    for (var i = 0, iz = source.length; i < iz; ++i) {
        result[i] = source.charCodeAt(i) & 0xff;
    }
    return result;
};

WebModule.toHash = function(source) {
    var u32 = new Uint32Array([1, 0, source.length, 0, 0, 65521, 5550, 0]);

    while (u32[2] > 0) {
        u32[4] = u32[2] > u32[6] ? u32[6] : u32[2];
        u32[2] -= u32[4];

        do {
            u32[0] += source[u32[3]++];
            u32[1] += u32[0];
        } while (--u32[4]);

        u32[0] %= u32[5];
        u32[1] %= u32[5];
    }
    return ((u32[1] << 16) | u32[0]) >>> 0;
};
WebModule.exports = function(name,      // @arg String - module name
                             closure) { // @arg Function - module closure
                                        // @ret Object - entity
    var alias  = name in GLOBAL ? (name + "_") : name;

    if (alias in this) {
        return this[alias];
    }

    if (IN_BROWSER) {
        console.log("Browser.exports", alias);
        this[alias] = closure(GLOBAL);

    } else if (IN_WORKER) {
        console.log("Worker.exports", alias);
        this[alias] = closure(GLOBAL);

        this.modules[alias] = {
            "name": alias,
            "hash": this.toHash(this.toUint8Array(closure + "")),
            "repo": this[alias]["repository"] || "",
        };
        postMessage({ "key": "#import", "name": alias, "value": closure + "" });
    }
    return this[alias];
};
// old
/*
    exports:    function(name,      // @arg String - module name
                         closure) { // @arg Function - module closure
                                    // @ret Object - entity
        var perf   = GLOBAL["performance"] ? GLOBAL["performance"] : Date;
        var time   = perf["now"]();
        var alias  = name in GLOBAL ? (name + "_") : name;

        if (alias in this.modules) {
            return;
        }
        if (this.verbose) {
            if (IN_WORKER) {
                console.log("Worker.exports", alias);
            } else if (IN_BROWSER) {
                console.log("Browser.exports", alias);
            }
        }

        var entity = closure(GLOBAL);

        this[alias] = entity; // GLOBAL.WebModule[name] = entity

        if (IN_BROWSER) {
            // Main thread でファイルを読みこんだ場合にこのルートにくる
            if (GLOBAL["localStorage"]) {
                localStorage[alias] = closure + "";
            }
            this.modules[alias] = {
                "name": alias,
                "blob": URL.createObjectURL( new Blob([closure], { "type": "text/plain" }) ),
                "repo": this[alias]["repository"] || "",
                "done": 0
            };
            this["notify"]();
            this.times += (perf["now"]() - time);
        }
        return this[alias];
    }
 */

/*
WebModule.startThread = function(src,         // @arg WorkerURL
                                 callback,    // @arg Function - callback():void
                                 errorback) { // @arg Function - callback(error):void

    this._thread = new WebModule.Thread(src, function(event, key, value) {
                            // "ok"
                            console.log(key, value);
                            callback();
                        }, function(exitCode) {
                            console.log("close thread", exitCode);
                            errorback(new Error(exitCode));
                        });
    this._thread.post(null, "#start");
};

WebModule.stopThread = function() {
    this._thread.close();
};
 */

