/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BPMNActivity, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { IdentityOptions } from '../../common';
import { getBPMNActivity } from '../../utils';
import { Attribute } from './attribute';
import { Sequence } from './sequence';

export class Activity extends Attribute {
  protected readonly key?: string;

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

    if (identity && 'id' in identity)
      return this.outgoing?.filter((o) => o.id === identity.id).map((o) => o.targetRef!);
    if (identity && 'name' in identity)
      return this.outgoing?.filter((o) => o.name === identity.name).map((o) => o.targetRef!);

    return this.outgoing?.map((o) => o.targetRef!);
  }

  constructor(process: BPMNProcess, data?: Partial<Activity>, key?: string) {
    super(process, data);
    this.key = key;
  }

  static build(el: BPMNActivity, process: BPMNProcess, key?: string) {
    return new Activity(process, { ...el }, key);
  }
}
