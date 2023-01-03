import { parseString } from 'xml2js';
import { BPMNSchema } from './type';

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
