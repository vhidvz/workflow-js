import { BPMNSchema, Sequence, getBPMNProcess, parse, readFile } from '../../../src';

describe('test core base sequence class', () => {
  let schema: BPMNSchema;

  it('should read xml file and parse to definition object', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));
  });

  it('should define sequence object', () => {
    const process = getBPMNProcess(schema['bpmn:definitions'], { name: 'Pizza Customer' });

    const sequenceFlow = process?.['bpmn:sequenceFlow']?.[0];
  });
});
