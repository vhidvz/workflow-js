/* eslint-disable @typescript-eslint/no-explicit-any */
import { Token, TokenInterface } from './token';
import { ContextStatus } from './enums';

export class Context<D = any> {
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

  getTokenByStateRef(id: string) {
    return this.tokens.find((token) => token.state.ref === id);
  }

  delTokenByStateRef(id: string) {
    const token = this.tokens.find((token) => token.state.ref === id);
    if (token) delete this._tokens[token.id];
  }

  constructor(data?: Partial<Context>) {
    if (data) Object.assign(this, data);
  }

  public static build<D = any>(data: Partial<Context<D>>) {
    return new Context<D>(data);
  }
}
