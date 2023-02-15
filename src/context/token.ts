/* eslint-disable @typescript-eslint/no-explicit-any */
import { TokenStatus } from './enums';
import { State } from './state';
import { uid } from '../utils';

export interface TokenInterface {
  parent?: string;
  locked?: boolean;
  status?: TokenStatus;
}

export class Token implements TokenInterface {
  public readonly id = uid();

  public parent?: string;
  public locked?: boolean;
  public status?: TokenStatus;

  protected histories: State[] = [];

  push(history: State) {
    this.histories.push(history);
  }

  pop() {
    this.histories.pop();
  }

  pause() {
    this.status = TokenStatus.Paused;
  }

  resume() {
    this.status = TokenStatus.Ready;
  }

  isPaused() {
    return this.status === TokenStatus.Paused;
  }

  get state() {
    return this.histories[this.histories.length - 1];
  }

  constructor(data?: Partial<Token>) {
    if (data) Object.assign(this, data);
  }

  public static build(options?: TokenInterface) {
    return new Token({ ...options });
  }
}
