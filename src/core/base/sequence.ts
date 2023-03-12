import { BPMNProcess, BPMNSequenceFlow } from '../../type';
import { getActivity, getBPMNActivity } from '../../tools';
import { Attribute } from './attribute';
import { Activity } from './activity';

/* It takes a BPMNSequenceFlow and a BPMNProcess and returns a Sequence */
export class Sequence extends Attribute {
  $!: { id: string; name?: string; sourceRef: string; targetRef: string };

  constructor(process: BPMNProcess, data?: Partial<Sequence>) {
    super(process, data);
  }

  /**
   * It returns the sourceRef of the sequence flow.
   *
   * @returns The sourceRef property is being returned.
   */
  get sourceRef(): Activity | undefined {
    if (!this.$.sourceRef) return;
    const options = getBPMNActivity(this.process, { id: this.$.sourceRef });
    if (options) return getActivity(this.process, options);
  }

  /**
   * It returns the targetRef of the sequence flow.
   *
   * @returns The targetRef property of the SequenceFlow object.
   */
  get targetRef(): Activity | undefined {
    if (!this.$.targetRef) return;
    const options = getBPMNActivity(this.process, { id: this.$.targetRef });
    if (options) return getActivity(this.process, options);
  }

  /**
   * It takes a BPMNSequenceFlow and a BPMNProcess and returns a Sequence
   *
   * @param {BPMNSequenceFlow} el - BPMNSequenceFlow - the BPMN element that is being built
   * @param {BPMNProcess} process - The process that the sequence flow belongs to.
   *
   * @returns A new instance of the Sequence class.
   */
  static build(el: BPMNSequenceFlow, process: BPMNProcess) {
    return new Sequence(process, { ...el });
  }
}
