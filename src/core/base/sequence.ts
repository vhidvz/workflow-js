import { BPMNProcess, BPMNSequenceFlow } from '../../type';
import { getBPMNActivity } from '../../utils';
import { getActivity } from '../../tools';
import { Attribute } from './attribute';
import { Activity } from './activity';

export class Sequence extends Attribute {
  $!: { id: string; name?: string; sourceRef: string; targetRef: string };

  get sourceRef(): Activity | undefined {
    if (!this.$.sourceRef) return;
    const options = getBPMNActivity(this.process, { id: this.$.sourceRef });
    if (options) return getActivity(this.process, options);
  }

  get targetRef(): Activity | undefined {
    if (!this.$.targetRef) return;
    const options = getBPMNActivity(this.process, { id: this.$.targetRef });
    if (options) return getActivity(this.process, options);
  }

  constructor(process: BPMNProcess, data?: Partial<Sequence>) {
    super(process, data);
  }

  static build(el: BPMNSequenceFlow, process: BPMNProcess) {
    return new Sequence(process, { ...el });
  }
}
