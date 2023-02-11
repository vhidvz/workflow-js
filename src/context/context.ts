/* eslint-disable @typescript-eslint/no-explicit-any */
import { Token, TokenInterface } from './token';
import { IdentityOptions } from '../common';
import { ContextStatus } from './enums';

export interface ContextInterface<D = any> {
  data?: D;
  status?: ContextStatus;
}

export class Context<D = any> implements ContextInterface<D> {
  public data?: D;
  public status?: ContextStatus;

  protected _tokens: { [id: string]: Token } = {};

  get tokens() {
    return Object.values(this._tokens);
  }

  addToken(options?: TokenInterface) {
    const token = Token.build(options);
    this._tokens[token.id] = token;
    return token;
  }

  getToken(identity: IdentityOptions) {
    if ('id' in identity) return this.tokens.find((token) => token.state.ref === identity.id);
    if ('name' in identity) return this.tokens.find((token) => token.state.name === identity.name);
  }

  delToken(identity: IdentityOptions) {
    const token = this.getToken(identity);
    if (token) delete this._tokens[token.id];
  }

  constructor(data?: Partial<Context>) {
    if (data) Object.assign(this, data);
  }

  public static build<D = any>(data?: ContextInterface<D>) {
    return new Context<D>(data);
  }
}
