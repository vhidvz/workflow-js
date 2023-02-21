import { BPMNProcess } from '../../type';

/* The Attribute class is a base class for all classes that represent an attribute of a BPMN element */
export class Attribute {
  protected process: BPMNProcess;

  $!: { id: string; name?: string };

  constructor(process: BPMNProcess, data?: Partial<Attribute>) {
    if (data) Object.assign(this, data);
    this.process = process;
  }

  /**
   * The function returns the value of the id property of the object that is stored in the $ property
   * of the current object
   *
   * @returns The id property of the object.
   */
  get id(): string {
    return this.$.id;
  }

  /**
   * The function returns the value of the name property of the object that is stored in the $ property
   * of the current object
   *
   * @returns The name property of the object.
   */
  get name(): string | undefined {
    return this.$.name;
  }
}
