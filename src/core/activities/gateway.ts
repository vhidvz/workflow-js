/* eslint-disable no-case-declarations */
import { BPMNGateway, BPMNProcess, BPMNSequenceFlow } from '../../type';
import { State, Token, Status } from '../../context';
import { IdentityOptions } from '../../common';
import { getBPMNActivity } from '../../utils';
import { Activity, Sequence } from '../base';
import { takeOutgoing } from '../../tools';

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

  /**
   * > This function takes the outgoing sequence flows of a gateway and returns the next activity to be
   * executed
   *
   * @param {IdentityOptions} [identity] - IdentityOptions
   * @param [options] - { pause: boolean }
   *
   * @returns The outgoing activity
   */
  takeOutgoing(identity?: IdentityOptions, options?: { pause: boolean }) {
    if (!this.outgoing || !this.outgoing?.length) return;

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
          } else {
            tokens.forEach((t) => (t.status = Status.Terminated));
            outgoing = takeOutgoing(this.outgoing);
          }
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
            State.build(activity.id, {
              name: activity.name,
              status: pause ? Status.Paused : Status.Ready,
            }),
          );
          this.context.addToken(token);
        }
      }
    }

    return outgoing;
  }

  /**
   * If the default property exists, get the BPMN activity with the id of the default property, and if
   * that exists, return a new Sequence object with the activity and the process
   *
   * @returns The default sequence flow.
   */
  get default(): Sequence | undefined {
    if (!this.$.default) return;
    const options = getBPMNActivity(this.process, { id: this.$.default });
    if (options) return Sequence.build(options.activity as BPMNSequenceFlow, this.process);
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
