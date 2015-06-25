var meta = {
    token:  "",
    code:   {}, // { name: code, ... }
    hash:   {}, // { name: hash, ... }
    vital:  { max: 0, min: 0, average: 0, pulse: 0, signs: [] },
    fingerprint2D: 0x0,
    fingerprint3D: 0x0,
};

onmessage = function(event) {
    var msg  = event.data[0];
    var data = event.data[1];

    switch (msg) {
    case "#INIT":
        meta.token = data;
        meta.vitalPulse = event.data[2];
        importScripts.apply(null, event.data[3]);
        break;
    case "#FP2D": meta.fingerprint2D = _adler32(new Uint8Array(data)); break;
    case "#FP3D": meta.fingerprint3D = _adler32(_toUint8Array(data)); break;
    case "#VITAL":
        meta.vital.signs.push(Date.now());
        // TODO: impl
        // self.ping ? self.ping() : _ping();
        break;
    case "#JUDGE":
        _makeHash(data);
        // TODO: impl
        // self.judge ? self.judge() : _judge();
        break;
    default: break;
    }
};

function _ping() {
    var url = "https://example.com/ping?token=" + meta.token;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
}

function _judge() {
    _vital();
}

function _vital() {
    if (meta.vital.signs.length) {
        var total = meta.vital.signs.reduce(function(current, value) {
                        return current + value;
                    }, 0);
        meta.vital.average = total / meta.vital.signs.length;
        meta.vital.max = Math.max.apply(null, meta.vital.signs);
        meta.vital.min = Math.min.apply(null, meta.vital.signs);
    }
}

function _makeHash(data) {
    for (var name in data) { // { name: closure, ... }
        meta.code[name] = data[name];
        meta.hash[name] = _adler32(_toUint8Array(data[name]));
    }
}

function _toUint8Array(source) {
    var result = new Uint8Array(source.length);

    for (var i = 0, iz = source.length; i < iz; ++i) {
        result[i] = source.charCodeAt(i) & 0xff;
    }
    return result;
}

function _adler32(source) {
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
}

