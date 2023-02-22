import { BPMNSchema, parse, readFile } from '../../../src';

describe('test core base sequence class', () => {
  let schema: BPMNSchema;

  it('should read xml file and parse to definition object', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));
  });
});
