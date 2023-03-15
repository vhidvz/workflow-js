/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Activity,
  Container,
  EventActivity,
  GatewayActivity,
  Sequence,
  TaskActivity,
  WrappedElement,
} from './core';
import { BPMNDefinition, BPMNEvent, BPMNGateway, BPMNProcess, BPMNTask } from './type';
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
      processId = participant?.$?.processRef;
      return !!processId;
    });

    return processes.find((process) => process.$.id === processId);
  }

  return processes.find((process) => process.$.id === identity.id);
};

/**
 * It returns the element object from the BPMN process object
 *
 * @param {BPMNProcess} process - The BPMNProcess object
 * @param {IdentityOptions} identity - IdentityOptions
 * @param options - cache: boolean = cache: true
 *
 * @returns An object with a key and element.
 */
export const getWrappedBPMNElement = (process: BPMNProcess, identity: IdentityOptions) => {
  const wrappedElement = Container.getElement(process.$.id, identity);

  if (typeof wrappedElement !== 'object') {
    for (const [key, elements] of Object.entries(process)) {
      if (typeof elements === 'object' && Array.isArray(elements)) {
        for (const element of elements) {
          if (!Container.getElement(process.$.id, element.$))
            Container.addElement(process.$.id, { key, element });

          if ('id' in identity && element.$.id === identity.id) return { key, element };
          if ('name' in identity && element.$.name === identity.name) return { key, element };
        }
      }
    }
  } else return wrappedElement;
};

/**
 * It takes a BPMNProcess and an optional data object, and returns an Activity
 *
 * @param {BPMNProcess} process - The BPMNProcess object that contains the activity.
 * @param [options] - key: string; element: BPMNElement
 *
 * @returns A new Activity object
 */
export const getActivity = (process: BPMNProcess, data?: WrappedElement) => {
  if (!data) return new Activity(process);

  const { key, element } = data;

  if (key?.toLowerCase()?.includes('task')) {
    return TaskActivity.build(element as BPMNTask, process, key);
  }
  if (key?.toLowerCase()?.includes('event')) {
    return EventActivity.build(element as BPMNEvent, process, key);
  }
  if (key?.toLowerCase()?.includes('gateway')) {
    return GatewayActivity.build(element as BPMNGateway, process, key);
  }

  return new Activity(process, element, key);
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
    if ('id' in identity)
      return outgoing?.filter((o) => o.targetRef?.id === identity.id).map((o) => o.targetRef!);
    if ('name' in identity)
      return outgoing?.filter((o) => o.targetRef?.name === identity.name).map((o) => o.targetRef!);
  } else return outgoing?.map((o) => o.targetRef!);
};
