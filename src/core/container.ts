import { BPMNDefinition } from '../type';

export class Container {
  private static definitions: { [id: string]: BPMNDefinition } = {};

  public static add(id: string, definition: BPMNDefinition) {
    this.definitions[id] = definition;
  }

  public static get(id: string) {
    return this.definitions[id];
  }

  public static del(id: string) {
    delete this.definitions[id];
  }
}
