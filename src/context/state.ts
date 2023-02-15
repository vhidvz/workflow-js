/* eslint-disable @typescript-eslint/no-explicit-any */

import { Status } from './enums';

export class State<V = any> {
  public value?: V;

  public ref!: string;
  public name?: string;
  public status!: Status;

  constructor(data?: Partial<State>) {
    if (data) Object.assign(this, data);
  }

  public static build<V = any>(ref: string, options: { name?: string; value?: V; status: Status }) {
    return new State<V>({ ref, ...options });
  }
}
