/* eslint-disable @typescript-eslint/no-explicit-any */
import { IdentityOptions } from '../common';
import { Status } from './enums';
import { Token } from './token';

export interface ContextInterface<D = any> {
  data?: D;
  status?: Status;
}

export class Context<D = any> implements ContextInterface<D> {
  public data?: D;
  public tokens: Token[] = [];
  public status?: Status;

  pause() {
    this.status = Status.Paused;
  }

  resume() {
    this.status = Status.Ready;
  }

  addToken(token: Token) {
    this.tokens.push(token);
  }

  getTokens(identity: IdentityOptions) {
    if ('id' in identity) return this.tokens.filter((token) => token.state.ref === identity.id);
    if ('name' in identity) return this.tokens.filter((token) => token.state.name === identity.name);
  }

  delTokens(identity: IdentityOptions) {
    const tokens = this.getTokens(identity)?.map((t) => t.id);
    if (tokens?.length) this.tokens = this.tokens.filter((t) => !tokens.includes(t.id));
  }

  isPaused() {
    return this.tokens.every((t) => t.status === Status.Paused);
  }

  isCompleted() {
    return this.tokens.every((t) => t.status === Status.Completed);
  }

  isTerminated() {
    return this.tokens.every((t) => t.status === Status.Terminated);
  }

  next() {
    return this.tokens.find((t) => t.status === Status.Ready)?.state;
  }

  constructor(data?: Partial<Context>) {
    if (data) Object.assign(this, data);
  }

  public static build<D = any>(data?: ContextInterface<D>) {
    return new Context<D>(data);
  }
}
