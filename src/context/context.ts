/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContextStatus, TokenStatus } from './enums';
import { IdentityOptions } from '../common';
import { Token } from './token';

export interface ContextInterface<D = any> {
  data?: D;
  status?: ContextStatus;
}

export class Context<D = any> implements ContextInterface<D> {
  public data?: D;
  public tokens: Token[] = [];
  public status?: ContextStatus;

  pause() {
    this.status = ContextStatus.Paused;
  }

  resume() {
    this.status = ContextStatus.Ready;
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

  isCompleted() {
    return this.tokens.every((t) => t.status === TokenStatus.Completed);
  }

  isTerminated() {
    return this.tokens.every((t) => t.status === TokenStatus.Terminated);
  }

  next() {
    return this.tokens.find((t) => t.status === TokenStatus.Ready)?.state;
  }

  constructor(data?: Partial<Context>) {
    if (data) Object.assign(this, data);
  }

  public static build<D = any>(data?: ContextInterface<D>) {
    return new Context<D>(data);
  }
}
