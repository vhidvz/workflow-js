/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */
import { Activity, GoOutInterface, Sequence, TakeOutgoingInterface } from '../base';
import { BPMNGateway, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { takeOutgoing, getWrappedBPMNElement } from '../../tools';
import { IdentityOptions } from '../../common';
import { Token, Status } from '../../context';

export enum GatewayType {
  Complex = 'complex',
  Parallel = 'parallel',
  Inclusive = 'inclusive',
  Exclusive = 'exclusive',
  EventBased = 'eventBased',
}

/* It creates a new GatewayActivity object */
export class GatewayActivity extends Activity {
  $!: { id: string; name?: string; default?: string };

  constructor(process: BPMNProcess, data?: Partial<GatewayActivity>, key?: string) {
    super(process, data, key);
  }

  protected takeGatewayOutgoing(identity?: IdentityOptions) {
    let outgoing = takeOutgoing(this.outgoing, identity);

    switch (this.type) {
      case GatewayType.Complex:
        break;

      case GatewayType.Parallel:
        if (this.context && this.token) {
          const tokens = this.context.getTokens({ id: this.id });

          if (tokens?.length !== this.incoming.length) {
            this.token.pause();
            return;
          } else if (this.incoming.length > 1) {
            tokens.forEach((t) => {
              t.locked = true;
              t.status = Status.Terminated;
            });

            this.token = Token.build({ history: [this.token.state.clone()] });
            this.context.addToken(this.token);
          }

          outgoing = outgoing ?? takeOutgoing(this.outgoing);
        }
        break;

      case GatewayType.Inclusive:
        break;

      case GatewayType.Exclusive:
        if (outgoing && outgoing.length !== 1)
          outgoing = this.default?.targetRef ? [this.default.targetRef] : undefined;
        break;

      case GatewayType.EventBased:
        break;
    }

    return outgoing;
  }

  /**
   * > This function takes the outgoing sequence flows of a gateway and returns the next activity to be
   * executed
   *
   * @param {IdentityOptions} [identity] - IdentityOptions
   * @param [options] - pause: boolean | string
   *
   * @returns The outgoing activity
   */
  takeOutgoing(identity?: IdentityOptions, options?: { pause: boolean | string }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = this.takeGatewayOutgoing(identity);

    if (!outgoing) return;

    this.goOut(outgoing.map((out) => ({ activity: out, pause: options?.pause })));
  }

  takeOutgoings(options: TakeOutgoingInterface[]) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing: { [id: string]: GoOutInterface } = {};

    for (const option of options) {
      const { identity, pause } = option;
      const activity = this.takeGatewayOutgoing(identity)?.pop();

      if (activity) outgoing[activity.id] = { activity, pause };
    }

    this.goOut(Object.values(outgoing));
  }

  /**
   * If the default property exists, get the BPMN activity with the id of the default property, and if
   * that exists, return a new Sequence object with the activity and the process
   *
   * @returns The default sequence flow.
   */
  get default(): Sequence | undefined {
    if (!this.$.default) return;
    const flow = getWrappedBPMNElement(this.process, { id: this.$.default })?.element;
    if (flow) return Sequence.build(flow as BPMNSequenceFlow, this.process);
  }

  /**
   * If the key contains the word "complex", return GatewayType.Complex, otherwise if the key contains
   * the word "parallel", return GatewayType.Parallel, otherwise if the key contains the word
   * "inclusive", return GatewayType.Inclusive, otherwise if the key contains the word "exclusive",
   * return GatewayType.Exclusive, otherwise if the key contains the word "eventBased", return
   * GatewayType.EventBased, otherwise return undefined
   *
   * @returns The type of the gateway.
   */
  get type() {
    if (this.key?.toLowerCase()?.includes('complex')) return GatewayType.Complex;
    if (this.key?.toLowerCase()?.includes('parallel')) return GatewayType.Parallel;
    if (this.key?.toLowerCase()?.includes('inclusive')) return GatewayType.Inclusive;
    if (this.key?.toLowerCase()?.includes('exclusive')) return GatewayType.Exclusive;
    if (this.key?.toLowerCase()?.includes('eventBased')) return GatewayType.EventBased;
  }

  /**
   * It creates a new GatewayActivity object.
   *
   * @param {BPMNGateway} el - BPMNGateway - this is the BPMN element that is being converted to an
   * activity.
   * @param {BPMNProcess} process - The process that the activity belongs to.
   * @param {string} [key] - The key of the activity. This is used to identify the activity in the
   * process.
   *
   * @returns A new GatewayActivity object.
   */
  static build(el: BPMNGateway, process: BPMNProcess, key?: string) {
    return new GatewayActivity(process, { ...el }, key);
  }
}
