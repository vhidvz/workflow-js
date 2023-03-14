"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
/* It's a class that represents a state */
class State {
    constructor(data) {
        if (data)
            Object.assign(this, data);
    }
    /**
     * It returns an object with the properties ref, name, status, and value.
     *
     * @param options - value: true
     *
     * @returns An object with the ref, name, status, and value properties.
     */
    serialize(options = { value: true }) {
        return Object.assign(Object.assign({ ref: this.ref, status: this.status }, (this.name ? { name: this.name } : {})), ((options === null || options === void 0 ? void 0 : options.value) ? { value: this.value } : {}));
    }
    /**
     * It takes a State object and returns a new State object with the same properties
     *
     * @param {State} data - The data to be deserialized.
     *
     * @returns A new instance of the State class.
     */
    static deserialize(data) {
        return new State(Object.assign({}, data));
    }
    /**
     * It returns a new instance of the State class, with the ref and options parameters passed to the
     * constructor
     *
     * @param {string} ref - The name of the state.
     * @param options - options
     *
     * @returns A new instance of the State class.
     */
    static build(ref, options) {
        return new State(Object.assign({ ref }, options));
    }
}
exports.State = State;
//# sourceMappingURL=state.js.map