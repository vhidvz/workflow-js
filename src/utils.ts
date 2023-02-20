import { $, BPMNDefinition, BPMNProcess, BPMNSchema } from './type';
import { IdentityOptions } from './common';

import { parseString } from 'xml2js';
import * as fs from 'fs';

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

export const getBPMNActivity = (process: BPMNProcess, identity: IdentityOptions) => {
  for (const [key, activities] of Object.entries(process)) {
    if (typeof activities === 'object' && Array.isArray(activities)) {
      for (const activity of activities) {
        if ('id' in identity && '$' in activity && (activity.$ as $).id === identity.id)
          return { key, activity };
        if ('name' in identity && '$' in activity && (activity.$ as $).name === identity.name)
          return { key, activity };
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

export const uid = () => Math.round(Date.now() * Math.random() * 10).toString(36);
