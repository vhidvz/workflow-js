import {
  Activity,
  BPMNElement,
  BPMNSchema,
  BPMNSequenceFlow,
  Sequence,
  getBPMNActivity,
  getBPMNProcess,
  parse,
  readFile,
} from '../../../src';

describe('test core base sequence class', () => {
  let schema: BPMNSchema;

  it('should read xml file and parse to definition object', () => {
    schema = parse(readFile('./example/supplying-pizza.bpmn'));
  });

  it('should define sequence object', () => {
    const process = getBPMNProcess(schema['bpmn:definitions'], { name: 'Pizza Customer' });

    const sequenceBPMN = getBPMNActivity(process!, { id: 'Flow_1x6ee0h' });
    const sourceBPMN = getBPMNActivity(process!, { id: 'Activity_1acydm6' });
    const targetBPMN = getBPMNActivity(process!, { id: 'Gateway_0s7y3gr' });
  });
});
