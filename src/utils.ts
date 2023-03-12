import { BPMNSchema } from './type';

import { parseString } from 'xml2js';
import * as dotenv from 'dotenv';
import * as log4js from 'log4js';
import * as fs from 'fs';

dotenv.config();

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
 * It returns a random string of 36 characters
 */
export const uid = () => Math.round(Date.now() * Math.random() * 10).toString(36);

/**
 * It takes a string and returns a function that takes a string and returns a string.
 *
 * @param {string} scope - The scope of the logger. This is used to filter the logs.
 */
export const logger = (scope: string) => {
  const log = log4js.getLogger(scope);

  log.level = process.env?.LOG4JS_CONFIG ?? log4js.levels.ALL;

  return log;
};
