import { BPMNLane, BPMNLaneSet, BPMNProcess } from '../../type';
import { getBPMNActivity } from '../../utils';
import { getActivity } from '../../tools';
import { Attribute } from './attribute';
import { Activity } from './activity';

export class Lane extends Attribute {
  private readonly 'bpmn:lane': BPMNLane;

  get flowNodeRef(): Activity[] {
    if (!this['bpmn:lane']) return [];

    return this['bpmn:lane']['bpmn:flowNodeRef']?.map((id) => {
      const options = getBPMNActivity(this.process, { id });
      return getActivity(this.process, options);
    });
  }

  constructor(process: BPMNProcess, data?: Partial<Lane>) {
    super(process, data);
  }

  static build(el: BPMNLaneSet, process: BPMNProcess) {
    return new Lane(process, { ...el });
  }
}
