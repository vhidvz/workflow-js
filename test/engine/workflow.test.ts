/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BPMNSchema,
  parse,
  readFile,
  getBPMNProcess,
  BPMNProcess,
  Process,
  Node,
  Act,
  EventActivity,
  WorkflowJS,
  Status,
  Data,
  Value,
} from '../../src';

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();

    return data && value;
  }
}

describe('test workflow engine class', () => {
  let xml: string;
  let schema: BPMNSchema;

  let process: BPMNProcess | undefined;

  it('should return process', () => {
    xml = readFile('./example/simple-workflow.bpmn');

    schema = parse(xml);
    process = getBPMNProcess(schema['bpmn:definitions'], { id: 'Process_1igpwhg' });

    expect(process).toBeDefined();
  });

  it('should return workflow', () => {
    const workflow = WorkflowJS.build();

    expect(workflow).toBeDefined();

    const { context } = workflow.execute({
      factory: () => new SimpleWorkflow(),
      schema: parse(xml)['bpmn:definitions'],
    });

    expect(context.status).toBe(Status.Terminated);
  });
});
