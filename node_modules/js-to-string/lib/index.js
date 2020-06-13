// @ts-check
const scriptToString = require("./string").scriptToString;

/**
 * Stringit takes a javascript object and converts it to a string
 * @param {Object} script
 * @param {Object} [options={}]
 */
function stringit(script, options) {
    if (!options) { options = {}; }
    const scriptString = scriptToString(script, options);
    return scriptString;
}
module.exports = stringit;
