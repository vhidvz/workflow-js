import { BPMNActivity, BPMNDefinition, BPMNProcess, BPMNTask } from './type';
import { Activity, Sequence } from './core';
import { IdentityOptions } from './common';
/**
 * It takes a BPMN definition and an identity object, and returns the process that matches the identity
 *
 * @param {BPMNDefinition} definition - The BPMN definition object.
 * @param {IdentityOptions} identity - IdentityOptions
 *
 * @returns A BPMNProcess
 */
export declare const getBPMNProcess: (definition: BPMNDefinition, identity: IdentityOptions) => BPMNProcess | undefined;
/**
 * It returns the activity object from the BPMN process object
 *
 * @param {BPMNProcess} process - The BPMNProcess object
 * @param {IdentityOptions} identity - IdentityOptions
 * @param options - cache: boolean = cache: true
 *
 * @returns An object with a key and activity.
 */
export declare const getBPMNActivity: (process: BPMNProcess, identity: IdentityOptions, options?: {
    cache: boolean;
}) => {
    key: string;
    activity: import("./type").BPMNLaneSet | import("./type").BPMNSequenceFlow | import("./type").BPMNNormalGateway | import("./type").BPMNStrictGateway | import("./type").BPMNIntermediateEvent | import("./type").BPMNBoundaryEvent | import("./type").BPMNStartEvent | import("./type").BPMNEndEvent | BPMNTask | (import("./type").BPMNElement & {
        'bpmn:triggeredByEvent'?: boolean | undefined;
    } & Omit<BPMNProcess, "bpmn:isExecutable" | "bpmn:laneSet">);
} | undefined;
/**
 * It takes a BPMNProcess and an optional options object, and returns an Activity
 *
 * @param {BPMNProcess} process - The BPMNProcess object that contains the activity.
 * @param [options] - key: string; activity: BPMNActivity
 *
 * @returns A new Activity object
 */
export declare const getActivity: (process: BPMNProcess, options?: {
    key: string;
    activity: BPMNActivity;
}) => Activity;
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
export declare const takeOutgoing: (outgoing: Sequence[], identity?: IdentityOptions) => Activity[] | undefined;
