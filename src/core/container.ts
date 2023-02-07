import { IdentityOptions } from '../common';
import { BPMNDefinition } from '../type';
import { getIdentity } from '../utils';

export class Container {
  private static definitions: { [str: string]: BPMNDefinition };

  public static add(definition: BPMNDefinition, identity?: IdentityOptions) {
    this.definitions[getIdentity(identity)] = definition;
  }

  public static del(identity?: IdentityOptions) {
    delete this.definitions[getIdentity(identity)];
  }

  public static get(identity?: IdentityOptions) {
    return this.definitions[getIdentity(identity)];
  }
}
