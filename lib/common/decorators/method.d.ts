import { Context, Token } from '../../context';
import { IdentityOptions } from '../types';
import { Activity } from '../../core';
export type MethodOptions = {
    activity: Activity;
    context: Context;
    token: Token;
    data?: any;
    value?: any;
};
/**
 * It takes an options object and returns a function that takes a target, propertyName, and descriptor
 *
 * @param {IdentityOptions} options - IdentityOptions
 *
 * @returns A function that is used as a decorator.
 */
export declare function Node(options: IdentityOptions): any;
