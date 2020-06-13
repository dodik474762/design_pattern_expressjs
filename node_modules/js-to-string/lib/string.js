"use strict";
const serialize = require('serialize-javascript');

/**
 * @typedef {Object} CustomFuncType
 * @prop {String} name
 * @prop {Function} toString
 */

/**
 *
 * @param {Object | *} script
 * @param {String} currentElement
 * @returns {String}
 */
function isLastElement(script, currentElement) {
    const elementArray = Object.keys(script);
    const lastElement = elementArray[elementArray.length - 1];

    if (currentElement === lastElement) {
        return "";
    } else {
        return ",";
    }
}

/**
 * @param {any[]} array
 * @param {Object} options
 * @returns {String}
 */
function arrayToString(array, options) {
    let arrayString = "";
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (index > 0) { arrayString += ","; }
        switch (typeof element) {
            case "object":
                const inner = objectToString(element, options);
                arrayString += inner;
                break;
            case "function":
                const stringifiedInner = functionToString(element, options);
                arrayString += stringifiedInner;
                break;
            case "number":
                arrayString += element;
                break;
            default:
                arrayString += serialize(element);
                break;
        }
    }
    return arrayString;
}

/**
 * @param {Function} script
 * @param {Object} options
 * @returns {String}
 */
function functionToString(script, options) {
    "use strict";
    let scriptString = "";
    if (script.name) {
        switch (script.name) {
            case "String":
            case "Number":
            case "Boolean":
            case "Object":
            case "Function":
            case "Array":
            case "Symbol":
                scriptString = script.name;
                break;
            default:
                if (options.functions) {
                    /** @type {(Object|null)} overloadFunc */
                    let overloadFunc = null;
                    /** @param {CustomFuncType} func */
                    const findFunc = function(func) {
                        if (func.name === script.name) {
                            overloadFunc = func;
                        }
                    };
                    options.functions.find(findFunc);
                    if (overloadFunc) {
                        scriptString = overloadFunc.toString(script);
                    } else {
                        scriptString = String(script);
                    }
                } else {
                    scriptString = String(script);
                }
                break;
        }
    } else {
        scriptString = String(script);
    }

    return scriptString;
}

/**
 *
 * @param {Object} script
 * @param {Object} options
 * @returns {String}
 */
function objectToString(script, options) {
    let scriptString = "";
    if (!script) {
        scriptString = "null";
    } else {
        if (script.constructor === Array) {
            let arrayString = arrayToString(script, options);
            scriptString = `[${arrayString}]`;
        } else {
            let objectString = "";
            for (let member in script) {
                if (script.hasOwnProperty(member)) {
                    const element = script[member];
                    switch (typeof element) {
                        case "function":
                            objectString += `"${member}":${functionToString(element, options)}${isLastElement(script, member)}`;
                            break;
                        case "object":
                            objectString += `"${member}":${objectToString(element, options)}${isLastElement(script, member)}`;
                            break;
                        default:
                            objectString += `"${member}":${serialize(element, {isJSON: true})}${isLastElement(script, member)}`;
                            break;
                    }
                }
            }
            scriptString = `{${objectString}}`;
        }
    }

    return scriptString;
}

/**
 * ScriptToString
 * @param {(Object|*)} script
 * @param {Object} [options={}]
 * @returns {String}
 */
function scriptToString(script, options) {
    if (!options) { options = {}; }
    let scriptString = "";
    switch (typeof script) {
        case "function":
            scriptString += functionToString(script, options);
            break;
        case "object":
            const objectString = objectToString(script, options);
            scriptString += objectString;
            break;
        default:
            scriptString += String(script);
    }

    let finalScriptString = `${scriptString}`;
    return finalScriptString;
}

module.exports.scriptToString = scriptToString;
