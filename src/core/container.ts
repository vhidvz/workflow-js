import { BPMNDefinition, BPMNElement } from '../type';
import { IdentityOptions } from '../common';
import { logger } from '../utils';

const log = logger('container');

/* It's a container for BPMN definitions */
export interface ContainerDefinition {
  [id: string]: BPMNDefinition;
}

/* It's a container for BPMN elements. */
export interface ContainerElement {
  [id: string]: { [id: string]: ContainerElementItem };
}

export type ContainerElementItem = { element: BPMNElement; key: string };

/* It's a container for BPMN definitions */
export class Container {
  private static elements: ContainerElement = {};
  private static definitions: ContainerDefinition = {};

  /**
   * It adds an element to the container
   *
   * @param {string} id - The id of the process
   * @param {ContainerElementItem}  - id - the process id
   */
  public static addElement(id: string, { element, key }: ContainerElementItem) {
    this.elements[id] = this.elements[id] ?? {};
    this.elements[id][element.$.id] = { element, key };

    if (element.$.name) this.elements[id][element.$.name] = { element, key };

    log.info(`Process ${id} element ${element.$.id} added to the container`);
  }

  /**
   * If the identity object has an id property, return the element with that id, otherwise if it has a
   * name property, return the element with that name
   *
   * @param {string} id - The id of the process.
   * @param {IdentityOptions} identity - IdentityOptions of element
   *
   * @returns The element with the given id and identity.
   */
  public static getElement(id: string, identity: IdentityOptions) {
    if ('id' in identity) return (this.elements[id] ?? {})[identity.id];
    else if ('name' in identity) return (this.elements[id] ?? {})[identity.name];
  }

  /**
   * It deletes an element from the container
   *
   * @param {string} id - The process id
   * @param {IdentityOptions} identity - IdentityOptions
   */
  public static delElement(id: string, identity: IdentityOptions) {
    if ('id' in identity) delete (this.elements[id] ?? {})[identity.id];
    else if ('name' in identity) delete (this.elements[id] ?? {})[identity.name];

    log.info(`Process ${id} element identity %o deleted from the container`, identity);
  }

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
