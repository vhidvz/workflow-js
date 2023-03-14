"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const context_1 = require("../../context");
const tools_1 = require("../../tools");
const attribute_1 = require("./attribute");
const sequence_1 = require("./sequence");
/* It's a class that represents an activity in a BPMN file */
class Activity extends attribute_1.Attribute {
    constructor(process, data, key) {
        super(process, data);
        this.key = key;
    }
    /**
     * > The `incoming` property returns an array of `Sequence` objects that are incoming to the current
     * `Activity`
     *
     * @returns An array of Sequence objects.
     */
    get incoming() {
        var _a;
        return (_a = this['bpmn:incoming']) === null || _a === void 0 ? void 0 : _a.map((id) => {
            var _a;
            const activity = (_a = (0, tools_1.getBPMNActivity)(this.process, { id })) === null || _a === void 0 ? void 0 : _a.activity;
            return sequence_1.Sequence.build(activity, this.process);
        });
    }
    /**
     * > It returns an array of `Sequence` objects that are outgoing from the current activity
     *
     * @returns An array of Sequence objects
     */
    get outgoing() {
        var _a;
        return (_a = this['bpmn:outgoing']) === null || _a === void 0 ? void 0 : _a.map((id) => {
            var _a;
            const activity = (_a = (0, tools_1.getBPMNActivity)(this.process, { id })) === null || _a === void 0 ? void 0 : _a.activity;
            if (!activity)
                throw new Error('Outgoing sequenceFlow not found');
            return sequence_1.Sequence.build(activity, this.process);
        });
    }
    /**
     * It takes the outgoing sequence flows from the current activity and creates a new token for each
     * one
     *
     * @param {IdentityOptions} [identity] - IdentityOptions
     * @param [options] - pause: boolean
     *
     * @returns The outgoing activity
     */
    takeOutgoing(identity, options) {
        var _a;
        if (!this.outgoing || !((_a = this.outgoing) === null || _a === void 0 ? void 0 : _a.length))
            return;
        const outgoing = (0, tools_1.takeOutgoing)(this.outgoing, identity);
        if ((outgoing === null || outgoing === void 0 ? void 0 : outgoing.length) && this.token) {
            const { pause } = options !== null && options !== void 0 ? options : {};
            if (outgoing.length === 1) {
                this.token.status = context_1.Status.Completed;
                this.token.push(context_1.State.build(outgoing[0].id, {
                    name: outgoing[0].name,
                    status: pause ? context_1.Status.Paused : context_1.Status.Ready,
                }));
            }
            if (outgoing.length > 1 && this.context) {
                this.token.locked = true;
                this.token.status = context_1.Status.Terminated;
                for (const activity of outgoing) {
                    const token = context_1.Token.build({
                        parent: this.token.id,
                    });
                    token.push(context_1.State.build(activity.id, { name: activity.name, status: pause ? context_1.Status.Paused : context_1.Status.Ready }));
                    this.context.addToken(token);
                }
            }
        }
        return outgoing;
    }
    /**
     * If the key property of the current node is not null and includes the string 'endEvent', return
     * true
     *
     * @returns The key of the current node.
     */
    isEnd() {
        var _a;
        return (_a = this.key) === null || _a === void 0 ? void 0 : _a.includes('endEvent');
    }
    /**
     * If the key property exists and includes the string 'startEvent', return true. Otherwise, return
     * false
     *
     * @returns A boolean value.
     */
    isStart() {
        var _a;
        return (_a = this.key) === null || _a === void 0 ? void 0 : _a.includes('startEvent');
    }
    /**
     * It creates a new Activity object.
     *
     * @param {BPMNActivity} el - BPMNActivity - the element from the BPMN file
     * @param {BPMNProcess} process - The process that the activity belongs to.
     * @param {string} [key] - The key of the element.
     *
     * @returns A new instance of the Activity class.
     */
    static build(el, process, key) {
        return new Activity(process, Object.assign({}, el), key);
    }
}
exports.Activity = Activity;
//# sourceMappingURL=activity.js.map