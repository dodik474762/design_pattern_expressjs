const test = require("ava");
const stringit = require("../lib");

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

test("Array", t => {
    let array = [1, 2, 3, 4, 5];

    const result = stringit(array);
    const expected = `[1,2,3,4,5]`;
    t.is(result, expected);
});

test("XSS Array", t=> {
    const array =  ["</script>", ["</script>"]]
    const result = stringit(array);
    t.false(result.includes("</script>"));
})

test("String", t => {
    let str = "foobar";

    const result = stringit(str);
    const expected = `foobar`;
    t.is(result, expected);
});

test("Object", t => {

    const objectt = {
        aBoolean: true,
        aNumber: 12,
        aFunction: bar,
        aString: "foobar",
        aArray: [1, 2, 3, 4, 5],
    };
    const result = stringit(objectt);
    const expected = `{"aBoolean":true,"aNumber":12,"aFunction":function bar(value) {
    let thing = true;
    let array = [1, 2, 3, 4, 5];
    if (!value) {
        thing = false;
    }
    return thing;
},"aString":"foobar","aArray":[1,2,3,4,5]}`;
    t.is(result, expected);
});

test("XSS Object", t => {
    const objectt = {
        aString: "</script>",
        aObject: {
            aString: "</script>"
        }
    }
    const result = stringit(objectt);
    t.false(result.includes("</script>"));
});

test("Big", t => {
    const big = {
        mixins: [bar],
        components: {
            foo,
        },
        data: function() {
            return {
                user: false,
                currentModifier: "STANDARD",
                currentProduct: 0,
            };
        },
        methods: {
            selectModifier: function(newModifier) {
                this.currentModifier = newModifier;
            },
            successHandler: function(response) {
                this.location = response.url;
            },
            errorHandler: function(error) {
                this.error = error;
            },
            hideError: function() {
                this.error = "";
            },
        },
    };
    const result = stringit(big);
    const expected = `{"mixins":[function bar(value) {
    let thing = true;
    let array = [1, 2, 3, 4, 5];
    if (!value) {
        thing = false;
    }
    return thing;
}],"components":{"foo":function foo(value) {
    let thing = true;
    if (!value) {
        thing = false;
    }
    return thing;
}},"data":function () {
            return {
                user: false,
                currentModifier: "STANDARD",
                currentProduct: 0
            };
        },"methods":{"selectModifier":function (newModifier) {
                this.currentModifier = newModifier;
            },"successHandler":function (response) {
                this.location = response.url;
            },"errorHandler":function (error) {
                this.error = error;
            },"hideError":function () {
                this.error = "";
            }}}`;
    t.is(result, expected);
});
