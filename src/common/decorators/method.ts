/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Token } from '../../context';
import { NodeKey, ParamKey } from '../keys';
import { IdentityOptions } from '../types';
import { Activity } from '../../core';

import 'reflect-metadata';

export type ArgType = 'activity' | 'context' | 'token' | 'data' | 'value';

/**
 * It takes a type and returns a decorator that takes a target, propertyKey, and parameterIndex and
 * adds a metadata object to the target with the type and parameterIndex
 *
 * @param {ArgType} type - The type of the parameter.
 *
 * @returns A decorator function
 */
export function Arg(type: ArgType): any {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

export type MethodOptions = { activity: Activity; context: Context; token: Token; data?: any; value?: any };

/**
 * It takes an options object and returns a function that takes a target, propertyName, and descriptor
 *
 * @param {IdentityOptions} options - IdentityOptions
 *
 * @returns A function that is used as a decorator.
 */
export function Node(options: IdentityOptions): any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const nodes = Reflect.getOwnMetadata(NodeKey, target, '$__metadata__') ?? {};

    if ('name' in options) nodes[options.name] = { options, propertyName };
    else if ('id' in options) nodes[options.id] = { options, propertyName };

    Reflect.defineMetadata(NodeKey, nodes, target, '$__metadata__');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const method = descriptor.value!;

    descriptor.value = function ({ activity, context, token, data, value }: MethodOptions) {
      const params: { parameterIndex: number; type: ArgType }[] = Reflect.getOwnMetadata(
        ParamKey,
        target,
        propertyName,
      );

      if (params?.length) {
        const args: any[] = [];

        if ('$__metadata__' in (this as any)) {
          for (const param of params) {
            if (param.type === 'activity') args.push(activity);
            else if (param.type === 'data') args.push(data);
            else if (param.type === 'value') args.push(value);
            else if (param.type === 'token') args.push(token);
            else if (param.type === 'context') args.push(context);
            else throw new Error('Arguments type is not supported');
          }
        } else throw new Error('@Process decorator is required');

        return method.call(this, ...args);
      }
    };
  };
}
