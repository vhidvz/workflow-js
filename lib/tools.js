"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.takeOutgoing = exports.getActivity = exports.getBPMNActivity = exports.getBPMNProcess = void 0;
const core_1 = require("./core");
/**
 * It takes a BPMN definition and an identity object, and returns the process that matches the identity
 *
 * @param {BPMNDefinition} definition - The BPMN definition object.
 * @param {IdentityOptions} identity - IdentityOptions
 *
 * @returns A BPMNProcess
 */
const getBPMNProcess = (definition, identity) => {
    const processes = definition['bpmn:process'];
    const collaborations = definition['bpmn:collaboration'];
    if ('name' in identity) {
        let processId;
        collaborations.some((collaboration) => {
            var _a;
            const participant = collaboration['bpmn:participant'].find((el) => el.$.name === identity.name);
            processId = (_a = participant === null || participant === void 0 ? void 0 : participant.$) === null || _a === void 0 ? void 0 : _a.processRef;
            return !!processId;
        });
        return processes.find((process) => process.$.id === processId);
    }
    return processes.find((process) => process.$.id === identity.id);
};
exports.getBPMNProcess = getBPMNProcess;
/**
 * It returns the activity object from the BPMN process object
 *
 * @param {BPMNProcess} process - The BPMNProcess object
 * @param {IdentityOptions} identity - IdentityOptions
 * @param options - cache: boolean = cache: true
 *
 * @returns An object with a key and activity.
 */
const getBPMNActivity = (process, identity, options) => {
    const wrappedActivity = !(options === null || options === void 0 ? void 0 : options.cache) || core_1.Container.getActivity(process.$.id, identity);
    if (typeof wrappedActivity !== 'object') {
        for (const [key, activities] of Object.entries(process)) {
            if (typeof activities === 'object' && Array.isArray(activities)) {
                for (const activity of activities) {
                    if ((options === null || options === void 0 ? void 0 : options.cache) && !core_1.Container.getActivity(process.$.id, activity.$))
                        core_1.Container.addActivity(process.$.id, { key, activity });
                    if ('id' in identity && activity.$.id === identity.id)
                        return { key, activity };
                    if ('name' in identity && activity.$.name === identity.name)
                        return { key, activity };
                }
            }
        }
    }
    else
        return wrappedActivity;
};
exports.getBPMNActivity = getBPMNActivity;
/**
 * It takes a BPMNProcess and an optional options object, and returns an Activity
 *
 * @param {BPMNProcess} process - The BPMNProcess object that contains the activity.
 * @param [options] - key: string; activity: BPMNActivity
 *
 * @returns A new Activity object
 */
const getActivity = (process, options) => {
    var _a, _b, _c;
    if (!options)
        return new core_1.Activity(process);
    const { key, activity } = options;
    if ((_a = key === null || key === void 0 ? void 0 : key.toLowerCase()) === null || _a === void 0 ? void 0 : _a.includes('task')) {
        return core_1.TaskActivity.build(activity, process, key);
    }
    if ((_b = key === null || key === void 0 ? void 0 : key.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('event')) {
        return core_1.EventActivity.build(activity, process, key);
    }
    if ((_c = key === null || key === void 0 ? void 0 : key.toLowerCase()) === null || _c === void 0 ? void 0 : _c.includes('gateway')) {
        return core_1.GatewayActivity.build(activity, process, key);
    }
    return new core_1.Activity(process, activity, key);
};
exports.getActivity = getActivity;
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
const takeOutgoing = (outgoing, identity) => {
    if (identity) {
        if ('id' in identity)
            return outgoing === null || outgoing === void 0 ? void 0 : outgoing.filter((o) => { var _a; return ((_a = o.targetRef) === null || _a === void 0 ? void 0 : _a.id) === identity.id; }).map((o) => o.targetRef);
        if ('name' in identity)
            return outgoing === null || outgoing === void 0 ? void 0 : outgoing.filter((o) => { var _a; return ((_a = o.targetRef) === null || _a === void 0 ? void 0 : _a.name) === identity.name; }).map((o) => o.targetRef);
    }
    else
        return outgoing === null || outgoing === void 0 ? void 0 : outgoing.map((o) => o.targetRef);
};
exports.takeOutgoing = takeOutgoing;
//# sourceMappingURL=tools.js.map