import { readFile, parse, getBPMNProcess, BPMNSchema, getBPMNElement, BPMNProcess } from '../src';

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

  it('should return bpmn element by id', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const element = getBPMNElement(process!, { id: 'Event_0yc597t' });
    expect(element).toBeDefined();
  });

  it('should return bpmn process by name', () => {
    process = getBPMNProcess(schema['bpmn:definitions'], { name: 'Pizza Vendor' });
    expect(process).toBeDefined();
  });

  it('should return bpmn element by name', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const element = getBPMNElement(process!, { name: 'Bake the Pizza' });
    expect(element).toBeDefined();
  });
});
