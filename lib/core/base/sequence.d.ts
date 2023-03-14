import { BPMNProcess, BPMNSequenceFlow } from '../../type';
import { Attribute } from './attribute';
import { Activity } from './activity';
export declare class Sequence extends Attribute {
    $: {
        id: string;
        name?: string;
        sourceRef: string;
        targetRef: string;
    };
    constructor(process: BPMNProcess, data?: Partial<Sequence>);
    /**
     * It returns the sourceRef of the sequence flow.
     *
     * @returns The sourceRef property is being returned.
     */
    get sourceRef(): Activity | undefined;
    /**
     * It returns the targetRef of the sequence flow.
     *
     * @returns The targetRef property of the SequenceFlow object.
     */
    get targetRef(): Activity | undefined;
    /**
     * It takes a BPMNSequenceFlow and a BPMNProcess and returns a Sequence
     *
     * @param {BPMNSequenceFlow} el - BPMNSequenceFlow - the BPMN element that is being built
     * @param {BPMNProcess} process - The process that the sequence flow belongs to.
     *
     * @returns A new instance of the Sequence class.
     */
    static build(el: BPMNSequenceFlow, process: BPMNProcess): Sequence;
}
