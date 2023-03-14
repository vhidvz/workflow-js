import { BPMNEvent, BPMNProcess } from '../../type';
import { Activity } from '../base';
export declare enum EventType {
    End = "end",
    Start = "start",
    Boundary = "boundary",
    Intermediate = "intermediate"
}
export declare enum IntermediateType {
    Throw = "throw",
    Catch = "catch"
}
export declare enum EventDefinitionType {
    Link = "link",
    Timer = "timer",
    Error = "error",
    Signal = "signal",
    Message = "message",
    Escalation = "escalation",
    Conditional = "conditional",
    Compensation = "compensation"
}
export declare class EventActivity extends Activity {
    $: {
        id: string;
        name?: string;
        attachedToRef?: string;
    };
    constructor(process: BPMNProcess, data?: Partial<EventActivity>, key?: string);
    /**
     * It returns the activity that the boundary event is attached to.
     *
     * @returns The activity that the boundary event is attached to.
     */
    get attachedToRef(): Activity | undefined;
    /**
     * If the event is attached to a reference, it's a boundary event. If the event's key contains the
     * word "end", it's an end event. If the event's key contains the word "start", it's a start event.
     * If the event's key contains the word "intermediate", it's an intermediate event. If none of the
     * above are true, it's a start event
     *
     * @returns The type of the event.
     */
    get type(): EventType | undefined;
    /**
     * If the key contains the word "throw", return "Throw", otherwise if the key contains the word
     * "catch", return "Catch"
     *
     * @returns The intermediateType property is being returned.
     */
    get intermediateType(): IntermediateType | undefined;
    /**
     * If the event definition is a link event definition, return the link event definition type,
     * otherwise if it's a timer event definition, return the timer event definition type, otherwise if
     * it's an error event definition, return the error event definition type, otherwise if it's a signal
     * event definition, return the signal event definition type, otherwise if it's a message event
     * definition, return the message event definition type, otherwise if it's an escalation event
     * definition, return the escalation event definition type, otherwise if it's a conditional event
     * definition, return the conditional event definition type, otherwise if it's a compensation event
     * definition, return the compensation event definition type
     *
     * @returns The type of the event definition.
     */
    get eventDefinitionType(): EventDefinitionType | undefined;
    /**
     * A static method that is used to create a new instance of the EventActivity class.
     *
     * @param {BPMNEvent} el - BPMNEvent - the BPMN element that is being built
     * @param {BPMNProcess} process - The process that the activity belongs to.
     * @param {string} [key] - The key of the activity.
     *
     * @returns A new instance of the EventActivity class.
     */
    static build(el: BPMNEvent, process: BPMNProcess, key?: string): EventActivity;
}
