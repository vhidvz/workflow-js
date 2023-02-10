import { BPMNActivity, BPMNEvent, BPMNGateway, BPMNProcess, BPMNTask } from './type';
import { Activity, EventActivity, GatewayActivity, TaskActivity } from './core';

export const getActivity = (process: BPMNProcess, options?: { key: string; activity: BPMNActivity }) => {
  if (!options) return new Activity(process);

  const { key, activity } = options;

  if (key?.toLowerCase()?.includes('task')) {
    return TaskActivity.build(activity as BPMNTask, process, key);
  }
  if (key?.toLowerCase()?.includes('event')) {
    return EventActivity.build(activity as BPMNEvent, process, key);
  }
  if (key?.toLowerCase()?.includes('gateway')) {
    return GatewayActivity.build(activity as BPMNGateway, process, key);
  }

  return new Activity(process, activity, key);
};
