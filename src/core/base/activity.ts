/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BPMNActivity, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { takeOutgoing, getWrappedBPMNElement } from '../../tools';
import { Context, State, Token, Status } from '../../context';
import { IdentityOptions } from '../../common';
import { Attribute } from './attribute';
import { Sequence } from './sequence';

export interface GoOutInterface {
  activity: Activity;
  pause?: boolean;
}

export interface TakeOutgoingInterface {
  identity: IdentityOptions;
  pause?: boolean;
}

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
    return this['bpmn:incoming']
      ?.map((id: string) => {
        const flow = getWrappedBPMNElement(this.process, { id })?.element;
        if (flow) return Sequence.build(flow as BPMNSequenceFlow, this.process);
      })
      .filter((f) => f instanceof Sequence) as Sequence[];
  }

  /**
   * > It returns an array of `Sequence` objects that are outgoing from the current activity
   *
   * @returns An array of Sequence objects
   */
  get outgoing() {
    return this['bpmn:outgoing']
      ?.map((id: string) => {
        const flow = getWrappedBPMNElement(this.process, { id })?.element;
        if (flow) return Sequence.build(flow as BPMNSequenceFlow, this.process);
      })
      .filter((f) => f instanceof Sequence) as Sequence[];
  }

  /**
   * It takes the outgoing sequence flows from the current activity and creates a new token for each
   * one
   *
   * @param {IdentityOptions} [identity] - IdentityOptions
   * @param [options] - pause: boolean
   *
   * @returns The outgoing activity
   */
  takeOutgoing(identity?: IdentityOptions, options?: { pause: boolean }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = takeOutgoing(this.outgoing, identity);

    if (!outgoing) return;

    this.goOut(outgoing.map((out) => ({ activity: out, pause: options?.pause })));
  }

  /**
   * The function takes an array of options, retrieves corresponding activities from an outgoing array,
   * and passes them to another function.
   *
   * @param {TakeOutgoingInterface[]} options - An array of objects with two properties: "identity" and
   * "pause". "identity" is a string representing the identity of the outgoing activity to be taken out,
   * and "pause" is a boolean indicating whether the activity should be paused or not.
   *
   * @returns If the `outgoing` property is falsy or an empty array, nothing is returned.
   */
  takeOutgoings(options: TakeOutgoingInterface[]) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing: { [id: string]: GoOutInterface } = {};

    for (const option of options) {
      const { identity, pause } = option;
      const activity = takeOutgoing(this.outgoing, identity)?.pop();

      if (activity) outgoing[activity.id] = { activity, pause };
    }

    this.goOut(Object.values(outgoing));
  }

  /**
   * The function handles outgoing transitions for a token in a workflow system.
   *
   * @param {GoOutInterface[]} outgoing - `outgoing` is an array of objects of type `GoOutInterface`. Each object
   * represents an outgoing transition from a current activity to a new activity.
   */
  protected goOut(outgoing: GoOutInterface[]) {
    if (outgoing?.length && this.token) {
      if (outgoing.length === 1) {
        this.token.status = Status.Completed;

        const out = outgoing.pop();

        this.token.push(
          State.build(out!.activity!.id, {
            name: out!.activity!.name,
            status: out!.pause ? Status.Paused : Status.Ready,
          }),
        );
      }

      if (outgoing.length > 1 && this.context) {
        this.token.locked = true;
        this.token.status = Status.Terminated;

        for (const out of outgoing) {
          const token = Token.build({
            parent: this.token.id,
          });

          token.push(
            State.build(out.activity.id, {
              name: out.activity.name,
              status: out.pause ? Status.Paused : Status.Ready,
            }),
          );

          this.context.addToken(token);
        }
      }
    }
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
