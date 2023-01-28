import { readFile, parse, Attribute, BPMNSchema } from '../../../src';

describe('test core base attribute class', () => {
  let schema: BPMNSchema;

  it('should read xml file and parse to definition object', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));
  });

  it('should define attribute object', () => {
    const attribute = new Attribute(schema['bpmn:definitions']);

    expect(attribute.$).toEqual(schema['bpmn:definitions'].$);
    expect(attribute.id).toBe(schema['bpmn:definitions'].$.id);
    expect(attribute.name).toBe(schema['bpmn:definitions'].$.name);
  });
});
