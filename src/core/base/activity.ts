/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BPMNActivity, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { Context, State, Token, Status } from '../../context';
import { IdentityOptions } from '../../common';
import { getBPMNActivity } from '../../utils';
import { takeOutgoing } from '../../tools';
import { Attribute } from './attribute';
import { Sequence } from './sequence';

/* It's a class that represents an activity in a BPMN file */
export class Activity extends Attribute {
  protected readonly key?: string;

  public token?: Token;
  public context?: Context;

  private readonly 'bpmn:incoming': string[];
  private readonly 'bpmn:outgoing': string[];

  constructor(process: BPMNProcess, data?: Partial<Activity>, key?: string) {
    super(process, data);
    this.key = key;
  }

  /**
   * > The `incoming` property returns an array of `Sequence` objects that are incoming to the current
   * `Activity`
   *
   * @returns An array of Sequence objects.
   */
  get incoming() {
    return this['bpmn:incoming']?.map((id: string) => {
      const activity = getBPMNActivity(this.process, { id })?.activity;
      return Sequence.build(activity as BPMNSequenceFlow, this.process);
    });
  }

  /**
   * > It returns an array of `Sequence` objects that are outgoing from the current activity
   *
   * @returns An array of Sequence objects
   */
  get outgoing() {
    return this['bpmn:outgoing']?.map((id: string) => {
      const activity = getBPMNActivity(this.process, { id })?.activity;
      if (!activity) throw new Error('Outgoing sequenceFlow not found');
      return Sequence.build(activity as BPMNSequenceFlow, this.process);
    });
  }

  /**
   * It takes the outgoing sequence flows from the current activity and creates a new token for each
   * one
   *
   * @param {IdentityOptions} [identity] - IdentityOptions
   * @param [options] - { pause: boolean }
   *
   * @returns The outgoing activity
   */
  takeOutgoing(identity?: IdentityOptions, options?: { pause: boolean }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = takeOutgoing(this.outgoing, identity);

    if (outgoing?.length && this.token) {
      const { pause } = options ?? {};

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

  /**
   * If the key property of the current node is not null and includes the string 'endEvent', return
   * true
   *
   * @returns The key of the current node.
   */
  isEnd() {
    return this.key?.includes('endEvent');
  }

  /**
   * If the key property exists and includes the string 'startEvent', return true. Otherwise, return
   * false
   *
   * @returns A boolean value.
   */
  isStart() {
    return this.key?.includes('startEvent');
  }

  /**
   * It creates a new Activity object.
   *
   * @param {BPMNActivity} el - BPMNActivity - the element from the BPMN file
   * @param {BPMNProcess} process - The process that the activity belongs to.
   * @param {string} [key] - The key of the element.
   *
   * @returns A new instance of the Activity class.
   */
  static build(el: BPMNActivity, process: BPMNProcess, key?: string) {
    return new Activity(process, { ...el }, key);
  }
}
