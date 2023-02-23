/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParamKey } from '../keys';
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
export function Param(type: ParamType): any {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

/**
 * It takes a parameter index and adds it to the list of parameters that are decorated with the
 * `@Act` decorator
 *
 * @returns A decorator function
 */
export function Act(): any {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type: 'activity' });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

/**
 * It adds a parameter to the list of parameters that will be injected into the function
 *
 * @returns A decorator function
 */
export function Ctx(): any {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type: 'context' });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

/**
 * It adds a parameter to the list of parameters for the decorated function
 *
 * @returns A decorator function
 */
export function Sign(): any {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type: 'token' });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

/**
 * It adds a metadata to the target function, which is the function that the decorator is attached to
 *
 * @returns A decorator function
 */
export function Data(): any {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type: 'data' });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

/**
 * It adds a metadata to the target function, which is the function that the decorator is attached to
 *
 * @returns A decorator function
 */
export function Value(): any {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type: 'value' });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}
