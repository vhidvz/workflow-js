import { BPMNElement } from './base';
export type BPMNParticipant = BPMNElement & {
    $: {
        processRef: string;
    };
};
export type BPMNMessageFlow = BPMNElement & {
    $: {
        sourceRef: string;
        targetRef: string;
    };
};
export type BPMNCollaboration = BPMNElement & {
    'bpmn:participant': BPMNParticipant[];
    'bpmn:messageFlow': BPMNMessageFlow[];
};
