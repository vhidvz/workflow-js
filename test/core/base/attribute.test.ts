import { readFile, parse, Attribute, BPMNSchema, getBPMNProcess } from '../../../src';

describe('test core base attribute class', () => {
  let schema: BPMNSchema;

  it('should read xml file and parse to definition object', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));
  });

  it('should define attribute object', () => {
    const process = getBPMNProcess(schema['bpmn:definitions'], { name: 'Pizza Customer' });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const attribute = new Attribute(process!, schema['bpmn:definitions']);

    expect(attribute.$).toEqual(schema['bpmn:definitions'].$);
    expect(attribute.id).toBe(schema['bpmn:definitions'].$.id);
    expect(attribute.name).toBe(schema['bpmn:definitions'].$.name);
  });
});
