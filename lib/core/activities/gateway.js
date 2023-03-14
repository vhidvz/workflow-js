"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayActivity = exports.GatewayType = void 0;
const tools_1 = require("../../tools");
const context_1 = require("../../context");
const base_1 = require("../base");
var GatewayType;
(function (GatewayType) {
    GatewayType["Complex"] = "complex";
    GatewayType["Parallel"] = "parallel";
    GatewayType["Inclusive"] = "inclusive";
    GatewayType["Exclusive"] = "exclusive";
    GatewayType["EventBased"] = "eventBased";
})(GatewayType = exports.GatewayType || (exports.GatewayType = {}));
/* It creates a new GatewayActivity object */
class GatewayActivity extends base_1.Activity {
    constructor(process, data, key) {
        super(process, data, key);
    }
    /**
     * > This function takes the outgoing sequence flows of a gateway and returns the next activity to be
     * executed
     *
     * @param {IdentityOptions} [identity] - IdentityOptions
     * @param [options] - pause: boolean
     *
     * @returns The outgoing activity
     */
    takeOutgoing(identity, options) {
        var _a, _b;
        if (!this.outgoing || !((_a = this.outgoing) === null || _a === void 0 ? void 0 : _a.length))
            return;
        let outgoing = (0, tools_1.takeOutgoing)(this.outgoing, identity);
        switch (this.type) {
            case GatewayType.Complex:
                break;
            case GatewayType.Parallel:
                if (this.context && this.token) {
                    const tokens = this.context.getTokens({ id: this.id });
                    if ((tokens === null || tokens === void 0 ? void 0 : tokens.length) !== this.incoming.length) {
                        this.token.pause();
                        return;
                    }
                    else {
                        tokens.forEach((t) => (t.status = context_1.Status.Terminated));
                        outgoing = (0, tools_1.takeOutgoing)(this.outgoing);
                    }
                }
                break;
            case GatewayType.Inclusive:
                break;
            case GatewayType.Exclusive:
                if (outgoing && outgoing.length !== 1)
                    outgoing = ((_b = this.default) === null || _b === void 0 ? void 0 : _b.targetRef) ? [this.default.targetRef] : undefined;
                break;
            case GatewayType.EventBased:
                break;
        }
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
                    token.push(context_1.State.build(activity.id, {
                        name: activity.name,
                        status: pause ? context_1.Status.Paused : context_1.Status.Ready,
                    }));
                    this.context.addToken(token);
                }
            }
        }
        return outgoing;
    }
    /**
     * If the default property exists, get the BPMN activity with the id of the default property, and if
     * that exists, return a new Sequence object with the activity and the process
     *
     * @returns The default sequence flow.
     */
    get default() {
        if (!this.$.default)
            return;
        const options = (0, tools_1.getBPMNActivity)(this.process, { id: this.$.default });
        if (options)
            return base_1.Sequence.build(options.activity, this.process);
    }
    /**
     * If the key contains the word "complex", return GatewayType.Complex, otherwise if the key contains
     * the word "parallel", return GatewayType.Parallel, otherwise if the key contains the word
     * "inclusive", return GatewayType.Inclusive, otherwise if the key contains the word "exclusive",
     * return GatewayType.Exclusive, otherwise if the key contains the word "eventBased", return
     * GatewayType.EventBased, otherwise return undefined
     *
     * @returns The type of the gateway.
     */
    get type() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if ((_b = (_a = this.key) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('complex'))
            return GatewayType.Complex;
        if ((_d = (_c = this.key) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.includes('parallel'))
            return GatewayType.Parallel;
        if ((_f = (_e = this.key) === null || _e === void 0 ? void 0 : _e.toLowerCase()) === null || _f === void 0 ? void 0 : _f.includes('inclusive'))
            return GatewayType.Inclusive;
        if ((_h = (_g = this.key) === null || _g === void 0 ? void 0 : _g.toLowerCase()) === null || _h === void 0 ? void 0 : _h.includes('exclusive'))
            return GatewayType.Exclusive;
        if ((_k = (_j = this.key) === null || _j === void 0 ? void 0 : _j.toLowerCase()) === null || _k === void 0 ? void 0 : _k.includes('eventBased'))
            return GatewayType.EventBased;
    }
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
    static build(el, process, key) {
        return new GatewayActivity(process, Object.assign({}, el), key);
    }
}
exports.GatewayActivity = GatewayActivity;
//# sourceMappingURL=gateway.js.map