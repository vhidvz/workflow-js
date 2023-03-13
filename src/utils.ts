import { parseString } from 'xml2js';
import { debug } from 'debug';
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
  let parse;
  parseString(xml, { async: false }, (err, result) => {
    if (err) throw err;
    parse = result;
  });

  if (!parse) throw new Error('Input string is not parsable');

  return parse;
};

/**
 * It returns a random string of 36 characters
 */
export const uid = () => Math.round(Date.now() * Math.random() * 10).toString(36);

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
