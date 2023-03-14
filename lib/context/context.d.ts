import { Token, TokenInterface } from './token';
import { IdentityOptions } from '../common';
import { Status } from './enums';
export interface ContextInterface<D = any> {
    data?: D;
    status: Status;
    tokens: TokenInterface[];
}
export declare class Context<D = any> implements ContextInterface<D> {
    data?: D;
    tokens: Token[];
    status: Status;
    constructor(data?: Partial<ContextInterface>);
    /**
     * Pause the current animation and return the animation object.
     *
     * @returns The object itself.
     */
    pause(): this;
    /**
     * If the status is running or paused, set the status to ready
     *
     * @returns The instance of the class.
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
     * It adds a token to the tokens array
     *
     * @param {Token} token - The token to add to the list of tokens.
     */
    addToken(token: Token): void;
    /**
     * It returns a list of tokens that match the given identity
     *
     * @param {IdentityOptions} identity - IdentityOptions
     *
     * @returns An array of tokens that match the identity.
     */
    getTokens(identity: IdentityOptions): Token[] | undefined;
    /**
     * It deletes all tokens that match the given identity
     *
     * @param {IdentityOptions} identity - IdentityOptions
     */
    delTokens(identity: IdentityOptions): void;
    /**
     * It returns true if every token in the tokens array has a status of Paused
     *
     * @returns A boolean value.
     */
    isPaused(): boolean;
    /**
     * If every token in the tokens array has a status of Completed, then return true
     *
     * @returns A boolean value.
     */
    isCompleted(): boolean;
    /**
     * It returns true if every token in the tokens array has a status of Terminated
     *
     * @returns A boolean value that is true if all the tokens have a status of Terminated.
     */
    isTerminated(): boolean;
    /**
     * It returns true if all the tokens that are not locked have a status of either paused or terminated
     *
     * @returns A boolean value.
     */
    isPausedOrTerminated(): boolean;
    /**
     * Return the next token's state if it's ready, otherwise return undefined.
     *
     * @returns The state of the first token that has a status of Ready.
     */
    next(): import("./state").State<any> | undefined;
    /**
     * It returns an object with the data, status, and tokens.
     *
     * @param options - data: true, value: true
     *
     * @returns An object with the data, status, and tokens.
     */
    serialize(options?: {
        data: boolean;
        value: boolean;
    }): {
        tokens: {
            locked?: boolean | undefined;
            histories: {
                value?: any;
                name?: string | undefined;
                ref: string;
                status: Status;
            }[];
            parent?: string | undefined;
            id: string;
        }[];
        status: Status;
    };
    /**
     * It takes a serialized context and returns a new context with the tokens deserialized
     *
     * @param data - Context<D>
     *
     * @returns A new Context object with the data passed in and the tokens mapped to Token objects.
     */
    static deserialize<D = any>(data: ContextInterface<D>): Context<D>;
    /**
     * It returns a new instance of the Context class, with the data parameter passed in as the data
     * property of the new instance
     *
     * @param [data] - The data to be passed to the context.
     *
     * @returns A new instance of the Context class.
     */
    static build<D = any>(data?: Partial<ContextInterface<D>>): Context<D>;
}
