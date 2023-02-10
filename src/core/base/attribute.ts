import { BPMNProcess } from '../../type';

export class Attribute {
  protected process: BPMNProcess;
  $!: { id: string; name?: string };

  get id(): string {
    return this.$.id;
  }

  get name(): string | undefined {
    return this.$.name;
  }

  constructor(process: BPMNProcess, data?: Partial<Attribute>) {
    if (data) Object.assign(this, data);
    this.process = process;
  }
}
