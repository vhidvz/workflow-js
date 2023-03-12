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
  public status!: Status;

  constructor(data?: Partial<StateInterface>) {
    if (data) Object.assign(this, data);
  }

  /**
   * It returns an object with the properties ref, name, status, and value.
   *
   * @param options - value: true
   *
   * @returns An object with the ref, name, status, and value properties.
   */
  serialize(options = { value: true }) {
    return {
      ref: this.ref,
      status: this.status,
      ...(this.name ? { name: this.name } : {}),
      ...(options?.value ? { value: this.value } : {}),
    };
  }

  /**
   * It takes a State object and returns a new State object with the same properties
   *
   * @param {State} data - The data to be deserialized.
   *
   * @returns A new instance of the State class.
   */
  static deserialize<V = any>(data: StateInterface<V>) {
    return new State<V>({ ...data });
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
  static build<V = any>(ref: string, options: { name?: string; value?: V; status: Status }) {
    return new State<V>({ ref, ...options });
  }
}
