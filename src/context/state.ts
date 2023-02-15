/* eslint-disable @typescript-eslint/no-explicit-any */

export class State<V = any> {
  public value?: V;

  public ref!: string;
  public name?: string;

  constructor(data?: Partial<State>) {
    if (data) Object.assign(this, data);
  }

  public static build<V = any>(ref: string, options?: { name?: string; value?: V }) {
    return new State<V>({ ref, ...options });
  }
}
