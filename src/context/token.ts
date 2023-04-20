/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, StateInterface } from './state';
import { Status } from './enums';
import { uid } from '../utils';

export interface TokenInterface {
  readonly id: string;
  parent?: string;
  locked?: boolean;
  history: StateInterface[];
}

/* It creates a new instance of the Token class */
export class Token implements TokenInterface {
  public readonly id = uid();

  public parent?: string;
  public locked?: boolean;

  public history: State[] = [];

  constructor(data?: Partial<TokenInterface>) {
    if (data) Object.assign(this, data);
  }

  /**
   * It pushes a state to the history array
   *
   * @param {State} state - State
   *
   * @returns The current instance of the class.
   */
  push(state: State) {
    this.history.push(state);

    return this;
  }

  /**
   * Pop the last item from the history array and return the lates state at history array.
   *
   * @returns The poped state object.
   */
  pop() {
    return !this.locked && this.history.pop();
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
   * If the status is paused, set the status to ready
   *
   * @returns The current instance of the class.
   */
  resume(force = false) {
    if (force) this.status = Status.Ready;
    else if (this.status !== Status.Terminated) {
      this.status = Status.Ready;
    }

    return this;
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
   * If the status is equal to the Paused value, then return true, otherwise return false.
   *
   * @returns A boolean value.
   */
  isPaused() {
    return this.status === Status.Paused;
  }

  /**
   * The function takes in a status and sets the status of the state to the status that was passed in
   *
   * @param {Status} status - The status of the current game.
   */
  set status(status: Status) {
    this.state.status = status;
  }

  /**
   * If the state is not null, return the status of the state. Otherwise, return the status of the
   * ready state
   *
   * @returns The status of the state.
   */
  get status() {
    if (!this.state) return Status.Ready;
    else return this.state.status;
  }

  /**
   * It returns the last element of the history array
   *
   * @returns The last element in the array.
   */
  get state() {
    return this.history[this.history.length - 1];
  }

  /**
   * It serializes the object.
   *
   * @param options - value: true
   *
   * @returns An object with the id, parent, history, and locked properties.
   */
  serialize({ value } = { value: true }) {
    return {
      id: this.id,
      history: this.history.map((s) => s.serialize({ value })),
      ...(this.parent ? { parent: this.parent } : {}),
      ...(this.locked !== undefined ? { locked: this.locked } : {}),
    };
  }

  /**
   * It takes a JSON object and returns a new Token object with the same properties as the JSON object,
   * except that the history property is an array of State objects instead of an array of JSON
   * objects
   *
   * @param {Token} token - Token - this is the data that is passed in from the deserialize function.
   *
   * @returns A new Token object with the data passed in and the history mapped to State objects.
   */
  static deserialize(token: TokenInterface) {
    return new Token({
      ...token,
      history: token.history.map((s) => State.deserialize(s)),
    });
  }

  /**
   * It creates a new instance of the Token class.
   *
   * @param {TokenInterface} [options] - The options object that will be passed to the constructor.
   *
   * @returns A new instance of the Token class.
   */
  static build(options?: Partial<TokenInterface>) {
    return new Token({ ...options });
  }
}
