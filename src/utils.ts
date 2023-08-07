import { parseString } from 'xml2js';
import { debug } from 'debug';

import * as crypto from 'crypto';
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
export const parse = (xml: string) => {
  xml = xml.replace(/bpmn\d?:/g, 'bpmn:');

  let parse;
  parseString(xml, { async: false }, (err, result) => {
    if (err) throw err;
    parse = result;
  });

  if (!parse) throw new Error('Input string is not parsable');

  return parse;
};

/**
 * generates a random string of hexadecimal characters of a given size (default 16) using the Node.js built-in 'crypto' module's
 *
 * @param size - length of uid
 *
 * @returns An uid string in hex
 */
export const uid = (size = 8) => crypto.randomBytes(size).toString('hex');

/**
 * It returns an object with three functions, each of which logs a message with a different color
 *
 * @param {string} namespace - This is the namespace of the logger.
 * @param [prefix=workflow-js] - This is the prefix that will be used for the debug module.
 *
 * @returns An object with three functions.
 */
export const logger = (namespace: string, prefix = 'workflow-js') => {
  const log = debug(`${prefix}:${namespace}`);

  return {
    hit: (formatter: string, ...args: unknown[]) =>
      log(`\x1b[32m${'[HIT]'} ` + formatter, ...args, '\x1b[0m'),
    miss: (formatter: string, ...args: unknown[]) =>
      log(`\x1b[35m${'[MISS]'} ` + formatter, ...args, '\x1b[0m'),
    error: (formatter: string, ...args: unknown[]) =>
      log(`\x1b[31m${'[ERROR]'} ` + formatter, ...args, '\x1b[0m'),
    warn: (formatter: string, ...args: unknown[]) =>
      log(`\x1b[33m${'[WARNING]'} ` + formatter, ...args, '\x1b[0m'),
    info: (formatter: string, ...args: unknown[]) =>
      log(`\x1b[34m${'[INFO]'} ` + formatter, ...args, '\x1b[0m'),
    debug: (formatter: string, ...args: unknown[]) =>
      log(`\x1b[36m${'[DEBUG]'} ` + formatter, ...args, '\x1b[0m'),
  };
};
