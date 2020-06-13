const stringit = require("../lib");
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
                const func = `module.exports = function data() { return ${stringit(script())}; };`;
                const required = requireFromString(func);
                return required;
            },
        },
    ],
};

const fixedData = FixData(notEmpty.data(), {foo: true});
notEmpty.data = fixedData;
const result = stringit(notEmpty, options);
// tslint:disable-next-line:no-console
console.log(result);
