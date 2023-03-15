/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFile, parse, getBPMNProcess, getWrappedBPMNElement, getActivity, takeOutgoing } from '../src';
import { BPMNActivity, BPMNProcess, BPMNSchema, BPMNSequenceFlow } from '../src/type';
import { Sequence } from '../src/core';

describe('test tool functions', () => {
  let schema: BPMNSchema;

  let processPizzaVendor: BPMNProcess;
  let processPizzaCustomer: BPMNProcess;

  it('should return bpmn process by id', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));

    processPizzaCustomer = getBPMNProcess(schema['bpmn:definitions'], { id: 'Process_166h0sl' })!;

    expect(processPizzaCustomer).toBeDefined();
  });

  it('should return bpmn process by name', () => {
    processPizzaVendor = getBPMNProcess(schema['bpmn:definitions'], { name: 'Pizza Vendor' })!;

    expect(processPizzaVendor).toBeDefined();
  });

  it('should return bpmn activity by id', () => {
    const activity = getWrappedBPMNElement(processPizzaCustomer, { id: 'Event_0yc597t' });

    expect(activity).toBeDefined();
  });

  it('should return bpmn activity by name and id', () => {
    const activity = getWrappedBPMNElement(processPizzaVendor, { name: 'Bake the Pizza' });

    expect(activity).toBeDefined();
  });

  it('should return activity instance', () => {
    const bpmnActivity = getWrappedBPMNElement(processPizzaCustomer, { id: 'Event_0yc597t' })
      ?.element as BPMNActivity;

    expect(bpmnActivity).toBeDefined();

    expect(getActivity(processPizzaCustomer)).toBeDefined();

    expect(getActivity(processPizzaCustomer, { key: '', element: bpmnActivity })).toBeDefined();
    expect(getActivity(processPizzaCustomer, { key: 'task', element: bpmnActivity })).toBeDefined();
    expect(getActivity(processPizzaCustomer, { key: 'event', element: bpmnActivity })).toBeDefined();
    expect(getActivity(processPizzaCustomer, { key: 'gateway', element: bpmnActivity })).toBeDefined();
  });

  it('should return outgoing activities ', () => {
    const bpmnSequence = getWrappedBPMNElement(processPizzaCustomer, { id: 'Flow_0yrk5s4' })
      ?.element as BPMNSequenceFlow;

    expect(bpmnSequence).toBeDefined();

    const sequence = Sequence.build(bpmnSequence, processPizzaCustomer);

    expect(sequence).toBeDefined();
    expect(sequence.sourceRef).toBeDefined();
    expect(sequence.targetRef).toBeDefined();

    expect(takeOutgoing([sequence])).toHaveLength(1);
    expect(takeOutgoing([sequence], { name: 'Order a Pizza' })).toHaveLength(1);
    expect(takeOutgoing([sequence], { id: 'Activity_1acydm6' })).toHaveLength(1);
  });
});
