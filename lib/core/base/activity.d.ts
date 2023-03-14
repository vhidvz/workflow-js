import { BPMNActivity, BPMNProcess } from '../../type';
import { Context, Token } from '../../context';
import { IdentityOptions } from '../../common';
import { Attribute } from './attribute';
import { Sequence } from './sequence';
export declare class Activity extends Attribute {
    protected readonly key?: string;
    token?: Token;
    context?: Context;
    private readonly 'bpmn:incoming';
    private readonly 'bpmn:outgoing';
    constructor(process: BPMNProcess, data?: Partial<Activity>, key?: string);
    /**
     * > The `incoming` property returns an array of `Sequence` objects that are incoming to the current
     * `Activity`
     *
     * @returns An array of Sequence objects.
     */
    get incoming(): Sequence[];
    /**
     * > It returns an array of `Sequence` objects that are outgoing from the current activity
     *
     * @returns An array of Sequence objects
     */
    get outgoing(): Sequence[];
    /**
     * It takes the outgoing sequence flows from the current activity and creates a new token for each
     * one
     *
     * @param {IdentityOptions} [identity] - IdentityOptions
     * @param [options] - pause: boolean
     *
     * @returns The outgoing activity
     */
    takeOutgoing(identity?: IdentityOptions, options?: {
        pause: boolean;
    }): Activity[] | undefined;
    /**
     * If the key property of the current node is not null and includes the string 'endEvent', return
     * true
     *
     * @returns The key of the current node.
     */
    isEnd(): boolean | undefined;
    /**
     * If the key property exists and includes the string 'startEvent', return true. Otherwise, return
     * false
     *
     * @returns A boolean value.
     */
    isStart(): boolean | undefined;
    /**
     * It creates a new Activity object.
     *
     * @param {BPMNActivity} el - BPMNActivity - the element from the BPMN file
     * @param {BPMNProcess} process - The process that the activity belongs to.
     * @param {string} [key] - The key of the element.
     *
     * @returns A new instance of the Activity class.
     */
    static build(el: BPMNActivity, process: BPMNProcess, key?: string): Activity;
}
