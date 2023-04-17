/* eslint-disable @typescript-eslint/no-explicit-any */
import { Token, TokenInterface } from './token';
import { IdentityOptions } from '../common';
import { Status } from './enums';

export interface ContextInterface<D = any> {
  data?: D;
  status: Status;
  tokens: TokenInterface[];
}

/* It's a class that represents the state of a running workflow */
export class Context<D = any> implements ContextInterface<D> {
  public data?: D;
  public tokens: Token[] = [];
  public status: Status = Status.Ready;

  constructor(data?: Partial<ContextInterface>) {
    if (data) Object.assign(this, data);
  }

  /**
   * Pause the current animation and return the animation object.
   *
   * @returns The object itself.
   */
  pause() {
    this.status = Status.Paused;

    return this;
  }

  /**
   * If the status is running or paused, set the status to ready
   *
   * @returns The instance of the class.
   */
  resume(force = false) {
    if (force) this.status = Status.Ready;
    else if (this.status !== Status.Terminated) {
      this.status = Status.Ready;
    }

    return this;
  }

  /**
   * It adds a token to the tokens array
   *
   * @param {Token} token - The token to add to the list of tokens.
   */
  addToken(token: Token) {
    this.tokens.push(token);
  }

  /**
   * It returns a list of tokens that match the given identity
   *
   * @param {IdentityOptions} identity - IdentityOptions
   *
   * @returns An array of tokens that match the identity.
   */
  getTokens(identity: IdentityOptions) {
    if ('id' in identity) return this.tokens.filter((token) => token.state.ref === identity.id);
    if ('name' in identity) return this.tokens.filter((token) => token.state.name === identity.name);
  }

  /**
   * It deletes all tokens that match the given identity
   *
   * @param {IdentityOptions} identity - IdentityOptions
   */
  delTokens(identity: IdentityOptions) {
    const tokens = this.getTokens(identity)?.map((t) => t.id);
    if (tokens?.length) this.tokens = this.tokens.filter((t) => !tokens.includes(t.id));
  }

  /**
   * If the status property of the current instance is equal to the Ready constant, return true,
   * otherwise return false.
   *
   * @returns A boolean value.
   */
  isReady() {
    return this.status === Status.Ready;
  }

  /**
   * The function checks if the status is equal to "Failed".
   *
   * @returns The `isFailed()` function is returning a boolean value
   */
  isFailed() {
    return this.status === Status.Failed;
  }

  /**
   * It returns true if every token in the tokens array has a status of Paused
   *
   * @returns A boolean value.
   */
  isPaused() {
    return this.tokens.filter((t) => !t.locked).every((t) => t.status === Status.Paused);
  }

  /**
   * If every token in the tokens array has a status of Completed, then return true
   *
   * @returns A boolean value.
   */
  isCompleted() {
    return this.tokens.filter((t) => !t.locked).every((t) => t.status === Status.Completed);
  }

  /**
   * It returns true if every token in the tokens array has a status of Terminated
   *
   * @returns A boolean value that is true if all the tokens have a status of Terminated.
   */
  isTerminated() {
    return this.tokens.filter((t) => !t.locked).every((t) => t.status === Status.Terminated);
  }

  /**
   * It returns true if some token in the tokens array has a status of Terminated
   *
   * @returns A boolean value that is true if all the tokens have a status of Terminated.
   */
  isPartiallyTerminated() {
    return this.tokens.filter((t) => !t.locked).some((t) => t.status === Status.Terminated);
  }

  /**
   * The function sets the status of an object to "Terminated".
   *
   * @returns The `terminate()` method is returning the current object (`this`)
   */
  terminate() {
    this.status = Status.Terminated;

    return this;
  }

  /**
   * Return the next token's state if it's ready, otherwise return undefined.
   *
   * @returns The state of the first token that has a status of Ready.
   */
  next() {
    return this.tokens.find((t) => t.status === Status.Ready)?.state;
  }

  /**
   * It returns an object with the data, status, and tokens.
   *
   * @param options - data: true, value: true
   *
   * @returns An object with the data, status, and tokens.
   */
  serialize({ data, value } = { data: true, value: true }) {
    return {
      status: this.status,
      ...(data ? { data: this.data } : {}),
      tokens: this.tokens.map((t) => t.serialize({ value })),
    };
  }

  /**
   * It takes a serialized context and returns a new context with the tokens deserialized
   *
   * @param ctx - Context<D>
   *
   * @returns A new Context object with the data passed in and the tokens mapped to Token objects.
   */
  static deserialize<D = any>(ctx: ContextInterface<D>) {
    return new Context<D>({
      ...ctx,
      tokens: ctx.tokens.map((t) => Token.deserialize(t)),
    });
  }

  /**
   * It returns a new instance of the Context class, with the data parameter passed in as the data
   * property of the new instance
   *
   * @param [data] - The data to be passed to the context.
   *
   * @returns A new instance of the Context class.
   */
  static build<D = any>(data?: Partial<ContextInterface<D>>) {
    return new Context<D>(data);
  }
}
