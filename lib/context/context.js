"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const token_1 = require("./token");
const enums_1 = require("./enums");
/* It's a class that represents the state of a running workflow */
class Context {
    constructor(data) {
        this.tokens = [];
        this.status = enums_1.Status.Ready;
        if (data)
            Object.assign(this, data);
    }
    /**
     * Pause the current animation and return the animation object.
     *
     * @returns The object itself.
     */
    pause() {
        this.status = enums_1.Status.Paused;
        return this;
    }
    /**
     * If the status is running or paused, set the status to ready
     *
     * @returns The instance of the class.
     */
    resume() {
        if ([enums_1.Status.Completed, enums_1.Status.Paused].includes(this.status))
            this.status = enums_1.Status.Ready;
        return this;
    }
    /**
     * If the status property of the current instance is equal to the Ready constant, return true,
     * otherwise return false.
     *
     * @returns A boolean value.
     */
    isReady() {
        return this.status === enums_1.Status.Ready;
    }
    /**
     * It adds a token to the tokens array
     *
     * @param {Token} token - The token to add to the list of tokens.
     */
    addToken(token) {
        this.tokens.push(token);
    }
    /**
     * It returns a list of tokens that match the given identity
     *
     * @param {IdentityOptions} identity - IdentityOptions
     *
     * @returns An array of tokens that match the identity.
     */
    getTokens(identity) {
        if ('id' in identity)
            return this.tokens.filter((token) => token.state.ref === identity.id);
        if ('name' in identity)
            return this.tokens.filter((token) => token.state.name === identity.name);
    }
    /**
     * It deletes all tokens that match the given identity
     *
     * @param {IdentityOptions} identity - IdentityOptions
     */
    delTokens(identity) {
        var _a;
        const tokens = (_a = this.getTokens(identity)) === null || _a === void 0 ? void 0 : _a.map((t) => t.id);
        if (tokens === null || tokens === void 0 ? void 0 : tokens.length)
            this.tokens = this.tokens.filter((t) => !tokens.includes(t.id));
    }
    /**
     * It returns true if every token in the tokens array has a status of Paused
     *
     * @returns A boolean value.
     */
    isPaused() {
        return this.tokens.filter((t) => !t.locked).every((t) => t.status === enums_1.Status.Paused);
    }
    /**
     * If every token in the tokens array has a status of Completed, then return true
     *
     * @returns A boolean value.
     */
    isCompleted() {
        return this.tokens.filter((t) => !t.locked).every((t) => t.status === enums_1.Status.Completed);
    }
    /**
     * It returns true if every token in the tokens array has a status of Terminated
     *
     * @returns A boolean value that is true if all the tokens have a status of Terminated.
     */
    isTerminated() {
        return this.tokens.filter((t) => !t.locked).every((t) => t.status === enums_1.Status.Terminated);
    }
    /**
     * It returns true if all the tokens that are not locked have a status of either paused or terminated
     *
     * @returns A boolean value.
     */
    isPausedOrTerminated() {
        return this.tokens
            .filter((t) => !t.locked)
            .every((t) => [enums_1.Status.Paused, enums_1.Status.Terminated].includes(t.status));
    }
    /**
     * Return the next token's state if it's ready, otherwise return undefined.
     *
     * @returns The state of the first token that has a status of Ready.
     */
    next() {
        var _a;
        return (_a = this.tokens.find((t) => t.status === enums_1.Status.Ready)) === null || _a === void 0 ? void 0 : _a.state;
    }
    /**
     * It returns an object with the data, status, and tokens.
     *
     * @param options - data: true, value: true
     *
     * @returns An object with the data, status, and tokens.
     */
    serialize(options = { data: true, value: true }) {
        return Object.assign(Object.assign({ status: this.status }, ((options === null || options === void 0 ? void 0 : options.data) ? this.data : {})), { tokens: this.tokens.map((t) => t.serialize(options)) });
    }
    /**
     * It takes a serialized context and returns a new context with the tokens deserialized
     *
     * @param data - Context<D>
     *
     * @returns A new Context object with the data passed in and the tokens mapped to Token objects.
     */
    static deserialize(data) {
        return new Context(Object.assign(Object.assign({}, data), { tokens: data.tokens.map((t) => token_1.Token.deserialize(t)) }));
    }
    /**
     * It returns a new instance of the Context class, with the data parameter passed in as the data
     * property of the new instance
     *
     * @param [data] - The data to be passed to the context.
     *
     * @returns A new instance of the Context class.
     */
    static build(data) {
        return new Context(data);
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map