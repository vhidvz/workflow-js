import { $, BPMNDefinition, BPMNProcess, BPMNSchema } from './type';
import { IdentityOptions } from './common';

import { parseString } from 'xml2js';
import * as fs from 'fs';

/**
 * ReadFile takes a string and returns a string
 *
 * @param {string} path - string - The path to the file you want to read.
 */
export const readFile = (path: string): string => fs.readFileSync(path, 'utf8');

/**
 * It takes an XML string and returns a BPMN schema
 *
 * @param {string} xml - string - the XML string to parse
 *
 * @returns A BPMNSchema object
 */
export const parse = (xml: string): BPMNSchema => {
  let parse;
  parseString(xml, { async: false }, (err, result) => {
    if (err) throw err;
    parse = result;
  });

  if (!parse) throw new Error('Input string is not parsable');

  return parse;
};

/**
 * It takes a BPMNProcess and an IdentityOptions and returns an object with a key and an activity
 *
 * @param {BPMNProcess} process - The BPMNProcess object
 * @param {IdentityOptions} identity - IdentityOptions
 *
 * @returns An object with two properties: key and activity.
 */
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

/**
 * It takes a BPMN definition and an identity object, and returns the process that matches the identity
 *
 * @param {BPMNDefinition} definition - The BPMN definition object.
 * @param {IdentityOptions} identity - IdentityOptions
 *
 * @returns A BPMNProcess
 */
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

/**
 * It returns a random string of 36 characters
 */
export const uid = () => Math.round(Date.now() * Math.random() * 10).toString(36);
