/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IdentityOptions, Metadata, MethodOptions, NodeKey } from '../common';
import { getBPMNActivity, getBPMNProcess, parse, readFile } from '../utils';
import { Context, Status, State, Token } from '../context';
import { BPMNDefinition, BPMNProcess } from '../type';
import { getActivity } from '../tools';
import { Container } from '../core';
import { Execute } from './types';

export interface ExecuteInterface {
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
  exec?: Execute;
}

function run(target: any, method: string, options: MethodOptions) {
  options.activity.token = options.token;
  options.activity.context = options.context;

  let value;
  let exception;

  try {
    options.token.status = Status.Running;
    options.context!.status = Status.Running;

    if (!method) {
      value = options.value;
      options.activity.takeOutgoing();
    } else value = (target as any)[method](options);

    if (options.activity.id === options.token.state.ref)
      options.activity.takeOutgoing(undefined, { pause: true });
    if (options.activity.isEnd()) options.token.status = Status.Terminated;
  } catch (error) {
    options.context!.status = Status.Failed;
    options.token.status = Status.Failed;
    exception = error;
  }

  return { value, exception };
}

export class WorkflowJS {
  protected target!: any;

  protected context?: Context;
  protected process?: BPMNProcess;
  protected definition?: BPMNDefinition;

  static build(exec?: Execute): WorkflowJS {
    const workflow = new this();

    if (exec) {
      workflow.target = exec.target;
      workflow.context = exec.context;
      workflow.process = exec.process;
      workflow.definition = exec.definition;
    }

    return workflow;
  }

  public execute(options: ExecuteInterface): Execute {
    if (!this.target && options?.exec?.target) this.target = options.exec.target;
    if (!this.context && options?.exec?.context) this.context = options.exec.context;
    if (!this.process && options?.exec?.process) this.process = options.exec.process;
    if (!this.definition && options?.exec?.definition) this.definition = options.exec.definition;

    const { handler, factory, path, xml, schema } = options;

    if (!this.definition && options.id) this.definition = Container.get(options.id);

    if (!this.definition && schema) this.definition = schema;
    else if (!this.definition && xml) this.definition = parse(xml)['bpmn:definitions'];
    else if (!this.definition && path) this.definition = parse(readFile(path))['bpmn:definitions'];

    if (!this.target) {
      this.target = '$__metadata__' in this ? this : (factory ?? (() => undefined))() ?? handler;
    }
    if (!this.target) throw new Error('Target workflow not found');

    const metadata = (this.target as any).$__metadata__ as Metadata;
    const nodes = Reflect.getMetadata(NodeKey, this.target, '$__metadata__');

    this.definition = this.definition ?? Container.get(metadata.definition.id);
    if (!this.definition) throw new Error('Definition schema not found');

    this.process = this.process ?? getBPMNProcess(this.definition, metadata.process);
    if (!this.process) throw new Error('Process definition not found');

    const { context, data, value } = options;
    this.context = this.context ?? context ?? Context.build({ data, status: Status.Ready });

    if (!this.context?.status) this.context.status = Status.Ready;

    if ([Status.Completed, Status.Terminated].includes(this.context.status))
      throw new Error('Cannot execute workflow at completed or terminated state');

    if (this.context.status !== Status.Ready) this.context.resume();

    let activity;
    if (options?.node) {
      activity = getActivity(this.process, getBPMNActivity(this.process, options.node));
    } else if (!this.context.tokens.length) {
      if (!this.process['bpmn:startEvent'] || this.process['bpmn:startEvent'].length !== 1)
        throw new Error('Start event is not defined in process or have more than one start event');

      activity = getActivity(this.process, {
        key: 'bpmn:startEvent',
        activity: this.process['bpmn:startEvent'][0],
      });
    }
    if (!activity) throw new Error('Node activity not found');

    let token: Token | undefined;
    if (this.context.tokens.length == 0) {
      const state = State.build(activity.id, { name: activity.name, value, status: Status.Ready });
      token = Token.build();
      token.push(state);

      this.context.addToken(token);
    } else {
      token = this.context.getTokens(activity.$)?.pop();
      if (token?.isPaused()) token.resume();
    }

    if (!token) throw new Error('Token not found');

    let node!: { identity: IdentityOptions; propertyName: string };

    if (activity.name) node = nodes[activity.name];
    if (!node && activity.id) node = nodes[activity.id];
    if (!node) throw new Error('Requested node not found');

    const runOptions: { method: string; options: MethodOptions } = {
      method: node.propertyName,
      options: { activity, token, value, data: data ?? this.context.data, context: this.context },
    };

    do {
      const result = run(this.target, runOptions.method, runOptions.options);

      if (result.exception) throw result.exception;

      if (this.context.status === Status.Running) {
        const next = this.context.next();

        if (!next) break;

        runOptions.method = '';
        next.value = result.value;

        if (next.name) runOptions.method = nodes[next.name]?.propertyName ?? '';
        if (!runOptions.method) runOptions.method = nodes[next.ref]?.propertyName ?? '';

        const token = this.context.getTokens({ id: next.ref })?.find((t) => t.status === Status.Ready);

        if (!token) throw new Error('Token not found at continuing stage');

        const activity = getActivity(this.process, getBPMNActivity(this.process, { id: next.ref }));

        runOptions.options = {
          token,
          activity,
          value: next.value,
          context: this.context,
          data: data ?? this.context.data,
        };
      }
    } while (this.context.status === Status.Running);

    if (this.context.isPaused()) this.context.status = Status.Paused;
    else if (this.context.isCompleted()) this.context.status = Status.Completed;
    else if (this.context.isTerminated()) this.context.status = Status.Terminated;

    return {
      target: this.target,
      context: this.context,
      process: this.process,
      definition: this.definition,
    };
  }
}
