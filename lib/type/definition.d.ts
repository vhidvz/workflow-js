import { BPMNCollaboration } from './collaboration';
import { BPMNProcess } from './process';
import { BPMNElement } from './base';
export type BPMNDefinition = BPMNElement & {
    'bpmn:process': BPMNProcess[];
    'bpmn:collaboration': BPMNCollaboration[];
};
