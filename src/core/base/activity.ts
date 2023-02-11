/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BPMNActivity, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { Context, History, Token, TokenStatus } from '../../context';
import { IdentityOptions } from '../../common';
import { getBPMNActivity } from '../../utils';
import { Attribute } from './attribute';
import { Sequence } from './sequence';

export class Activity extends Attribute {
  protected readonly key?: string;

  public token?: Token;
  public context?: Context;

  private readonly 'bpmn:incoming': string[];
  private readonly 'bpmn:outgoing': string[];

  get incoming() {
    return this['bpmn:incoming']?.map((id: string) => {
      const activity = getBPMNActivity(this.process, { id })?.activity;
      return Sequence.build(activity as BPMNSequenceFlow, this.process);
    });
  }

  get outgoing() {
    return this['bpmn:outgoing']?.map((id: string) => {
      const activity = getBPMNActivity(this.process, { id })?.activity;
      return Sequence.build(activity as BPMNSequenceFlow, this.process);
    });
  }

  takeOutgoing(identity?: IdentityOptions) {
    if (!this.outgoing || !this.outgoing?.length) return;

    let outgoing: Activity[] = [];
    if (identity) {
      if (identity && 'id' in identity)
        outgoing = this.outgoing?.filter((o) => o.id === identity.id).map((o) => o.targetRef!);
      if (identity && 'name' in identity)
        outgoing = this.outgoing?.filter((o) => o.name === identity.name).map((o) => o.targetRef!);
    } else outgoing = this.outgoing?.map((o) => o.targetRef!);

    if (outgoing.length) {
      if (outgoing.length === 1 && this.token) {
        this.token.push(History.build(this.id, { name: this.name }));
      }
      if (outgoing.length > 1 && this.context && this.token) {
        this.token.locked = true;
        this.token.status = TokenStatus.Terminated;

        for (const activity of outgoing) {
          const token = Token.build({ parent: this.token.id, status: TokenStatus.Ready });
          token.push(History.build(activity.id, { name: activity.name }));
          this.context.addToken(token);
        }
      }
    }

    return outgoing;
  }

  constructor(process: BPMNProcess, data?: Partial<Activity>, key?: string) {
    super(process, data);
    this.key = key;
  }

  static build(el: BPMNActivity, process: BPMNProcess, key?: string) {
    return new Activity(process, { ...el }, key);
  }
}
