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
  Data,
  Value,
  Param,
  Ctx,
  Context,
  Sign,
  Token,
} from '../../src';

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity, @Data() data: any, @Value() value: any) {
    activity.takeOutgoing();

    return data && value;
  }

  @Node({ id: 'Activity_0xzkax6' })
  public task01(@Act() activity: EventActivity, @Param('data') data: any, @Ctx() context: Context) {
    activity.takeOutgoing(undefined, { pause: true });

    return data && context;
  }

  @Node({ name: 'Task02' })
  public task02(@Param('activity') activity: EventActivity) {
    activity.takeOutgoing();
  }

  @Node({ name: 'End' })
  public end(@Sign() token: Token) {
    return token;
  }
}

describe('test workflow engine class', () => {
  const path = './example/simple-workflow.bpmn';

  let xml: string;
  let schema: BPMNSchema;

  let process: BPMNProcess | undefined;

  it('should return process', () => {
    xml = readFile(path);

    schema = parse(xml);
    process = getBPMNProcess(schema['bpmn:definitions'], { id: 'Process_1igpwhg' });

    expect(process).toBeDefined();
  });

  it('should return workflow by schema', () => {
    const workflow = WorkflowJS.build();

    expect(workflow).toBeDefined();

    const { context } = workflow.execute({
      factory: () => new SimpleWorkflow(),
      schema: parse(xml)['bpmn:definitions'],
    });

    expect(context.isPaused()).toBeTruthy();
  });

  it('should return workflow by path', () => {
    const workflow = WorkflowJS.build();

    expect(workflow).toBeDefined();

    const { context } = workflow.execute({
      path,
      handler: new SimpleWorkflow(),
    });

    expect(context.isPaused()).toBeTruthy();
  });

  it('should return workflow by context deserialized', () => {
    const workflow = WorkflowJS.build();

    expect(workflow).toBeDefined();

    const { context } = workflow.execute({
      path,
      handler: new SimpleWorkflow(),
    });

    expect(context.isPaused()).toBeTruthy();

    const ctx = context.serialize({ data: false, value: false });

    expect(ctx).toBeDefined();

    const exec = WorkflowJS.build({ context: Context.deserialize(ctx) }).execute({
      xml,
      handler: new SimpleWorkflow(),
      node: { id: 'Activity_1r8gmbw' },
    });

    expect(exec.context.isTerminated()).toBeTruthy();
  });
});
