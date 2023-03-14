"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.uid = exports.parse = exports.readFile = void 0;
const xml2js_1 = require("xml2js");
const debug_1 = require("debug");
const fs = __importStar(require("fs"));
/**
 * ReadFile takes a string and returns a string
 *
 * @param {string} path - string - The path to the file you want to read.
 */
const readFile = (path) => fs.readFileSync(path, 'utf8');
exports.readFile = readFile;
/**
 * It takes an XML string and returns a BPMN schema
 *
 * @param {string} xml - string - the XML string to parse
 *
 * @returns A BPMNSchema object
 */
const parse = (xml) => {
    let parse;
    (0, xml2js_1.parseString)(xml, { async: false }, (err, result) => {
        if (err)
            throw err;
        parse = result;
    });
    if (!parse)
        throw new Error('Input string is not parsable');
    return parse;
};
exports.parse = parse;
/**
 * It returns a random string of 36 characters
 */
const uid = () => Math.round(Date.now() * Math.random() * 10).toString(36);
exports.uid = uid;
/**
 * It returns an object with three functions, each of which logs a message with a different color
 *
 * @param {string} namespace - This is the namespace of the logger.
 * @param [prefix=workflow-js] - This is the prefix that will be used for the debug module.
 *
 * @returns An object with three functions.
 */
const logger = (namespace, prefix = 'workflow-js') => {
    const log = (0, debug_1.debug)(`${prefix}:${namespace}`);
    return {
        error: (formatter, ...args) => log(`\x1b[31m${'[ERROR]'} ` + formatter, ...args, '\x1b[0m'),
        warn: (formatter, ...args) => log(`\x1b[33m${'[WARNING]'} ` + formatter, ...args, '\x1b[0m'),
        info: (formatter, ...args) => log(`\x1b[34m${'[INFO]'} ` + formatter, ...args, '\x1b[0m'),
        debug: (formatter, ...args) => log(`\x1b[36m${'[DEBUG]'} ` + formatter, ...args, '\x1b[0m'),
    };
};
exports.logger = logger;
//# sourceMappingURL=utils.js.map