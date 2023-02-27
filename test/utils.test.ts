import {
  readFile,
  parse,
  getBPMNProcess,
  BPMNSchema,
  getBPMNActivity,
  BPMNProcess,
  uid,
  logger,
} from '../src';

describe('test util functions', () => {
  let xml: string;
  let schema: BPMNSchema;

  let process: BPMNProcess | undefined;

  it('should return read xml file', () => {
    xml = readFile('./example/supplying-pizza.bpmn');
    expect(xml).toBeDefined();
  });

  it('should return parse xml to object', () => {
    schema = parse(xml);
    expect(schema).toBeDefined();
  });

  it('should return bpmn process by id', () => {
    process = getBPMNProcess(schema['bpmn:definitions'], { id: 'Process_166h0sl' });
    expect(process).toBeDefined();
  });

  it('should return bpmn activity by id', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activity = getBPMNActivity(process!, { id: 'Event_0yc597t' });
    expect(activity).toBeDefined();
  });

  it('should return bpmn process by name', () => {
    process = getBPMNProcess(schema['bpmn:definitions'], { name: 'Pizza Vendor' });
    expect(process).toBeDefined();
  });

  it('should return bpmn activity by name and id', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activity = getBPMNActivity(process!, { name: 'Bake the Pizza' });
    expect(activity).toBeDefined();
  });

  it('should return bpmn undefined activity', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activity = getBPMNActivity(process!, { name: 'no name' });
    expect(activity).toBeUndefined();
  });

  it('should return uid', () => {
    expect(uid()).toBeDefined();
  });

  it('should print log', () => {
    const log = logger('test');

    expect(log).toBeDefined();
    expect(log.log('test')).toBeUndefined();
  });
});
