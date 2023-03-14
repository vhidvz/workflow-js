import { State, StateInterface } from './state';
import { Status } from './enums';
export interface TokenInterface {
    readonly id: string;
    parent?: string;
    locked?: boolean;
    histories: StateInterface[];
}
export declare class Token implements TokenInterface {
    readonly id: string;
    parent?: string;
    locked?: boolean;
    histories: State[];
    constructor(data?: Partial<TokenInterface>);
    /**
     * It pushes a history to the histories array
     *
     * @param {State} history - State
     *
     * @returns The current instance of the class.
     */
    push(history: State): this;
    /**
     * Remove the last item from the histories array and return the current instance of the class.
     *
     * @returns The object itself.
     */
    pop(): this;
    /**
     * Pause the current animation and return the animation object.
     *
     * @returns The object itself.
     */
    pause(): this;
    /**
     * If the status is paused, set the status to ready
     *
     * @returns The current instance of the class.
     */
    resume(): this;
    /**
     * If the status property of the current instance is equal to the Ready constant, return true,
     * otherwise return false.
     *
     * @returns A boolean value.
     */
    isReady(): boolean;
    /**
     * If the status is equal to the Paused value, then return true, otherwise return false.
     *
     * @returns A boolean value.
     */
    isPaused(): boolean;
    /**
     * It serializes the object.
     *
     * @param options - value: true
     *
     * @returns An object with the id, parent, histories, and locked properties.
     */
    serialize(options?: {
        value: boolean;
    }): {
        locked?: boolean | undefined;
        histories: {
            value?: any;
            name?: string | undefined;
            ref: string;
            status: Status;
        }[];
        parent?: string | undefined;
        id: string;
    };
    /**
     * The function takes in a status and sets the status of the state to the status that was passed in
     *
     * @param {Status} status - The status of the current game.
     */
    set status(status: Status);
    /**
     * If the state is not null, return the status of the state. Otherwise, return the status of the
     * ready state
     *
     * @returns The status of the state.
     */
    get status(): Status;
    /**
     * It returns the last element of the histories array
     *
     * @returns The last element in the array.
     */
    get state(): State<any>;
    /**
     * It takes a JSON object and returns a new Token object with the same properties as the JSON object,
     * except that the histories property is an array of State objects instead of an array of JSON
     * objects
     *
     * @param {Token} data - Token - this is the data that is passed in from the deserialize function.
     *
     * @returns A new Token object with the data passed in and the histories mapped to State objects.
     */
    static deserialize(data: TokenInterface): Token;
    /**
     * It creates a new instance of the Token class.
     *
     * @param {TokenInterface} [options] - The options object that will be passed to the constructor.
     *
     * @returns A new instance of the Token class.
     */
    static build(options?: Partial<TokenInterface>): Token;
}
