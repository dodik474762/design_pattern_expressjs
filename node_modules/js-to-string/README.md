# js-to-string

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][cov-image]][cov-url] [![Greenkeeper badge](https://badges.greenkeeper.io/danmademe/js-to-string.svg)](https://greenkeeper.io/)


```js
const jsToString = require("js-to-string");

function foo(value) {
    let thing = true;
    let array = [1, 2, 3, 4, 5];
    if (!value) {
        thing = false;
    }
    return thing;
}

const stringFoo = jsToString(foo);
```

## Options

Custom toString methods

Here's a good example of when to use a custom toString method.. if you've merged data outside the function that's being written to string you need to finalise the data first.

```js
const jsToString = require("../lib");
const requireFromString = require("require-from-string");
const notEmpty = {
    data: function() {
        return {
            msg: "Hello world!",
            messageOuter: "Say Foo",
        };
    },
};

function FixData(oldData, newData) {
    const mergedData = Object.assign({}, oldData, newData);
    return function data() {
        return mergedData;
    };
}

const options = {
    functions: [
        {
            name: "data",
            toString: function(script) {
                const func = `module.exports = function data() { return ${jsToString(script())}; };`;
                const required = requireFromString(func);
                return required;
            },
        },
    ],
};

const fixedData = FixData(notEmpty.data(), {foo: true});
notEmpty.data = fixedData;
const result = jsToString(notEmpty, options);
console.log(result);
```


[npm-image]: https://badge.fury.io/js/js-to-string.svg
[npm-url]: https://npmjs.org/package/js-to-string
[travis-image]: https://travis-ci.org/danmademe/js-to-string.svg?branch=master
[travis-url]: https://travis-ci.org/danmademe/js-to-string
[daviddm-image]: https://david-dm.org/danmademe/js-to-string.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/danmademe/js-to-string
[cov-image]: https://codecov.io/gh/danmademe/js-to-string/branch/master/graph/badge.svg
[cov-url]: https://codecov.io/gh/danmademe/js-to-string

