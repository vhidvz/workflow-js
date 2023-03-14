"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowJS = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
const common_1 = require("../common");
const tools_1 = require("../tools");
const context_1 = require("../context");
const utils_1 = require("../utils");
const core_1 = require("../core");
const log = (0, utils_1.logger)('engine');
/**
 * It runs the activity, and returns the value and exception
 *
 * @param {any} target - any - The target object that contains the method to be executed.
 * @param {string} method - The name of the method to be executed.
 * @param {MethodOptions} options - MethodOptions
 *
 * @returns The value of the method, or the exception if there is one.
 */
function run(target, method, options) {
    var _a, _b, _c, _d;
    options.activity.token = options.token;
    options.activity.context = options.context;
    let value;
    let exception;
    try {
        options.token.status = context_1.Status.Running;
        options.context.status = context_1.Status.Running;
        let outgoing;
        log.info(`Activity ${(_a = options.activity.id) !== null && _a !== void 0 ? _a : options.activity.name} is running`);
        if (!method) {
            log.warn(`Activity ${(_b = options.activity.id) !== null && _b !== void 0 ? _b : options.activity.name} method not defined`);
            value = options.value;
            outgoing = options.activity.takeOutgoing();
        }
        else
            value = target[method](options);
        log.info(`Activity ${(_c = options.activity.id) !== null && _c !== void 0 ? _c : options.activity.name} completed`);
        /* This is the code that is responsible for pausing the workflow token. */
        if (method && options.activity.id === options.token.state.ref)
            options.activity.takeOutgoing(undefined, { pause: true });
        if (options.activity.isEnd())
            options.token.status = context_1.Status.Terminated;
        if (!(outgoing === null || outgoing === void 0 ? void 0 : outgoing.length) && !method && !options.activity.isEnd())
            options.token.pause();
    }
    catch (error) {
        options.context.status = context_1.Status.Failed;
        options.token.status = context_1.Status.Failed;
        exception = error;
        log.error(`Activity ${(_d = options.activity.id) !== null && _d !== void 0 ? _d : options.activity.name} failed with error %O`, error);
    }
    return { value, exception };
}
class WorkflowJS {
    static build(exec) {
        const workflow = new this();
        if (exec) {
            workflow.target = exec === null || exec === void 0 ? void 0 : exec.target;
            workflow.context = exec === null || exec === void 0 ? void 0 : exec.context;
            workflow.process = exec === null || exec === void 0 ? void 0 : exec.process;
            workflow.options = exec === null || exec === void 0 ? void 0 : exec.options;
            workflow.definition = exec === null || exec === void 0 ? void 0 : exec.definition;
        }
        return workflow;
    }
    /**
     * It executes a workflow
     *
     * @param {ExecutionInterface} options - ExecutionInterface
     *
     * @returns The return value is an object with the following properties:
     */
    execute(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        if (!this.target && ((_a = options === null || options === void 0 ? void 0 : options.exec) === null || _a === void 0 ? void 0 : _a.target))
            this.target = options.exec.target;
        if (!this.context && ((_b = options === null || options === void 0 ? void 0 : options.exec) === null || _b === void 0 ? void 0 : _b.context))
            this.context = options.exec.context;
        if (!this.process && ((_c = options === null || options === void 0 ? void 0 : options.exec) === null || _c === void 0 ? void 0 : _c.process))
            this.process = options.exec.process;
        if (!this.definition && ((_d = options === null || options === void 0 ? void 0 : options.exec) === null || _d === void 0 ? void 0 : _d.definition))
            this.definition = options.exec.definition;
        const { handler, factory, path, xml, schema } = options;
        if (!this.definition && options.id)
            this.definition = core_1.Container.getDefinition(options.id);
        if (!this.definition && schema)
            this.definition = schema;
        else if (!this.definition && xml)
            this.definition = (0, utils_1.parse)(xml)['bpmn:definitions'];
        else if (!this.definition && path)
            this.definition = (0, utils_1.parse)((0, utils_1.readFile)(path))['bpmn:definitions'];
        if (!this.target) {
            this.target = '$__metadata__' in this ? this : (_e = (factory !== null && factory !== void 0 ? factory : (() => undefined))()) !== null && _e !== void 0 ? _e : handler;
        }
        if (!this.target)
            throw new Error('Target workflow not found');
        const metadata = this.target.$__metadata__;
        const nodes = Reflect.getMetadata(common_1.NodeKey, this.target, '$__metadata__');
        this.definition = (_f = this.definition) !== null && _f !== void 0 ? _f : core_1.Container.getDefinition(metadata.definition.id);
        if (!this.definition)
            throw new Error('Definition schema not found');
        log.info(`Definition %o is loaded`, metadata.definition);
        this.process = (_g = this.process) !== null && _g !== void 0 ? _g : (0, tools_1.getBPMNProcess)(this.definition, metadata.process);
        if (!this.process)
            throw new Error('Process definition not found');
        log.info(`Process %o is loaded`, metadata.process);
        const { context, data, value } = options;
        this.context = (_j = (_h = this.context) !== null && _h !== void 0 ? _h : context) !== null && _j !== void 0 ? _j : context_1.Context.build({ data, status: context_1.Status.Ready });
        if (!((_k = this.context) === null || _k === void 0 ? void 0 : _k.status))
            this.context.status = context_1.Status.Ready;
        if ([context_1.Status.Completed, context_1.Status.Terminated].includes(this.context.status))
            throw new Error('Cannot execute workflow at completed or terminated state');
        if (this.context.status !== context_1.Status.Ready)
            this.context.resume();
        if (!this.context.isReady())
            throw new Error('Context is not ready to consume');
        /* Checking if the options has a node, if it does, it will get the activity from the process. If it
        does not, it will check if the context has tokens. If it does not, it will get the start event
        from the process. If it does, it will throw an error. */
        let activity;
        if (options === null || options === void 0 ? void 0 : options.node) {
            activity = (0, tools_1.getActivity)(this.process, (0, tools_1.getBPMNActivity)(this.process, options.node, { cache: !!((_l = this.options) === null || _l === void 0 ? void 0 : _l.cache) }));
        }
        else if (!this.context.tokens.length) {
            if (!this.process['bpmn:startEvent'] || this.process['bpmn:startEvent'].length !== 1)
                throw new Error('Start event is not defined in process or have more than one start event');
            activity = (0, tools_1.getActivity)(this.process, {
                key: 'bpmn:startEvent',
                activity: this.process['bpmn:startEvent'][0],
            });
        }
        if (!activity)
            throw new Error('Node activity not found');
        /* Checking if the context has tokens. If it does not, it creates a new token and adds it to the
        context. If it does, it gets the last token from the context and resumes it. */
        let token;
        if (this.context.tokens.length == 0) {
            const state = context_1.State.build(activity.id, { name: activity.name, value, status: context_1.Status.Ready });
            token = context_1.Token.build().push(state);
            this.context.addToken(token);
        }
        else {
            token = (_m = this.context.getTokens(activity.$)) === null || _m === void 0 ? void 0 : _m.pop();
            if (token === null || token === void 0 ? void 0 : token.isPaused()) {
                if (!token.resume().isReady())
                    throw new Error('Token is not ready to consume');
            }
        }
        if (!token)
            throw new Error('Token not found');
        let node;
        if (activity.name)
            node = nodes[activity.name];
        if (!node && activity.id)
            node = nodes[activity.id];
        log.info(`Node %o is loaded`, node);
        const runOptions = {
            method: (_o = node === null || node === void 0 ? void 0 : node.propertyName) !== null && _o !== void 0 ? _o : '',
            options: { activity, token, value, data: data !== null && data !== void 0 ? data : this.context.data, context: this.context },
        };
        /* A loop that will run until the context status is not running. */
        do {
            const result = run(this.target, runOptions.method, runOptions.options);
            log.debug(`Result of %o method is %O`, runOptions.method, (_p = result.value) !== null && _p !== void 0 ? _p : '[null]');
            if (result.exception)
                throw result.exception;
            if (this.context.status === context_1.Status.Running) {
                const next = this.context.next();
                log.info(`Next node is ${(_r = (_q = next === null || next === void 0 ? void 0 : next.name) !== null && _q !== void 0 ? _q : next === null || next === void 0 ? void 0 : next.ref) !== null && _r !== void 0 ? _r : '[undefined]'}`);
                if (!next)
                    break;
                runOptions.method = '';
                next.value = result.value;
                if (next.name)
                    runOptions.method = (_t = (_s = nodes[next.name]) === null || _s === void 0 ? void 0 : _s.propertyName) !== null && _t !== void 0 ? _t : '';
                if (!runOptions.method)
                    runOptions.method = (_v = (_u = nodes[next.ref]) === null || _u === void 0 ? void 0 : _u.propertyName) !== null && _v !== void 0 ? _v : '';
                log.info(`Next method is ${(_w = runOptions.method) !== null && _w !== void 0 ? _w : '[undefined]'}`);
                const token = (_x = this.context.getTokens({ id: next.ref })) === null || _x === void 0 ? void 0 : _x.find((t) => t.status === context_1.Status.Ready);
                if (!token)
                    throw new Error('Token not found at running stage');
                const instance = (0, tools_1.getBPMNActivity)(this.process, { id: next.ref }, { cache: !!((_y = this.options) === null || _y === void 0 ? void 0 : _y.cache) });
                if (!instance)
                    throw new Error('BPMN activity instance not found');
                const activity = (0, tools_1.getActivity)(this.process, instance);
                log.info(`Next Activity is ${(_0 = (_z = activity === null || activity === void 0 ? void 0 : activity.name) !== null && _z !== void 0 ? _z : activity === null || activity === void 0 ? void 0 : activity.id) !== null && _0 !== void 0 ? _0 : '[undefined]'}`);
                runOptions.options = {
                    token,
                    activity,
                    value: next.value,
                    context: this.context,
                    data: data !== null && data !== void 0 ? data : this.context.data,
                };
            }
        } while (this.context.status === context_1.Status.Running);
        /* Setting the status of the context to the appropriate status. */
        if (this.context.isPaused())
            this.context.status = context_1.Status.Paused;
        else if (this.context.isTerminated())
            this.context.status = context_1.Status.Terminated;
        if (![context_1.Status.Paused, context_1.Status.Terminated].includes(this.context.status))
            this.context.isPausedOrTerminated() && (this.context.status = context_1.Status.Completed);
        log.info(`Context status is ${this.context.status}`);
        return {
            target: this.target,
            context: this.context,
            process: this.process,
            definition: this.definition,
        };
    }
}
exports.WorkflowJS = WorkflowJS;
//# sourceMappingURL=workflow.js.map