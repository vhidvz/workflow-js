import { BPMNEvent, BPMNProcess } from '../../type';
import { getBPMNActivity } from '../../utils';
import { getActivity } from '../../tools';
import { Activity } from '../base';

export enum EventType {
  End = 'end',
  Start = 'start',
  Boundary = 'boundary',
  Intermediate = 'intermediate',
}

export enum IntermediateType {
  Throw = 'throw',
  Catch = 'catch',
}

export enum EventDefinitionType {
  Link = 'link',
  Timer = 'timer',
  Error = 'error',
  Signal = 'signal',
  Message = 'message',
  Escalation = 'escalation',
  Conditional = 'conditional',
  Compensation = 'compensation',
}

export class EventActivity extends Activity {
  $!: { id: string; name?: string; attachedToRef?: string };

  get attachedToRef(): Activity | undefined {
    if (!this.$.attachedToRef) return;
    const options = getBPMNActivity(this.process, { id: this.$.attachedToRef });
    if (options) return getActivity(this.process, options);
  }

  get type() {
    if (this.$.attachedToRef) return EventType.Boundary;
    if (this.key?.toLowerCase()?.includes('end')) return EventType.End;
    if (this.key?.toLowerCase()?.includes('start')) return EventType.Start;
    if (this.key?.toLowerCase()?.includes('intermediate')) return EventType.Intermediate;
  }

  get intermediateType() {
    if (this.key?.toLowerCase()?.includes('throw')) return IntermediateType.Throw;
    if (this.key?.toLowerCase()?.includes('catch')) return IntermediateType.Catch;
  }

  get eventDefinitionType(): EventDefinitionType | undefined {
    if ('bpmn:linkEventDefinition' in this) return EventDefinitionType.Link;
    else if ('bpmn:timerEventDefinition' in this) return EventDefinitionType.Timer;
    else if ('bpmn:errorEventDefinition' in this) return EventDefinitionType.Error;
    else if ('bpmn:signalEventDefinition' in this) return EventDefinitionType.Signal;
    else if ('bpmn:messageEventDefinition' in this) return EventDefinitionType.Message;
    else if ('bpmn:escalationEventDefinition' in this) return EventDefinitionType.Escalation;
    else if ('bpmn:conditionalEventDefinition' in this) return EventDefinitionType.Conditional;
    else if ('bpmn:compensationEventDefinition' in this) return EventDefinitionType.Compensation;
  }

  constructor(process: BPMNProcess, data?: Partial<EventActivity>, key?: string) {
    super(process, data, key);
  }

  static build(el: BPMNEvent, process: BPMNProcess, key?: string) {
    return new EventActivity(process, { ...el }, key);
  }
}
