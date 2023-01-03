import { readFile, parse } from '../src';

describe('test util functions', () => {
  let xml: string;

  it('should return read xml file', () => {
    xml = readFile('./example/supplying-pizza.bpmn');
    expect(xml).toBeDefined();
  });

  it('should return parse xml to object', () => {
    const obj = parse(xml);
    expect(obj).toBeDefined();
  });
});
