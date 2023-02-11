import { History, Token, TokenStatus } from '../../context';
import { getActivity, takeOutgoing } from '../../tools';
import { BPMNGateway, BPMNProcess } from '../../type';
import { IdentityOptions } from '../../common';
import { getBPMNActivity } from '../../utils';
import { Activity } from '../base';

export enum GatewayType {
  Complex = 'complex',
  Parallel = 'parallel',
  Inclusive = 'inclusive',
  Exclusive = 'exclusive',
  EventBased = 'eventBased',
}

export class GatewayActivity extends Activity {
  $!: { id: string; name?: string; default?: string };

  takeOutgoing(identity?: IdentityOptions & { pause?: boolean }) {
    if (!this.outgoing || !this.outgoing?.length) return;

    const outgoing = takeOutgoing(this.outgoing, identity);

    if (outgoing?.length) {
      if (outgoing.length === 1 && this.token) {
        this.token.push(History.build(this.id, { name: this.name }));
      }

      if (outgoing.length > 1 && this.context && this.token) {
        this.token.locked = true;
        this.token.status = TokenStatus.Terminated;

        for (const activity of outgoing) {
          const { pause } = identity ?? {};

          const token = Token.build({
            parent: this.token.id,
            status: pause ? TokenStatus.Paused : TokenStatus.Ready,
          });

          token.push(History.build(activity.id, { name: activity.name }));
          this.context.addToken(token);
        }
      }
    }

    return outgoing;
  }

  get default(): Activity | undefined {
    if (!this.$.default) return;
    const options = getBPMNActivity(this.process, { id: this.$.default });
    if (options) return getActivity(this.process, options);
  }

  get type() {
    if (this.key?.toLowerCase()?.includes('complex')) return GatewayType.Complex;
    if (this.key?.toLowerCase()?.includes('parallel')) return GatewayType.Parallel;
    if (this.key?.toLowerCase()?.includes('inclusive')) return GatewayType.Inclusive;
    if (this.key?.toLowerCase()?.includes('exclusive')) return GatewayType.Exclusive;
    if (this.key?.toLowerCase()?.includes('eventBased')) return GatewayType.EventBased;
  }

  constructor(process: BPMNProcess, data?: Partial<GatewayActivity>, key?: string) {
    super(process, data, key);
  }

  static build(el: BPMNGateway, process: BPMNProcess, key?: string) {
    return new GatewayActivity(process, { ...el }, key);
  }
}
