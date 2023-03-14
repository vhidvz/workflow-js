"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventActivity = exports.EventDefinitionType = exports.IntermediateType = exports.EventType = void 0;
const tools_1 = require("../../tools");
const base_1 = require("../base");
var EventType;
(function (EventType) {
    EventType["End"] = "end";
    EventType["Start"] = "start";
    EventType["Boundary"] = "boundary";
    EventType["Intermediate"] = "intermediate";
})(EventType = exports.EventType || (exports.EventType = {}));
var IntermediateType;
(function (IntermediateType) {
    IntermediateType["Throw"] = "throw";
    IntermediateType["Catch"] = "catch";
})(IntermediateType = exports.IntermediateType || (exports.IntermediateType = {}));
var EventDefinitionType;
(function (EventDefinitionType) {
    EventDefinitionType["Link"] = "link";
    EventDefinitionType["Timer"] = "timer";
    EventDefinitionType["Error"] = "error";
    EventDefinitionType["Signal"] = "signal";
    EventDefinitionType["Message"] = "message";
    EventDefinitionType["Escalation"] = "escalation";
    EventDefinitionType["Conditional"] = "conditional";
    EventDefinitionType["Compensation"] = "compensation";
})(EventDefinitionType = exports.EventDefinitionType || (exports.EventDefinitionType = {}));
/* If the event is attached to a reference, it's a boundary event. If the event's key contains the word
"end", it's an end event. If the event's key contains the word "start", it's a start event. If the
event's key contains the word "intermediate", it's an intermediate event. If none of the above are
true, it's a start event. If the key contains the word "throw", return "Throw", otherwise if the key
contains the word "catch", return "Catch". If the event definition is a link event definition,
return the link event definition type, otherwise if it's a timer event definition, return the timer
event definition type, otherwise if it's an error event definition, return the error event
definition type, otherwise if it's a signal event definition, return the signal event definition
type, otherwise if it's a message event definition, return the message event definition type,
otherwise if it's an escalation event definition, return */
class EventActivity extends base_1.Activity {
    constructor(process, data, key) {
        super(process, data, key);
    }
    /**
     * It returns the activity that the boundary event is attached to.
     *
     * @returns The activity that the boundary event is attached to.
     */
    get attachedToRef() {
        if (!this.$.attachedToRef)
            return;
        const options = (0, tools_1.getBPMNActivity)(this.process, { id: this.$.attachedToRef });
        if (options)
            return (0, tools_1.getActivity)(this.process, options);
    }
    /**
     * If the event is attached to a reference, it's a boundary event. If the event's key contains the
     * word "end", it's an end event. If the event's key contains the word "start", it's a start event.
     * If the event's key contains the word "intermediate", it's an intermediate event. If none of the
     * above are true, it's a start event
     *
     * @returns The type of the event.
     */
    get type() {
        var _a, _b, _c, _d, _e, _f;
        if (this.$.attachedToRef)
            return EventType.Boundary;
        if ((_b = (_a = this.key) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('end'))
            return EventType.End;
        if ((_d = (_c = this.key) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.includes('start'))
            return EventType.Start;
        if ((_f = (_e = this.key) === null || _e === void 0 ? void 0 : _e.toLowerCase()) === null || _f === void 0 ? void 0 : _f.includes('intermediate'))
            return EventType.Intermediate;
    }
    /**
     * If the key contains the word "throw", return "Throw", otherwise if the key contains the word
     * "catch", return "Catch"
     *
     * @returns The intermediateType property is being returned.
     */
    get intermediateType() {
        var _a, _b, _c, _d;
        if ((_b = (_a = this.key) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('throw'))
            return IntermediateType.Throw;
        if ((_d = (_c = this.key) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.includes('catch'))
            return IntermediateType.Catch;
    }
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
    get eventDefinitionType() {
        if ('bpmn:linkEventDefinition' in this)
            return EventDefinitionType.Link;
        else if ('bpmn:timerEventDefinition' in this)
            return EventDefinitionType.Timer;
        else if ('bpmn:errorEventDefinition' in this)
            return EventDefinitionType.Error;
        else if ('bpmn:signalEventDefinition' in this)
            return EventDefinitionType.Signal;
        else if ('bpmn:messageEventDefinition' in this)
            return EventDefinitionType.Message;
        else if ('bpmn:escalationEventDefinition' in this)
            return EventDefinitionType.Escalation;
        else if ('bpmn:conditionalEventDefinition' in this)
            return EventDefinitionType.Conditional;
        else if ('bpmn:compensationEventDefinition' in this)
            return EventDefinitionType.Compensation;
    }
    /**
     * A static method that is used to create a new instance of the EventActivity class.
     *
     * @param {BPMNEvent} el - BPMNEvent - the BPMN element that is being built
     * @param {BPMNProcess} process - The process that the activity belongs to.
     * @param {string} [key] - The key of the activity.
     *
     * @returns A new instance of the EventActivity class.
     */
    static build(el, process, key) {
        return new EventActivity(process, Object.assign({}, el), key);
    }
}
exports.EventActivity = EventActivity;
//# sourceMappingURL=event.js.map