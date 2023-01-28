import { $, BPMNDefinition, BPMNProcess, BPMNSchema } from './type';
import { AttributeOptions } from './common/types';

import { parseString } from 'xml2js';
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

export const getBPMNElement = (process: BPMNProcess, options: AttributeOptions) => {
  for (const elements of Object.values(process)) {
    if (typeof elements === 'object' && Array.isArray(elements)) {
      for (const element of elements) {
        if ('id' in options && '$' in element && (element.$ as $).id === options.id) return element;
        if ('name' in options && '$' in element && (element.$ as $).name === options.name) return element;
      }
    }
  }
};

export const getBPMNProcess = (definition: BPMNDefinition, options: AttributeOptions) => {
  const processes = definition['bpmn:process'];
  const collaborations = definition['bpmn:collaboration'];

  if ('name' in options) {
    let processId: string | undefined;

    collaborations.some((collaboration) => {
      const participant = collaboration['bpmn:participant'].find((el) => el.$.name === options.name);
      return !!(processId = participant?.$?.processRef);
    });

    return processes.find((process) => process.$.id === processId);
  }

  return processes.find((process) => process.$.id === options.id);
};
