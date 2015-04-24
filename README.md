# Joker.js [![Build Status](https://travis-ci.org/uupaa/Joker.js.png)](http://travis-ci.org/uupaa/Joker.js)

[![npm](https://nodei.co/npm/uupaa.joker.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.joker.js/)

Anti-cheat functions.

## Document

- [Joker.js wiki](https://github.com/uupaa/Joker.js/wiki/Joker)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## Run on

### Browser and node-webkit

```js
<script src="lib/Joker.js"></script>
<script>
var spec = new Spec();
var joker = new Joker(spec);

console.log( joker.CANVAS_FINGERPRINT );
console.log( joker.GPU_FINGERPRINT );

</script>
```

### WebWorkers

```js
importScripts("lib/Joker.js");

```

### Node.js

```js
require("lib/Joker.js");

```

