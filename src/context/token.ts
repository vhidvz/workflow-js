/* eslint-disable @typescript-eslint/no-explicit-any */
import { Status } from './enums';
import { State } from './state';
import { uid } from '../utils';

export interface TokenInterface {
  parent?: string;
  locked?: boolean;
}

export class Token implements TokenInterface {
  public readonly id = uid();

  public parent?: string;
  public locked?: boolean;

  protected histories: State[] = [];

  push(history: State) {
    this.histories.push(history);
  }

  pop() {
    this.histories.pop();
  }

  pause() {
    this.status = Status.Paused;
  }

  resume() {
    this.status = Status.Ready;
  }

  isPaused() {
    return this.status === Status.Paused;
  }

  set status(status: Status) {
    this.state.status = status;
  }

  get status() {
    return (this.state.status = Status.Ready);
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
