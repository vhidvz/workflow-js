import { BPMNElement } from '../../type';
import { Attribute } from './attribute';

export class Element extends Attribute {
  constructor(data?: Partial<Element>) {
    super(data);
  }

  static build(el: BPMNElement): Element {
    return new Element(el);
  }
}
