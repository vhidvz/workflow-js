"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskActivity = exports.TaskType = void 0;
const base_1 = require("../base");
var TaskType;
(function (TaskType) {
    TaskType["Send"] = "send";
    TaskType["User"] = "user";
    TaskType["Manual"] = "manual";
    TaskType["Script"] = "script";
    TaskType["Receive"] = "receive";
    TaskType["Service"] = "service";
    TaskType["Business"] = "business";
})(TaskType = exports.TaskType || (exports.TaskType = {}));
/* If the key property of the current object contains the word "send", return the value of the Send
enum, otherwise if the key property of the current object contains the word "user", return the value
of the User enum, otherwise if the key property of the current object contains the word "manual",
return the value of the Manual enum, otherwise if the key property of the current object contains
the word "script", return the value of the Script enum, otherwise if the key property of the current
object contains the word "receive", return the value of the Receive enum, otherwise if the key
property of the current object contains the word "service", return the value of the Service enum,
otherwise if the key property of the current object contains the word "business", return the value
of the Business enum, otherwise return undefined */
class TaskActivity extends base_1.Activity {
    constructor(process, data, key) {
        super(process, data, key);
    }
    /**
     * If the key property of the current object contains the word "send", return the value of the Send
     * enum, otherwise if the key property of the current object contains the word "user", return the
     * value of the User enum, otherwise if the key property of the current object contains the word
     * "manual", return the value of the Manual enum, otherwise if the key property of the current object
     * contains the word "script", return the value of the Script enum, otherwise if the key property of
     * the current object contains the word "receive", return the value of the Receive enum, otherwise if
     * the key property of the current object contains the word "service", return the value of the
     * Service enum, otherwise if the key property of the current object contains the word "business",
     * return the value of the Business enum, otherwise return undefined
     *
     * @returns The task type.
     */
    get taskType() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if ((_b = (_a = this.key) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('send'))
            return TaskType.Send;
        if ((_d = (_c = this.key) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === null || _d === void 0 ? void 0 : _d.includes('user'))
            return TaskType.User;
        if ((_f = (_e = this.key) === null || _e === void 0 ? void 0 : _e.toLowerCase()) === null || _f === void 0 ? void 0 : _f.includes('manual'))
            return TaskType.Manual;
        if ((_h = (_g = this.key) === null || _g === void 0 ? void 0 : _g.toLowerCase()) === null || _h === void 0 ? void 0 : _h.includes('script'))
            return TaskType.Script;
        if ((_k = (_j = this.key) === null || _j === void 0 ? void 0 : _j.toLowerCase()) === null || _k === void 0 ? void 0 : _k.includes('receive'))
            return TaskType.Receive;
        if ((_m = (_l = this.key) === null || _l === void 0 ? void 0 : _l.toLowerCase()) === null || _m === void 0 ? void 0 : _m.includes('service'))
            return TaskType.Service;
        if ((_p = (_o = this.key) === null || _o === void 0 ? void 0 : _o.toLowerCase()) === null || _p === void 0 ? void 0 : _p.includes('business'))
            return TaskType.Business;
    }
    /**
     * A static method that is used to create a new instance of the TaskActivity class.
     *
     * @param {BPMNTask} el - BPMNTask - this is the BPMN element that is being built.
     * @param {BPMNProcess} process - The process that the activity belongs to.
     * @param {string} [key] - The key of the activity. This is used to identify the activity in the
     * process.
     *
     * @returns A new TaskActivity object.
     */
    static build(el, process, key) {
        return new TaskActivity(process, Object.assign({}, el), key);
    }
}
exports.TaskActivity = TaskActivity;
//# sourceMappingURL=task.js.map