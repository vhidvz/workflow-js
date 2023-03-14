import 'reflect-metadata';
export type ParamType = 'activity' | 'context' | 'token' | 'data' | 'value';
/**
 * It takes a ParamType and returns a decorator function that takes a target, propertyKey, and
 * parameterIndex and stores the parameterIndex and type in a metadata array
 *
 * @param {ParamType} type - ParamType - This is the type of parameter we're defining.
 *
 * @returns A function that takes in a target, propertyKey, and parameterIndex.
 */
export declare function Param(type: ParamType): any;
/**
 * It takes a parameter index and adds it to the list of parameters that are decorated with the
 * `@Act` decorator
 *
 * @returns A decorator function
 */
export declare function Act(): any;
/**
 * It adds a parameter to the list of parameters that will be injected into the function
 *
 * @returns A decorator function
 */
export declare function Ctx(): any;
/**
 * It adds a parameter to the list of parameters for the decorated function
 *
 * @returns A decorator function
 */
export declare function Sign(): any;
/**
 * It adds a metadata to the target function, which is the function that the decorator is attached to
 *
 * @returns A decorator function
 */
export declare function Data(): any;
/**
 * It adds a metadata to the target function, which is the function that the decorator is attached to
 *
 * @returns A decorator function
 */
export declare function Value(): any;
