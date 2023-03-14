import { BPMNDefinition } from './definition';
import { BPMNBoundaryEvent, BPMNEndEvent, BPMNIntermediateEvent, BPMNNormalGateway, BPMNProcess, BPMNStartEvent, BPMNStrictGateway, BPMNTask } from './process';
export type $ = {
    id: string;
    name?: string;
};
export type BPMNElement = {
    $: $;
};
export type BPMNSchema = {
    'bpmn:definitions': BPMNDefinition;
};
export type BPMNGatewayType = 'bpmn:complexGateway' | 'bpmn:parallelGateway' | 'bpmn:inclusiveGateway' | 'bpmn:exclusiveGateway' | 'bpmn:eventBasedGateway';
export type BPMNEventType = 'bpmn:endEvent' | 'bpmn:startEvent' | 'bpmn:boundaryEvent' | 'bpmn:intermediateThrowEvent' | 'bpmn:intermediateCatchEvent';
export type BPMNEventDefinitionType = 'bpmn:linkEventDefinition' | 'bpmn:timerEventDefinition' | 'bpmn:errorEventDefinition' | 'bpmn:signalEventDefinition' | 'bpmn:messageEventDefinition' | 'bpmn:escalationEventDefinition' | 'bpmn:conditionalEventDefinition' | 'bpmn:compensationEventDefinition';
export type BPMNTaskType = 'bpmn:sendTask' | 'bpmn:userTask' | 'bpmn:manualTask' | 'bpmn:scriptTask' | 'bpmn:receiveTask' | 'bpmn:serviceTask' | 'bpmn:businessTask';
export type BPMNActivityType = 'bpmn:task' | 'bpmn:subProcess' | 'bpmn:transaction' | 'bpmn:callActivity';
export type BPMNEvent = BPMNStartEvent | BPMNEndEvent | BPMNBoundaryEvent | BPMNIntermediateEvent;
export type BPMNGateway = BPMNNormalGateway | BPMNStrictGateway;
export type BPMNActivity = BPMNGateway | BPMNEvent | BPMNTask | (BPMNElement & {
    'bpmn:triggeredByEvent'?: boolean;
} & Omit<BPMNProcess, 'bpmn:isExecutable' | 'bpmn:laneSet'>);
