import { BPMNSequenceFlow } from '../../type';
import { Attribute } from './attribute';
import { Element } from './element';

export class Sequence extends Attribute {
  sourceRef!: Element;
  targetRef!: Element;

  constructor(data?: Partial<Sequence>) {
    super(data);
  }

  static build(el: BPMNSequenceFlow): Sequence {
    return new Sequence(el);
  }
}
