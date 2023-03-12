/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, StateInterface } from './state';
import { Status } from './enums';
import { uid } from '../utils';

export interface TokenInterface {
  readonly id: string;
  parent?: string;
  locked?: boolean;
  histories: StateInterface[];
}

/* It creates a new instance of the Token class */
export class Token implements TokenInterface {
  public readonly id = uid();

  public parent?: string;
  public locked?: boolean;

  public histories: State[] = [];

  constructor(data?: Partial<TokenInterface>) {
    if (data) Object.assign(this, data);
  }

  /**
   * It pushes a new history to the histories array
   *
   * @param {State} history - State
   */
  push(history: State) {
    this.histories.push(history);
  }

  /**
   * It removes the last item from the histories array
   */
  pop() {
    this.histories.pop();
  }

  /**
   * When the pause() function is called, the status property is set to the value of the Paused enum.
   */
  pause() {
    this.status = Status.Paused;
  }

  /**
   * If the status is paused, set it to ready.
   */
  resume() {
    if (this.isPaused()) this.status = Status.Ready;
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
   * It serializes the object.
   *
   * @param options - value: true
   *
   * @returns An object with the id, parent, histories, and locked properties.
   */
  serialize(options = { value: true }) {
    return {
      id: this.id,
      ...(this.parent ? { parent: this.parent } : {}),
      histories: this.histories.map((h) => h.serialize(options)),
      ...(this.locked !== undefined ? { locked: this.locked } : {}),
    };
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
  static deserialize(data: TokenInterface) {
    return new Token({
      ...data,
      histories: data.histories.map((h) => State.deserialize(h)),
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
