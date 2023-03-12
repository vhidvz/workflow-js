import { readFile, parse, uid } from '../src/utils';

describe('test util functions', () => {
  let xml: string;

  it('should return read xml file', () => {
    xml = readFile('./example/supplying-pizza.bpmn');
    expect(xml).toBeDefined();
  });

  it('should return parse xml to object', () => {
    const schema = parse(xml);
    expect(schema).toBeDefined();
  });

  it('should return uid', () => {
    expect(uid()).toBeDefined();
  });
});
