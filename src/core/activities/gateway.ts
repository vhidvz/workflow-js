import { BPMNGateway, BPMNProcess } from '../../type';
import { getBPMNActivity } from '../../utils';
import { getActivity } from '../../tools';
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
