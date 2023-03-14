import { BPMNGateway, BPMNProcess } from '../../type';
import { IdentityOptions } from '../../common';
import { Activity, Sequence } from '../base';
export declare enum GatewayType {
    Complex = "complex",
    Parallel = "parallel",
    Inclusive = "inclusive",
    Exclusive = "exclusive",
    EventBased = "eventBased"
}
export declare class GatewayActivity extends Activity {
    $: {
        id: string;
        name?: string;
        default?: string;
    };
    constructor(process: BPMNProcess, data?: Partial<GatewayActivity>, key?: string);
    /**
     * > This function takes the outgoing sequence flows of a gateway and returns the next activity to be
     * executed
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
     * If the default property exists, get the BPMN activity with the id of the default property, and if
     * that exists, return a new Sequence object with the activity and the process
     *
     * @returns The default sequence flow.
     */
    get default(): Sequence | undefined;
    /**
     * If the key contains the word "complex", return GatewayType.Complex, otherwise if the key contains
     * the word "parallel", return GatewayType.Parallel, otherwise if the key contains the word
     * "inclusive", return GatewayType.Inclusive, otherwise if the key contains the word "exclusive",
     * return GatewayType.Exclusive, otherwise if the key contains the word "eventBased", return
     * GatewayType.EventBased, otherwise return undefined
     *
     * @returns The type of the gateway.
     */
    get type(): GatewayType | undefined;
    /**
     * It creates a new GatewayActivity object.
     *
     * @param {BPMNGateway} el - BPMNGateway - this is the BPMN element that is being converted to an
     * activity.
     * @param {BPMNProcess} process - The process that the activity belongs to.
     * @param {string} [key] - The key of the activity. This is used to identify the activity in the
     * process.
     *
     * @returns A new GatewayActivity object.
     */
    static build(el: BPMNGateway, process: BPMNProcess, key?: string): GatewayActivity;
}
