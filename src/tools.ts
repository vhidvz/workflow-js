/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Activity, EventActivity, GatewayActivity, Sequence, TaskActivity } from './core';
import { BPMNActivity, BPMNEvent, BPMNGateway, BPMNProcess, BPMNTask } from './type';
import { IdentityOptions } from './common';

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

export const takeOutgoing = (outgoing: Sequence[], identity?: IdentityOptions) => {
  if (identity) {
    if (identity && 'id' in identity)
      return outgoing?.filter((o) => o.targetRef?.id === identity.id).map((o) => o.targetRef!);
    if (identity && 'name' in identity)
      return outgoing?.filter((o) => o.targetRef?.name === identity.name).map((o) => o.targetRef!);
  } else return outgoing?.map((o) => o.targetRef!);
};
