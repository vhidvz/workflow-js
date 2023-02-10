import { DefineOptions, IdentityOptions, Metadata } from '../types';
import { Container } from '../../core/container';
import { parse, readFile } from '../../utils';
import { Default } from '../keys';

import 'reflect-metadata';

export function DefineProcess(options: DefineOptions & IdentityOptions, id: string = Default) {
  if ('schema' in options) Container.add(id, options.schema);
  if ('xml' in options) Container.add(id, parse(options.xml)['bpmn:definitions']);
  if ('path' in options) Container.add(id, parse(readFile(options.path))['bpmn:definitions']);

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
