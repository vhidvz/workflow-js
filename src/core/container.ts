import { BPMNDefinition } from '../type';
import { logger } from '../utils';

const log = logger('container');

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

    log.info(`Definition ${id} added to the container`);
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

    log.info(`Definition ${id} deleted from the container`);
  }
}
