"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const state_1 = require("./state");
const enums_1 = require("./enums");
const utils_1 = require("../utils");
/* It creates a new instance of the Token class */
class Token {
    constructor(data) {
        this.id = (0, utils_1.uid)();
        this.histories = [];
        if (data)
            Object.assign(this, data);
    }
    /**
     * It pushes a history to the histories array
     *
     * @param {State} history - State
     *
     * @returns The current instance of the class.
     */
    push(history) {
        this.histories.push(history);
        return this;
    }
    /**
     * Remove the last item from the histories array and return the current instance of the class.
     *
     * @returns The object itself.
     */
    pop() {
        this.histories.pop();
        return this;
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
     * If the status is paused, set the status to ready
     *
     * @returns The current instance of the class.
     */
    resume() {
        if (this.isPaused())
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
     * If the status is equal to the Paused value, then return true, otherwise return false.
     *
     * @returns A boolean value.
     */
    isPaused() {
        return this.status === enums_1.Status.Paused;
    }
    /**
     * It serializes the object.
     *
     * @param options - value: true
     *
     * @returns An object with the id, parent, histories, and locked properties.
     */
    serialize(options = { value: true }) {
        return Object.assign(Object.assign(Object.assign({ id: this.id }, (this.parent ? { parent: this.parent } : {})), { histories: this.histories.map((h) => h.serialize(options)) }), (this.locked !== undefined ? { locked: this.locked } : {}));
    }
    /**
     * The function takes in a status and sets the status of the state to the status that was passed in
     *
     * @param {Status} status - The status of the current game.
     */
    set status(status) {
        this.state.status = status;
    }
    /**
     * If the state is not null, return the status of the state. Otherwise, return the status of the
     * ready state
     *
     * @returns The status of the state.
     */
    get status() {
        if (!this.state)
            return enums_1.Status.Ready;
        else
            return this.state.status;
    }
    /**
     * It returns the last element of the histories array
     *
     * @returns The last element in the array.
     */
    get state() {
        return this.histories[this.histories.length - 1];
    }
    /**
     * It takes a JSON object and returns a new Token object with the same properties as the JSON object,
     * except that the histories property is an array of State objects instead of an array of JSON
     * objects
     *
     * @param {Token} data - Token - this is the data that is passed in from the deserialize function.
     *
     * @returns A new Token object with the data passed in and the histories mapped to State objects.
     */
    static deserialize(data) {
        return new Token(Object.assign(Object.assign({}, data), { histories: data.histories.map((h) => state_1.State.deserialize(h)) }));
    }
    /**
     * It creates a new instance of the Token class.
     *
     * @param {TokenInterface} [options] - The options object that will be passed to the constructor.
     *
     * @returns A new instance of the Token class.
     */
    static build(options) {
        return new Token(Object.assign({}, options));
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map