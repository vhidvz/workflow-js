import { $, BPMNDefinition, BPMNProcess, BPMNSchema } from './type';
import { IdentityOptions } from './common';

import { parseString } from 'xml2js';
import { nanoid } from 'nanoid';
import fs from 'fs';

export const readFile = (path: string): string => fs.readFileSync(path, 'utf8');

export const parse = (xml: string): BPMNSchema => {
  let parse;
  parseString(xml, { async: false }, (err, result) => {
    if (err) throw err;
    parse = result;
  });

  if (!parse) throw new Error('Input string is not parsable');

  return parse;
};

export const getBPMNElement = (process: BPMNProcess, identity: IdentityOptions) => {
  for (const elements of Object.values(process)) {
    if (typeof elements === 'object' && Array.isArray(elements)) {
      for (const element of elements) {
        if ('id' in identity && '$' in element && (element.$ as $).id === identity.id) return element;
        if ('name' in identity && '$' in element && (element.$ as $).name === identity.name) return element;
      }
    }
  }
};

export const getBPMNProcess = (definition: BPMNDefinition, identity: IdentityOptions) => {
  const processes = definition['bpmn:process'];
  const collaborations = definition['bpmn:collaboration'];

  if ('name' in identity) {
    let processId: string | undefined;

    collaborations.some((collaboration) => {
      const participant = collaboration['bpmn:participant'].find((el) => el.$.name === identity.name);
      return !!(processId = participant?.$?.processRef);
    });

    return processes.find((process) => process.$.id === processId);
  }

  return processes.find((process) => process.$.id === identity.id);
};

export const uid = (): string => nanoid();

export const getIdentity = (identity?: IdentityOptions): string => {
  const id = identity && 'id' in identity ? identity.id : undefined;
  const name = identity && 'name' in identity ? identity.name : undefined;

  return id ?? name ?? 'default';
};
