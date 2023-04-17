/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProcessOptions, IdentityOptions, Metadata } from '../types';
import { parse, readFile, uid } from '../../utils';
import { Container } from '../../core/container';

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
export function Process(options: Partial<ProcessOptions & IdentityOptions>, id: string = uid()): any {
  if ('schema' in options) Container.addDefinition(id, options.schema!);
  if ('xml' in options) Container.addDefinition(id, parse(options.xml!)['bpmn:definitions']);
  if ('path' in options) Container.addDefinition(id, parse(readFile(options.path!))['bpmn:definitions']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      $__metadata__: Metadata = {
        definition: { id },
        process: {
          ...('id' in options ? { id: options.id } : {}),
          ...('name' in options ? { name: options.name } : {}),
        } as Metadata['process'],
      };
    };
  };
}
