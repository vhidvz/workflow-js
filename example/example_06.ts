/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from 'dotenv';
dotenv.config();

import { parse, readFile, WorkflowJS } from '../src';
import { Act, Node, Process } from '../src/common';
import { EventActivity } from '../src/core';

@Process({ name: 'Pizza Vendor' })
class PizzaVendor {
  @Node({ name: 'Order Received' })
  public orderReceived(@Act() activity: EventActivity) {
    activity.takeOutgoing();
  }

  @Node({ name: 'Deliver the Pizza' })
  public deliverThePizza() {
    // Waiting for delivery
  }

  @Node({ name: 'Receive Payment' })
  public receivePayment(@Act() activity: EventActivity) {
    activity.takeOutgoing();
  }
}

const workflow = WorkflowJS.build();

const xml = readFile('./example/supplying-pizza.bpmn');

const { context, definition } = workflow.execute({
  factory: () => new PizzaVendor(),
  schema: parse(xml)['bpmn:definitions'],
});

// After a while

const exec = WorkflowJS.build({ definition }).execute({
  context: context.resume(),
  factory: () => new PizzaVendor(),
  node: { name: 'Receive Payment' },
});

console.debug(exec);
