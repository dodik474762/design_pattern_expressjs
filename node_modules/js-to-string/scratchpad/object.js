const stringit = require("../lib");

const obj = {
    foo: true,
    "bar-thing": false,
};

const result = stringit(obj);
console.log(result);
