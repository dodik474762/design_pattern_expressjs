const test = require("ava");
const stringit = require("../lib");

test("Symbol", t => {
    let obj = {
        type1: String,
        type2: Number,
        type3: Boolean,
        type4: Function,
        type5: Object,
        type6: Array,
        type7: Symbol,
    };

    const result = stringit(obj);
    const expected = `{"type1":String,"type2":Number,"type3":Boolean,"type4":Function,"type5":Object,"type6":Array,"type7":Symbol}`;
    t.is(result, expected);
});
