/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getActivity, getWrappedBPMNElement, getBPMNProcess } from '../tools';
import { IdentityOptions, Metadata, MethodOptions, NodeKey } from '../common';
import { Context, Status, State, Token } from '../context';
import { BPMNDefinition, BPMNProcess } from '../type';
import { logger, parse, readFile } from '../utils';
import { Activity, Container } from '../core';
import { Execute } from './types';

const log = logger('engine');

/* The interface for the execute function. */
export interface ExecutionInterface {
  id?: string;
  factory?: () => any;
  handler?: any;
  context?: Context;
  data?: any;
  value?: any;
  node?: IdentityOptions;
  xml?: string;
  path?: string;
  schema?: BPMNDefinition;
  exec?: Partial<Execute>;
}

/**
 * It runs the activity, and returns the value and exception
 *
 * @param {any} target - any - The target object that contains the method to be executed.
 * @param {string} method - The name of the method to be executed.
 * @param {MethodOptions} options - MethodOptions
 * @param {boolean} is_first_iteration - is first iteration
 *
 * @returns The value of the method, or the exception if there is one.
 */
async function run(target: any, method: string, options: MethodOptions, is_first_iteration?: boolean) {
  options.activity.token = options.token;
  options.activity.context = options.context;

  let value;
  let exception;

  try {
    options.token.status = Status.Running;
    options.context.status = Status.Running;

    log.info(`Activity ${options.activity.id ?? options.activity.name} is running`);

    let node!: { options: { pause?: true }; propertyName: string };
    const nodes = Reflect.getMetadata(NodeKey, target, '$__metadata__');

    if (options.activity.name) node = nodes[options.activity.name];
    if (!node && options.activity.id) node = nodes[options.activity.id];

    log.info(`Node %o is loaded`, node);

    if (!method && !node?.options?.pause) {
      log.warn(`Activity ${options.activity.id ?? options.activity.name} method not defined`);

      value = options.value;
      options.activity.takeOutgoing();
    } else if (!node?.options?.pause || is_first_iteration) {
      value = await target[method](options);
    } else options.token.pause();

    log.info(`Activity ${options.activity.id ?? options.activity.name} processed`);

    /* This is the code that is responsible for pausing the workflow token. */
    if (options.activity.isEnd()) options.token.status = Status.Terminated;

    if (!options.activity.outgoing?.length && !options.activity.isEnd()) options.token.pause();
  } catch (error) {
    options.context.status = Status.Failed;
    options.token.status = Status.Failed;
    exception = error;

    log.error(`Activity ${options.activity.id ?? options.activity.name} failed with error %O`, error);
  }

  return { value, exception };
}

/* It executes a workflow */
export class WorkflowJS {
  protected context?: Context;

  protected target!: any;
  protected process?: BPMNProcess;
  protected definition?: BPMNDefinition;

  /**
   * > The `build` function is a static method that returns a new instance of the `WorkflowJS` class
   *
   * @param [exec] - This is the object that contains the parameters that will be passed to the
   * workflow.
   *
   * @returns A new instance of the WorkflowJS class.
   */
  static build(exec?: Partial<Execute>): WorkflowJS {
    const workflow = new this();

    if (exec) {
      workflow.target = exec?.target;
      workflow.context = exec?.context;
      workflow.process = exec?.process;
      workflow.definition = exec?.definition;
    }

    return workflow;
  }

  /**
   * It executes a workflow
   *
   * @param {ExecutionInterface} options - ExecutionInterface
   *
   * @returns The return value is an object with the following properties:
   */
  async execute({ context, data, value, ...options }: ExecutionInterface): Promise<Execute> {
    context = (this.context ?? context ?? Context.build({ data })).resume();
    if (!context.isReady()) throw new Error('Context is not ready to consume');
    if (context.status === Status.Terminated) throw new Error('Cannot execute workflow at terminated state');

    if (!this.target && options?.exec?.target) this.target = options.exec.target;
    if (!this.process && options?.exec?.process) this.process = options.exec.process;

    if (!this.definition && options.id) this.definition = Container.getDefinition(options.id);
    if (!this.definition && options.exec?.definition) this.definition = options.exec.definition;

    const { path, xml, schema } = options;
    if (!this.definition && schema) this.definition = schema;
    else if (!this.definition && xml) this.definition = parse(xml)['bpmn:definitions'];
    else if (!this.definition && path) this.definition = parse(readFile(path))['bpmn:definitions'];

    if (!this.target) {
      const { handler, factory } = options;
      this.target = '$__metadata__' in this ? this : ((factory ?? (() => undefined))() ?? handler);

      if (!this.target) throw new Error('Target workflow not found');
    }

    const metadata = this.target.$__metadata__ as Metadata;

    this.definition = this.definition ?? Container.getDefinition(metadata.definition.id);
    if (!this.definition) throw new Error('Definition schema not found');

    log.info(`Definition %o is loaded`, metadata.definition);

    this.process = this.process ?? getBPMNProcess(this.definition, metadata.process);
    if (!this.process) throw new Error('Process definition not found');

    log.info(`Process %o is loaded`, metadata.process);

    /* Checking if the options has a node, if it does, it will get the activity from the process. If it
    does not, it will check if the context has tokens. If it does not, it will get the start event
    from the process. If it does, it will throw an error. */
    let activity: Activity | undefined;
    if (!context.tokens.length && !options?.node) {
      if (!this.process['bpmn:startEvent'] || this.process['bpmn:startEvent'].length !== 1)
        throw new Error('Start event is not defined in process or have more than one start event');

      activity = getActivity(this.process, {
        key: 'bpmn:startEvent',
        element: this.process['bpmn:startEvent'][0],
      });
    } else if (options?.node) {
      activity = getActivity(this.process, getWrappedBPMNElement(this.process, options.node));
    }
    if (!activity) throw new Error('Node activity not found or not applicable');

    /* Checking if the context has tokens. If it does not, it creates a new token and adds it to the
    context. If it does, it gets the last token from the context and resumes it. */
    let token: Token | undefined;
    if (context.tokens.length == 0) {
      const state = State.build(activity.id, { name: activity.name, value });

      token = Token.build({ history: [state] });

      context.addToken(token);
    } else {
      token = context.getTokens(activity.$)?.pop()?.resume();

      if (!token?.isReady()) throw new Error('Token is not ready to consume');
    }
    if (!token) throw new Error('Token not found');
    else token.state.value = token.state.value ?? value;

    let node!: { options: IdentityOptions; propertyName: string };
    const nodes = Reflect.getMetadata(NodeKey, this.target, '$__metadata__');

    if (activity.name) node = nodes[activity.name];
    if (!node && activity.id) node = nodes[activity.id];

    log.info(`Node %o is loaded`, node);

    const runOptions: { method: string; options: MethodOptions } = {
      method: node?.propertyName ?? '',
      options: { activity, token, context, data: data ?? context.data, value },
    };

    /* A loop that will run until the context status is not running. */
    let is_first_iteration = true;
    let val: { [id: string]: any } = {}; // to hold returned value by token id
    do {
      const result = await run(this.target, runOptions.method, runOptions.options, is_first_iteration);

      log.debug(`Result of %o method is %O`, runOptions.method, result.value ?? '[null]');

      if (result.exception) throw result.exception;

      if (context.status === Status.Running) {
        const next = context.next();

        log.info(`Next node is ${next?.name ?? next?.ref ?? '[undefined]'}`);

        if (!next) break;

        runOptions.method = '';

        if (next.name) runOptions.method = nodes[next.name]?.propertyName ?? '';
        if (!runOptions.method) runOptions.method = nodes[next.ref]?.propertyName ?? '';

        if (!runOptions.method && result.value) val = { [token.id]: result.value };
        else if (runOptions.method && val[token.id]) {
          next.value = val[token.id];
          delete val[token.id];
        } else next.value = result.value;

        log.info(`Next method is ${runOptions.method ?? '[undefined]'}`);

        token = context.getTokens({ id: next.ref })?.find((t) => t.status === Status.Ready);

        if (!token) throw new Error('Token not found at running stage');

        activity = getActivity(this.process, getWrappedBPMNElement(this.process, { id: next.ref }));

        log.info(`Next Activity is ${activity?.name ?? activity?.id ?? '[undefined]'}`);

        runOptions.options = {
          token,
          activity,
          context: context,
          value: next.value,
          data: data ?? context.data,
        };
      }

      is_first_iteration = false;
    } while (context.status === Status.Running);

    /* Setting the status of the context to the appropriate status. */
    if (context.isTerminated()) context.status = Status.Terminated;
    else if (context.status === Status.Running) context.status = Status.Paused;

    log.info(`Context status is ${context.status}`);

    return {
      context: context,
      target: this.target,
      process: this.process,
      definition: this.definition,
    };
  }
}
