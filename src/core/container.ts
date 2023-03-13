import { BPMNActivity, BPMNDefinition } from '../type';
import { IdentityOptions } from '../common';
import { logger } from '../utils';

const log = logger('container');

/* It's a container for BPMN definitions */
export interface DefinitionContainer {
  [id: string]: BPMNDefinition;
}

/* It's a container for BPMN activities. */
export interface ActivityContainer {
  [id: string]: { [id: string]: { activity: BPMNActivity; key: string } };
}

/* It's a container for BPMN definitions and activities */
export class Container {
  private static activities: ActivityContainer = {};
  private static definitions: DefinitionContainer = {};

  /**
   * It adds an activity to the activities object
   *
   * @param {string} id - string - The id of the process
   * @param activity - activity: BPMNActivity; key: string
   */
  public static addActivity(id: string, activity: { activity: BPMNActivity; key: string }) {
    this.activities[id] = this.activities[id] ?? {};

    const $ = activity.activity.$;
    this.activities[id][$.id] = activity;

    if ($.name) this.activities[id][$.name] = activity;

    log.info(`Process ${id} activity ${$.id} added to the container`);
  }

  /**
   * If the identity object has an id property, return the activity with that id, otherwise if it has a
   * name property, return the activity with that name
   *
   * @param {string} id - The ID of the activity.
   * @param {IdentityOptions} identity - IdentityOptions
   *
   * @returns The activity of the user with the given identity.
   */
  public static getActivity(id: string, identity: IdentityOptions) {
    if ('id' in identity) return (this.activities[id] ?? {})[identity.id];
    else if ('name' in identity) return (this.activities[id] ?? {})[identity.name];
  }

  /**
   * It deletes an activity from the activities object
   *
   * @param {string} id - The ID of the activity.
   * @param {IdentityOptions} identity - IdentityOptions
   */
  public static delActivity(id: string, identity: IdentityOptions) {
    if ('id' in identity) delete (this.activities[id] ?? {})[identity.id];
    else if ('name' in identity) delete (this.activities[id] ?? {})[identity.name];

    log.info(`Process ${id} activity identity %o deleted from the container`, identity);
  }

  /**
   * It adds a new BPMN definition to the definitions object
   *
   * @param {string} id - The id of the BPMN definition.
   * @param {BPMNDefinition} definition - BPMNDefinition
   */
  public static addDefinition(id: string, definition: BPMNDefinition) {
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
  public static getDefinition(id: string) {
    return this.definitions[id];
  }

  /**
   * It deletes the definition of the given id from the definitions object
   *
   * @param {string} id - The id of the definition.
   */
  public static delDefinition(id: string) {
    delete this.definitions[id];

    log.info(`Definition ${id} deleted from the container`);
  }
}
