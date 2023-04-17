/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from 'dotenv';
dotenv.config();

import { Act, Node, Process } from '../src/common';
import { readFile, WorkflowJS } from '../src';
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

(async () => {
  const workflow = WorkflowJS.build();

  const { context, definition } = await workflow.execute({
    factory: () => new PizzaVendor(),
    xml: readFile('./example/supplying-pizza.bpmn'),
  });

  console.debug('\nDefinition is:', definition);
  console.debug('\nContext is:', JSON.stringify(context.serialize(), null, 2));

  // After a while

  const exec = await WorkflowJS.build({ definition }).execute({
    context: context.resume(),
    factory: () => new PizzaVendor(),
    node: { name: 'Receive Payment' },
  });

  console.debug('\nContext before termination is:', JSON.stringify(exec.context.serialize(), null, 2));

  if (context.isPartiallyTerminated()) exec.context.terminate();

  console.debug('\nContext after termination is:', JSON.stringify(exec.context.serialize(), null, 2));
})();
