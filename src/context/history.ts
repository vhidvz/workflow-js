/* eslint-disable @typescript-eslint/no-explicit-any */

export class History<V = any> {
  public value?: V;
  public ref!: string;

  constructor(data?: Partial<History>) {
    if (data) Object.assign(this, data);
  }

  public static build<V = any>(ref: string, value: V) {
    return new History<V>({ ref, value });
  }
}
