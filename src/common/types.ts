import { BPMNDefinition } from '../type';
import { Activity } from '../core';

export type DefineOptions = { xml: string } | { path: string } | { schema: BPMNDefinition };

export type IdentityOptions = { id: string } | { name: string };

export type DataObject<T = object> = {
  next?: Activity[];
  value?: T;
};

export type Metadata = {
  process: IdentityOptions;
  definition: { id: string };
};
