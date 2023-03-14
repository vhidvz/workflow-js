import { Status } from './enums';
export interface StateInterface<V = any> {
    ref: string;
    name?: string;
    status: Status;
    value?: V;
}
export declare class State<V = any> {
    value?: V;
    ref: string;
    name?: string;
    status: Status;
    constructor(data?: Partial<StateInterface>);
    /**
     * It returns an object with the properties ref, name, status, and value.
     *
     * @param options - value: true
     *
     * @returns An object with the ref, name, status, and value properties.
     */
    serialize(options?: {
        value: boolean;
    }): {
        value?: V | undefined;
        name?: string | undefined;
        ref: string;
        status: Status;
    };
    /**
     * It takes a State object and returns a new State object with the same properties
     *
     * @param {State} data - The data to be deserialized.
     *
     * @returns A new instance of the State class.
     */
    static deserialize<V = any>(data: StateInterface<V>): State<V>;
    /**
     * It returns a new instance of the State class, with the ref and options parameters passed to the
     * constructor
     *
     * @param {string} ref - The name of the state.
     * @param options - options
     *
     * @returns A new instance of the State class.
     */
    static build<V = any>(ref: string, options: {
        name?: string;
        value?: V;
        status: Status;
    }): State<V>;
}
