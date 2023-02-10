/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeKey, ParamKey } from '../keys';
import { IdentityOptions } from '../types';
import { BPMNProcess } from '../../type';
import { Activity } from '../../core';

import 'reflect-metadata';
import { getBPMNActivity } from 'utils';
import { getActivity } from 'tools';

export type ArgType = 'activity' | 'token' | 'value';

export function Arg(type: ArgType) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getOwnMetadata(ParamKey, target, propertyKey) ?? [];

    params.unshift({ parameterIndex, type });

    Reflect.defineMetadata(ParamKey, params, target, propertyKey);
  };
}

export type MethodOptions = { activity: Activity; token: any; value?: any };

export function Node(options: IdentityOptions) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const nodes = Reflect.getOwnMetadata(NodeKey, target, '$__metadata__') ?? {};

    if ('name' in options) nodes[options.name] = { options, propertyName };
    else if ('id' in options) nodes[options.id] = { options, propertyName };

    Reflect.defineMetadata(NodeKey, nodes, target, '$__metadata__');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const method = descriptor.value!;

    descriptor.value = function (process: BPMNProcess, { activity, token, value }: MethodOptions) {
      const params: { parameterIndex: number; type: ArgType }[] = Reflect.getOwnMetadata(
        ParamKey,
        target,
        propertyName,
      );

      if (params.length) {
        const args: any[] = [];

        if ('$__metadata__' in (this as any)) {
          for (const param of params) {
            if (param.type === 'activity') {
              const opt = getBPMNActivity(process, activity);
              args.push(opt ? getActivity(process, opt) : null);
            } else if (param.type === 'token') args.push(token);
            else if (param.type === 'value') args.push(value);
            else throw new Error('Arguments type is not supported');
          }
        } else throw new Error('@DefineProcess decorator is required.');

        return method.call(this, ...args);
      }
    };
  };
}
