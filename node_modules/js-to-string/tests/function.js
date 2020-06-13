const test = require("ava");
const stringit = require("../lib");
const requireFromString = require("require-from-string");

function bar(value) {
    let thing = true;
    let array = [1, 2, 3, 4, 5];
    if (!value) {
        thing = false;
    }
    return thing;
}

function foo(value) {
    let thing = true;
    if (!value) {
        thing = false;
    }
    return thing;
}

const empty = {
    data: function() {
        return {};
    },
};

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

test("Function", t => {
    const result = stringit(foo);
    const expected = `function foo(value) {
    let thing = true;
    if (!value) {
        thing = false;
    }
    return thing;
}`;
    t.is(result, expected);
});

test("Empty Function", t => {
    const result = stringit(empty);
    const expected = `{"data":function () {
        return {};
    }}`;
    t.is(result, expected);
});

test("Merged Function", t => {
    const mergedData = FixData(notEmpty.data(), {foo: true});

    const options = {
        functions: [
            {
                name: "data",
                toString: function(script) {
                    const func = `module.exports = function data() { return ${stringit(script())}; };`;
                    const required = requireFromString(func);
                    return required;
                },
            },
        ],
    };
    const result = stringit(mergedData, options);

    const expected = `function data() { return {"msg":"Hello world!","messageOuter":"Say Foo","foo":true}; }`;
    t.is(result, expected);
});

test("Not Function", t => {
    const result = stringit(notEmpty);
    const expected = `{"data":function () {
        return {
            msg: "Hello world!",
            messageOuter: "Say Foo"
        };
    }}`;
    t.is(result, expected);
});

test("Array of functions", t => {
    const result = stringit([empty.data, notEmpty.data]);
    const expected = `[function () {
        return {};
    },function () {
        return {
            msg: "Hello world!",
            messageOuter: "Say Foo"
        };
    }]`;
    t.is(result, expected);
});
