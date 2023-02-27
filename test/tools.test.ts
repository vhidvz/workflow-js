/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  readFile,
  parse,
  getBPMNProcess,
  BPMNSchema,
  getBPMNActivity,
  BPMNProcess,
  getActivity,
} from '../src';

describe('test util functions', () => {
  let xml: string;
  let schema: BPMNSchema;

  let process: BPMNProcess | undefined;

  it('should return process', () => {
    xml = readFile('./example/supplying-pizza.bpmn');

    schema = parse(xml);
    process = getBPMNProcess(schema['bpmn:definitions'], { id: 'Process_166h0sl' });

    expect(process).toBeDefined();
  });

  it('should return activity', () => {
    const bpmnActivity = getBPMNActivity(process!, { id: 'Event_0yc597t' });

    expect(bpmnActivity).toBeDefined();

    expect(getActivity(process!, { key: '', activity: bpmnActivity! as any })).toBeDefined();
    expect(getActivity(process!, { key: 'task', activity: bpmnActivity! as any })).toBeDefined();
    expect(getActivity(process!, { key: 'event', activity: bpmnActivity! as any })).toBeDefined();
    expect(getActivity(process!, { key: 'gateway', activity: bpmnActivity! as any })).toBeDefined();
  });
});
