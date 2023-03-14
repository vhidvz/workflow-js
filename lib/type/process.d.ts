import { BPMNElement, BPMNTaskType } from './base';
export type BPMNLane = BPMNElement & {
    'bpmn:flowNodeRef': string[];
};
export type BPMNLaneSet = BPMNElement & {
    'bpmn:lane': BPMNLane[];
};
export type BPMNSequenceFlow = BPMNElement & {
    $: {
        sourceRef: string;
        targetRef: string;
    };
};
export type BPMNNormalGateway = (BPMNElement & {
    $: {
        default?: string;
    };
}) & {
    'bpmn:incoming': string[];
    'bpmn:outgoing': string[];
};
export type BPMNStrictGateway = BPMNElement & {
    'bpmn:incoming': string[];
    'bpmn:outgoing': string[];
};
export type BPMNEventDefinition = {
    'bpmn:linkEventDefinition'?: [BPMNElement];
} | {
    'bpmn:timerEventDefinition'?: [BPMNElement];
} | {
    'bpmn:errorEventDefinition'?: [BPMNElement];
} | {
    'bpmn:signalEventDefinition'?: [BPMNElement];
} | {
    'bpmn:messageEventDefinition'?: [BPMNElement];
} | {
    'bpmn:escalationEventDefinition'?: [BPMNElement];
} | {
    'bpmn:conditionalEventDefinition'?: [BPMNElement];
} | {
    'bpmn:compensationEventDefinition'?: [BPMNElement];
};
export type BPMNIntermediateEvent = BPMNElement & {
    'bpmn:incoming': string[];
    'bpmn:outgoing': string[];
} & BPMNEventDefinition;
export type BPMNBoundaryEvent = (BPMNElement & {
    $: {
        attachedToRef?: string;
    };
}) & {
    'bpmn:outgoing': string[];
} & BPMNEventDefinition;
export type BPMNStartEvent = BPMNElement & {
    'bpmn:outgoing': string[];
} & BPMNEventDefinition;
export type BPMNEndEvent = BPMNElement & {
    'bpmn:incoming': string[];
} & BPMNEventDefinition;
export type BPMNTask = BPMNElement & {
    'bpmn:incoming': string[];
    'bpmn:outgoing': string[];
};
export type BPMNProcess = BPMNElement & {
    'bpmn:isExecutable': boolean;
    'bpmn:laneSet'?: BPMNLaneSet[];
    'bpmn:task'?: BPMNTask[];
    'bpmn:endEvent'?: BPMNEndEvent[];
    'bpmn:startEvent'?: BPMNStartEvent[];
    'bpmn:sequenceFlow'?: BPMNSequenceFlow[];
    'bpmn:boundaryEvent'?: BPMNBoundaryEvent[];
} & {
    [x in BPMNTaskType]?: BPMNTask[];
} & {
    [x in 'bpmn:parallelGateway' | 'bpmn:eventBasedGateway']?: BPMNStrictGateway[];
} & {
    [x in 'bpmn:intermediateThrowEvent' | 'bpmn:intermediateCatchEvent']?: BPMNIntermediateEvent[];
} & {
    [x in 'bpmn:complexGateway' | 'bpmn:inclusiveGateway' | 'bpmn:exclusiveGateway']?: BPMNNormalGateway[];
} & {
    [x in 'bpmn:subProcess' | 'bpmn:transaction' | 'bpmn:callActivity']?: (BPMNElement & {
        'bpmn:triggeredByEvent'?: boolean;
    } & Omit<BPMNProcess, 'bpmn:isExecutable' | 'bpmn:laneSet'>)[];
};
