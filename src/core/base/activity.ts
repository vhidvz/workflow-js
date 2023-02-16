/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BPMNActivity, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { Context, State, Token, Status } from '../../context';
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
      if (!activity) throw new Error('Outgoing sequenceFlow not found');
      return Sequence.build(activity as BPMNSequenceFlow, this.process);
    });
  }

  takeOutgoing(identity?: IdentityOptions & { pause?: boolean }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = takeOutgoing(this.outgoing, identity);

    if (outgoing?.length && this.token) {
      const { pause } = identity ?? {};

      if (outgoing.length === 1) {
        this.token.status = Status.Completed;

        this.token.push(
          State.build(outgoing[0].id, {
            name: outgoing[0].name,
            status: pause ? Status.Paused : Status.Ready,
          }),
        );
      }

      if (outgoing.length > 1 && this.context) {
        this.token.locked = true;
        this.token.status = Status.Terminated;

        for (const activity of outgoing) {
          const token = Token.build({
            parent: this.token.id,
          });

          this.token.status = Status.Completed;

          token.push(
            State.build(activity.id, { name: activity.name, status: pause ? Status.Paused : Status.Ready }),
          );

          this.context.addToken(token);
        }
      }
    }

    return outgoing;
  }

  isEnd() {
    return this.outgoing?.length === 0 && this.key?.includes('endEvent');
  }

  isStart() {
    return this.incoming?.length === 0 && this.key?.includes('startEvent');
  }

  constructor(process: BPMNProcess, data?: Partial<Activity>, key?: string) {
    super(process, data);
    this.key = key;
  }

  static build(el: BPMNActivity, process: BPMNProcess, key?: string) {
    return new Activity(process, { ...el }, key);
  }
}
