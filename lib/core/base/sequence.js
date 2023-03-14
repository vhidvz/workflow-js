"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = void 0;
const tools_1 = require("../../tools");
const attribute_1 = require("./attribute");
/* It takes a BPMNSequenceFlow and a BPMNProcess and returns a Sequence */
class Sequence extends attribute_1.Attribute {
    constructor(process, data) {
        super(process, data);
    }
    /**
     * It returns the sourceRef of the sequence flow.
     *
     * @returns The sourceRef property is being returned.
     */
    get sourceRef() {
        if (!this.$.sourceRef)
            return;
        const options = (0, tools_1.getBPMNActivity)(this.process, { id: this.$.sourceRef });
        if (options)
            return (0, tools_1.getActivity)(this.process, options);
    }
    /**
     * It returns the targetRef of the sequence flow.
     *
     * @returns The targetRef property of the SequenceFlow object.
     */
    get targetRef() {
        if (!this.$.targetRef)
            return;
        const options = (0, tools_1.getBPMNActivity)(this.process, { id: this.$.targetRef });
        if (options)
            return (0, tools_1.getActivity)(this.process, options);
    }
    /**
     * It takes a BPMNSequenceFlow and a BPMNProcess and returns a Sequence
     *
     * @param {BPMNSequenceFlow} el - BPMNSequenceFlow - the BPMN element that is being built
     * @param {BPMNProcess} process - The process that the sequence flow belongs to.
     *
     * @returns A new instance of the Sequence class.
     */
    static build(el, process) {
        return new Sequence(process, Object.assign({}, el));
    }
}
exports.Sequence = Sequence;
//# sourceMappingURL=sequence.js.map