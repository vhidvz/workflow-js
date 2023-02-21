import { BPMNDefinition } from '../type';

/* It's a container for BPMN definitions */
export class Container {
  private static definitions: { [id: string]: BPMNDefinition } = {};

  /**
   * It adds a new BPMN definition to the definitions object
   *
   * @param {string} id - The id of the BPMN definition.
   * @param {BPMNDefinition} definition - BPMNDefinition
   */
  public static add(id: string, definition: BPMNDefinition) {
    this.definitions[id] = definition;
  }

  /**
   * It returns the definition of the given id
   *
   * @param {string} id - The id of the definition to get.
   *
   * @returns The definition of the id.
   */
  public static get(id: string) {
    return this.definitions[id];
  }

  /**
   * It deletes the definition of the given id from the definitions object
   *
   * @param {string} id - The id of the definition.
   */
  public static del(id: string) {
    delete this.definitions[id];
  }
}
