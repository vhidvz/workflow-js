import { BPMNSchema, Element, parse, readFile } from '../../../src';

describe('test core base element class', () => {
  let schema: BPMNSchema;

  it('should read xml file and parse to definition object', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));
  });

  it('should define element object', () => {
    const element = Element.build(schema['bpmn:definitions']);

    expect(element.$).toEqual(schema['bpmn:definitions'].$);
    expect(element.id).toBe(schema['bpmn:definitions'].$.id);
    expect(element.name).toBe(schema['bpmn:definitions'].$.name);
  });
});
