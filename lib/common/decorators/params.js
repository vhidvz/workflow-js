"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = exports.Data = exports.Sign = exports.Ctx = exports.Act = exports.Param = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const keys_1 = require("../keys");
require("reflect-metadata");
/**
 * It takes a ParamType and returns a decorator function that takes a target, propertyKey, and
 * parameterIndex and stores the parameterIndex and type in a metadata array
 *
 * @param {ParamType} type - ParamType - This is the type of parameter we're defining.
 *
 * @returns A function that takes in a target, propertyKey, and parameterIndex.
 */
function Param(type) {
    return function (target, propertyKey, parameterIndex) {
        var _a;
        const params = (_a = Reflect.getOwnMetadata(keys_1.ParamKey, target, propertyKey)) !== null && _a !== void 0 ? _a : [];
        params.unshift({ parameterIndex, type });
        Reflect.defineMetadata(keys_1.ParamKey, params, target, propertyKey);
    };
}
exports.Param = Param;
/**
 * It takes a parameter index and adds it to the list of parameters that are decorated with the
 * `@Act` decorator
 *
 * @returns A decorator function
 */
function Act() {
    return function (target, propertyKey, parameterIndex) {
        var _a;
        const params = (_a = Reflect.getOwnMetadata(keys_1.ParamKey, target, propertyKey)) !== null && _a !== void 0 ? _a : [];
        params.unshift({ parameterIndex, type: 'activity' });
        Reflect.defineMetadata(keys_1.ParamKey, params, target, propertyKey);
    };
}
exports.Act = Act;
/**
 * It adds a parameter to the list of parameters that will be injected into the function
 *
 * @returns A decorator function
 */
function Ctx() {
    return function (target, propertyKey, parameterIndex) {
        var _a;
        const params = (_a = Reflect.getOwnMetadata(keys_1.ParamKey, target, propertyKey)) !== null && _a !== void 0 ? _a : [];
        params.unshift({ parameterIndex, type: 'context' });
        Reflect.defineMetadata(keys_1.ParamKey, params, target, propertyKey);
    };
}
exports.Ctx = Ctx;
/**
 * It adds a parameter to the list of parameters for the decorated function
 *
 * @returns A decorator function
 */
function Sign() {
    return function (target, propertyKey, parameterIndex) {
        var _a;
        const params = (_a = Reflect.getOwnMetadata(keys_1.ParamKey, target, propertyKey)) !== null && _a !== void 0 ? _a : [];
        params.unshift({ parameterIndex, type: 'token' });
        Reflect.defineMetadata(keys_1.ParamKey, params, target, propertyKey);
    };
}
exports.Sign = Sign;
/**
 * It adds a metadata to the target function, which is the function that the decorator is attached to
 *
 * @returns A decorator function
 */
function Data() {
    return function (target, propertyKey, parameterIndex) {
        var _a;
        const params = (_a = Reflect.getOwnMetadata(keys_1.ParamKey, target, propertyKey)) !== null && _a !== void 0 ? _a : [];
        params.unshift({ parameterIndex, type: 'data' });
        Reflect.defineMetadata(keys_1.ParamKey, params, target, propertyKey);
    };
}
exports.Data = Data;
/**
 * It adds a metadata to the target function, which is the function that the decorator is attached to
 *
 * @returns A decorator function
 */
function Value() {
    return function (target, propertyKey, parameterIndex) {
        var _a;
        const params = (_a = Reflect.getOwnMetadata(keys_1.ParamKey, target, propertyKey)) !== null && _a !== void 0 ? _a : [];
        params.unshift({ parameterIndex, type: 'value' });
        Reflect.defineMetadata(keys_1.ParamKey, params, target, propertyKey);
    };
}
exports.Value = Value;
//# sourceMappingURL=params.js.map