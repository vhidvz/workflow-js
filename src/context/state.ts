/* eslint-disable @typescript-eslint/no-explicit-any */
import { Status } from './enums';

export interface StateInterface<V = any> {
  ref: string;
  name?: string;
  status: Status;
  value?: V;
}

/* It's a class that represents a state */
export class State<V = any> {
  public value?: V;

  public ref!: string;
  public name?: string;
  public status = Status.Ready;

  constructor(data?: Partial<StateInterface>) {
    if (data) Object.assign(this, data);
  }

  /**
   * This function clones the current state object by serializing and deserializing it.
   *
   * @param  - The `clone` function takes an optional object parameter
   *
   * @returns The `clone` method is returning a new instance of the `State` class
   */
  clone({ value } = { value: false }) {
    return State.deserialize(this.serialize({ value }));
  }

  /**
   * It returns an object with the properties ref, name, status, and value.
   *
   * @param options - value: true
   *
   * @returns An object with the ref, name, status, and value properties.
   */
  serialize({ value } = { value: true }) {
    return {
      ref: this.ref,
      status: this.status,
      ...(value ? { value: this.value } : {}),
      ...(this.name ? { name: this.name } : {}),
    };
  }

  /**
   * It takes a State object and returns a new State object with the same properties
   *
   * @param {State} state - The data to be deserialized.
   *
   * @returns A new instance of the State class.
   */
  static deserialize<V = any>(state: StateInterface<V>) {
    return new State<V>({ ...state });
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
  static build<V = any>(ref: string, options: { name?: string; value?: V; status?: Status }) {
    return new State<V>({ ref, ...options });
  }
}
