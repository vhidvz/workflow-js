import { ProcessOptions, IdentityOptions } from '../types';
import 'reflect-metadata';
/**
 * It takes a ProcessOptions object and an optional id string, and returns a decorator function that
 * takes a class and returns a new class with a  property that contains the ProcessOptions
 * object and the id string
 *
 * @param options - ProcessOptions & IdentityOptions
 * @param {string} id - The id of the process definition.
 *
 * @returns A function that returns a class that extends the class passed in.
 */
export declare function Process(options: Partial<ProcessOptions & IdentityOptions>, id?: string): any;
