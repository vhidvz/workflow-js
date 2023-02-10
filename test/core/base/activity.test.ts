import { BPMNSchema, Activity, parse, readFile, getBPMNProcess } from '../../../src';

describe('test core base activity class', () => {
  let schema: BPMNSchema;

  it('should read xml file and parse to definition object', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));
  });

  it('should define activity object', () => {
    const process = getBPMNProcess(schema['bpmn:definitions'], { name: 'Pizza Customer' });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activity = Activity.build(schema['bpmn:definitions'], process!);

    expect(activity.$).toEqual(schema['bpmn:definitions'].$);
    expect(activity.id).toBe(schema['bpmn:definitions'].$.id);
    expect(activity.name).toBe(schema['bpmn:definitions'].$.name);
  });
});
