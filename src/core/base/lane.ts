import { BPMNLane, BPMNLaneSet, BPMNProcess } from '../../type';
import { getBPMNActivity } from '../../utils';
import { getActivity } from '../../tools';
import { Attribute } from './attribute';
import { Activity } from './activity';

/* It takes a BPMNLaneSet and a BPMNProcess and returns a Lane */
export class Lane extends Attribute {
  private readonly 'bpmn:lane': BPMNLane;

  constructor(process: BPMNProcess, data?: Partial<Lane>) {
    super(process, data);
  }

  /**
   * It returns an array of activities that are in the lane.
   *
   * @returns An array of activities that are in the lane.
   */
  get flowNodeRef(): Activity[] {
    if (!this['bpmn:lane']) return [];

    return this['bpmn:lane']['bpmn:flowNodeRef']?.map((id) => {
      const options = getBPMNActivity(this.process, { id });
      return getActivity(this.process, options);
    });
  }

  /**
   * It takes a BPMNLaneSet and a BPMNProcess and returns a Lane
   *
   * @param {BPMNLaneSet} el - BPMNLaneSet - this is the element that is being built.
   * @param {BPMNProcess} process - The parent process of the lane
   *
   * @returns A new instance of the Lane class.
   */
  static build(el: BPMNLaneSet, process: BPMNProcess) {
    return new Lane(process, { ...el });
  }
}
