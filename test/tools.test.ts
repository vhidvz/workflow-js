/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  readFile,
  parse,
  getBPMNProcess,
  BPMNSchema,
  getBPMNActivity,
  BPMNProcess,
  getActivity,
  takeOutgoing,
  Sequence,
} from '../src';

describe('test tool functions', () => {
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
    const bpmnActivity = getBPMNActivity(process!, { id: 'Event_0yc597t' })?.activity;

    expect(bpmnActivity).toBeDefined();

    expect(getActivity(process!)).toBeDefined();

    expect(getActivity(process!, { key: '', activity: bpmnActivity! as any })).toBeDefined();
    expect(getActivity(process!, { key: 'task', activity: bpmnActivity! as any })).toBeDefined();
    expect(getActivity(process!, { key: 'event', activity: bpmnActivity! as any })).toBeDefined();
    expect(getActivity(process!, { key: 'gateway', activity: bpmnActivity! as any })).toBeDefined();
  });

  it('should return takeOutgoing', () => {
    const bpmnSequence = getBPMNActivity(process!, { id: 'Flow_0yrk5s4' })?.activity;

    expect(bpmnSequence).toBeDefined();

    const sequence = Sequence.build(bpmnSequence! as any, process!);

    expect(sequence).toBeDefined();
    expect(sequence.sourceRef).toBeDefined();
    expect(sequence.targetRef).toBeDefined();

    expect(takeOutgoing([sequence])).toHaveLength(1);
    expect(takeOutgoing([sequence], { name: 'Order a Pizza' })).toHaveLength(1);
    expect(takeOutgoing([sequence], { id: 'Activity_1acydm6' })).toHaveLength(1);
  });
});
