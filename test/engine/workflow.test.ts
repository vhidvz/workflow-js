/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BPMNSchema, parse, readFile, getBPMNProcess, BPMNProcess, Activity } from '../../src';

describe('test workflow engine class', () => {
  let xml: string;
  let schema: BPMNSchema;
  let activity: Activity | undefined;

  let process: BPMNProcess | undefined;

  it('should return process', () => {
    xml = readFile('./example/supplying-pizza.bpmn');

    schema = parse(xml);
    process = getBPMNProcess(schema['bpmn:definitions'], { id: 'Process_166h0sl' });

    expect(process).toBeDefined();
  });
});
