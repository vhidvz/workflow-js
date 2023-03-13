/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { $, BPMNActivity, BPMNDefinition, BPMNEvent, BPMNGateway, BPMNProcess, BPMNTask } from './type';
import { Activity, Container, EventActivity, GatewayActivity, Sequence, TaskActivity } from './core';
import { IdentityOptions } from './common';

/**
 * It takes a BPMN definition and an identity object, and returns the process that matches the identity
 *
 * @param {BPMNDefinition} definition - The BPMN definition object.
 * @param {IdentityOptions} identity - IdentityOptions
 *
 * @returns A BPMNProcess
 */
export const getBPMNProcess = (definition: BPMNDefinition, identity: IdentityOptions) => {
  const processes = definition['bpmn:process'];
  const collaborations = definition['bpmn:collaboration'];

  if ('name' in identity) {
    let processId: string | undefined;

    collaborations.some((collaboration) => {
      const participant = collaboration['bpmn:participant'].find((el) => el.$.name === identity.name);
      return !!(processId = participant?.$?.processRef);
    });

    return processes.find((process) => process.$.id === processId);
  }

  return processes.find((process) => process.$.id === identity.id);
};

/**
 * It returns the activity object from the BPMN process object
 *
 * @param {BPMNProcess} process - The BPMNProcess object
 * @param {IdentityOptions} identity - IdentityOptions
 * @param options - cache: boolean = cache: true
 *
 * @returns An object with a key and activity.
 */
export const getBPMNActivity = (
  process: BPMNProcess,
  identity: IdentityOptions,
  options: { cache: boolean } = { cache: true },
) => {
  const activity = !options?.cache || Container.getActivity(process.$.id, identity);

  if (typeof activity !== 'object') {
    for (const [key, activities] of Object.entries(process)) {
      if (typeof activities === 'object' && Array.isArray(activities)) {
        for (const activity of activities) {
          options?.cache && Container.addActivity(process.$.id, { key, activity });

          if ('id' in identity && '$' in activity && (activity.$ as $).id === identity.id)
            return { key, activity };
          if ('name' in identity && '$' in activity && (activity.$ as $).name === identity.name)
            return { key, activity };
        }
      }
    }
  } else return activity;
};

/**
 * It takes a BPMNProcess and an optional options object, and returns an Activity
 *
 * @param {BPMNProcess} process - The BPMNProcess object that contains the activity.
 * @param [options] - key: string; activity: BPMNActivity
 *
 * @returns A new Activity object
 */
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

/**
 * It takes a list of outgoing sequences and an optional identity, and returns a list of target
 * references
 *
 * @param {Sequence[]} outgoing - Sequence[] - the outgoing sequence array
 * @param {IdentityOptions} [identity] - IdentityOptions
 *
 * @returns The function takes in a sequence and an identity. If the identity is defined, it will
 * filter the sequence by the id or name of the identity. If the identity is not defined, it will
 * return the sequence.
 */
export const takeOutgoing = (outgoing: Sequence[], identity?: IdentityOptions) => {
  if (identity) {
    if (identity && 'id' in identity)
      return outgoing?.filter((o) => o.targetRef?.id === identity.id).map((o) => o.targetRef!);
    if (identity && 'name' in identity)
      return outgoing?.filter((o) => o.targetRef?.name === identity.name).map((o) => o.targetRef!);
  } else return outgoing?.map((o) => o.targetRef!);
};
