/* eslint-disable @typescript-eslint/no-explicit-any */
import { IdentityOptions, Metadata, MethodOptions, NodeKey } from '../common';
import { getBPMNActivity, getBPMNProcess, parse, readFile } from '../utils';
import { Context, ContextStatus, History, TokenStatus } from '../context';
import { BPMNDefinition, BPMNProcess } from '../type';
import { getActivity } from '../tools';
import { Container } from '../core';
import { Execute } from './types';

export interface ExecuteInterface {
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

export class WorkflowJS {
  protected target!: any;

  protected context?: Context;
  protected process?: BPMNProcess;
  protected definition?: BPMNDefinition;

  public execute<D = any>(options: ExecuteInterface): Execute<D> {
    const { handler, factory, path, xml, schema } = options;

    if (schema) this.definition = schema;
    else if (xml) this.definition = parse(xml)['bpmn:definitions'];
    else if (path) this.definition = parse(readFile(path))['bpmn:definitions'];

    if (!this.target)
      this.target = '$__metadata__' in this ? this : (factory ?? (() => undefined))() ?? handler;
    if (!this.target) throw new Error('Target workflow not found');

    const metadata = (this.target as any).$__metadata__ as Metadata;
    const nodes = Reflect.getMetadata(NodeKey, this.target, '$__metadata__');

    this.definition = this.definition ?? Container.get(metadata.definition.id);
    if (!this.definition) throw new Error('Definition schema not found');

    this.process = this.process ?? getBPMNProcess(this.definition, metadata.process);
    if (!this.process) throw new Error('Process definition not found');

    const { context, data, value } = options;
    this.context = context ?? Context.build({ data, status: ContextStatus.Ready });

    let activity;
    if (options?.identity) {
      activity = getActivity(this.process, getBPMNActivity(this.process, options.identity));
    } else if (!this.context.tokens.length) {
      if (!this.process['bpmn:startEvent'] || this.process['bpmn:startEvent'].length !== 1)
        throw new Error('Start event is not defined in process or have more than one start event');

      activity = getActivity(this.process, {
        key: 'bpmn:startEvent',
        activity: this.process['bpmn:startEvent'][0],
      });
    }
    if (!activity) throw new Error('Node activity not found');

    if (this.context.tokens.length == 0) {
      const token = this.context.addToken({ status: TokenStatus.Ready });
      token.push(History.build(activity.id, { name: activity.name, value }));
    }

    let node!: { identity: IdentityOptions; propertyName: string };

    if (activity.name) node = nodes[activity.name];
    if (!node && activity.id) node = nodes[activity.id];
    if (!node) throw new Error('Requested node not found');

    const args: MethodOptions = {
      data,
      value,
      activity,
      context: this.context,
      token: this.context.getToken(activity.$),
    };

    (this.target as any)[node.propertyName](process, args);

    return {
      target: this.target,
      context: this.context,
      process: this.process,
      definition: this.definition,
    };
  }
}
