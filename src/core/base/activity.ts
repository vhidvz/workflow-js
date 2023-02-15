/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BPMNActivity, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { Context, State, Token, TokenStatus } from '../../context';
import { IdentityOptions } from '../../common';
import { getBPMNActivity } from '../../utils';
import { takeOutgoing } from '../../tools';
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
      if (!activity) throw new Error('Outgoing activity not found');
      return Sequence.build(activity as BPMNSequenceFlow, this.process);
    });
  }

  takeOutgoing(identity?: IdentityOptions & { pause?: boolean }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = takeOutgoing(this.outgoing, identity);

    if (outgoing?.length && this.token) {
      if (outgoing.length === 1) {
        this.token.push(State.build(outgoing[0].id, { name: outgoing[0].name }));
      }

      if (outgoing.length > 1 && this.context) {
        this.token.locked = true;
        this.token.status = TokenStatus.Terminated;

        for (const activity of outgoing) {
          const { pause } = identity ?? {};

          const token = Token.build({
            parent: this.token.id,
            status: pause ? TokenStatus.Paused : TokenStatus.Ready,
          });

          token.push(State.build(activity.id, { name: activity.name }));
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
