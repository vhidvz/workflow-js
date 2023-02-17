/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IdentityOptions, Metadata, MethodOptions, NodeKey } from '../common';
import { getBPMNActivity, getBPMNProcess, parse, readFile } from '../utils';
import { Context, Status, State, Token } from '../context';
import { BPMNDefinition } from '../type';
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
  identity?: IdentityOptions;
  xml?: string;
  path?: string;
  schema?: BPMNDefinition;
}

function run(target: any, method: string, options: MethodOptions) {
  options.activity.token = options.token;
  options.activity.context = options.context;

  let value;
  let exception;

  try {
    options.token.status = Status.Running;
    options.context!.status = Status.Running;

    if (!method) options.activity.takeOutgoing();
    else value = (target as any)[method](options);

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
  static execute<D = any>(options: ExecuteInterface, exec?: Execute<D>): Execute<D> {
    exec = exec ?? ({} as Execute<D>);

    const { handler, factory, path, xml, schema } = options;

    if (options.id) exec.definition = Container.get(options.id);

    if (schema) exec.definition = schema;
    else if (xml) exec.definition = parse(xml)['bpmn:definitions'];
    else if (path) exec.definition = parse(readFile(path))['bpmn:definitions'];

    if (!exec.target)
      exec.target = '$__metadata__' in this ? this : (factory ?? (() => undefined))() ?? handler;
    if (!exec.target) throw new Error('Target workflow not found');

    const metadata = (exec.target as any).$__metadata__ as Metadata;
    const nodes = Reflect.getMetadata(NodeKey, exec.target, '$__metadata__');

    exec.definition = exec.definition ?? Container.get(metadata.definition.id);
    if (!exec.definition) throw new Error('Definition schema not found');

    exec.process = exec.process ?? getBPMNProcess(exec.definition, metadata.process);
    if (!exec.process) throw new Error('Process definition not found');

    const { context, data, value } = options;
    exec.context = context ?? Context.build({ data, status: Status.Ready });

    if (!exec.context?.status) exec.context.status = Status.Ready;

    if ([Status.Completed, Status.Terminated].includes(exec.context.status))
      throw new Error('Cannot execute workflow at completed or terminated state');

    if (exec.context.status !== Status.Ready) exec.context.resume();

    let activity;
    if (options?.identity) {
      activity = getActivity(exec.process, getBPMNActivity(exec.process, options.identity));
    } else if (!exec.context.tokens.length) {
      if (!exec.process['bpmn:startEvent'] || exec.process['bpmn:startEvent'].length !== 1)
        throw new Error('Start event is not defined in process or have more than one start event');

      activity = getActivity(exec.process, {
        key: 'bpmn:startEvent',
        activity: exec.process['bpmn:startEvent'][0],
      });
    }
    if (!activity) throw new Error('Node activity not found');

    let token: Token | undefined;
    if (exec.context.tokens.length == 0) {
      const state = State.build(activity.id, { name: activity.name, value, status: Status.Ready });
      token = Token.build();
      token.push(state);

      exec.context.addToken(token);
    } else {
      token = exec.context.getTokens(activity.$)?.pop();
      if (token?.isPaused()) token.resume();
    }

    if (!token) throw new Error('Token not found');

    let node!: { identity: IdentityOptions; propertyName: string };

    if (activity.name) node = nodes[activity.name];
    if (!node && activity.id) node = nodes[activity.id];
    if (!node) throw new Error('Requested node not found');

    const runOptions: { method: string; options: MethodOptions } = {
      method: node.propertyName,
      options: { activity, token, value, data: data ?? exec.context.data, context: exec.context },
    };

    do {
      const result = run(exec.target, runOptions.method, runOptions.options);

      if (result.exception) {
        throw {
          result,
          target: exec.target,
          context: exec.context,
          process: exec.process,
          definition: exec.definition,
        };
      }

      if (exec.context.status === Status.Running) {
        const next = exec.context.next();

        if (!next) break;

        runOptions.method = '';
        next.value = result.value;

        if (next.name) runOptions.method = nodes[next.name]?.propertyName ?? '';
        if (!runOptions.method) runOptions.method = nodes[next.ref]?.propertyName ?? '';

        const token = exec.context.getTokens({ id: next.ref })?.find((t) => t.status === Status.Ready);

        if (!token) throw new Error('Token not found at continuing stage');

        const activity = getActivity(exec.process, getBPMNActivity(exec.process, { id: next.ref }));

        runOptions.options = {
          token,
          activity,
          value: next.value,
          context: exec.context,
          data: data ?? exec.context.data,
        };
      }
    } while (exec.context.status === Status.Running);

    if (exec.context.isPaused()) exec.context.status = Status.Paused;
    else if (exec.context.isCompleted()) exec.context.status = Status.Completed;
    else if (exec.context.isTerminated()) exec.context.status = Status.Terminated;

    return {
      target: exec.target,
      context: exec.context,
      process: exec.process,
      definition: exec.definition,
    };
  }

  public execute<D = any>(options: ExecuteInterface): Execute<D> {
    return WorkflowJS.execute<D>(options);
  }
}
