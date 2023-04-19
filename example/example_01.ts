/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from 'dotenv';
dotenv.config();

import { EventActivity, GatewayActivity, TaskActivity } from '../src/core';
import { Act, Data, Node, Process, Value } from '../src/common';
import { Context, WorkflowJS } from '../src';

@Process({
  name: 'Pizza Customer',
  path: './example/supplying-pizza.bpmn',
})
class PizzaCustomer extends WorkflowJS {
  @Node({ name: 'Hungry for Pizza' })
  async hungryForPizza(
    @Value() value: string,
    @Data() data: { value: string },
    @Act() activity: EventActivity,
  ) {
    console.log('data in hungryForPizza is:', data);
    console.log('value in hungryForPizza is:', value);

    data.value = value + ' ' + data.value;

    activity.takeOutgoing();

    return 'selected'; // return it as value to next method
  }

  @Node({ name: 'Order a Pizza' })
  async orderAPizza(@Value() value: string, @Data() data: { value: string }, @Act() activity: TaskActivity) {
    console.log('data in orderAPizza is:', data);
    console.log('value in orderAPizza is:', value);

    data.value = data.value + ' ' + value;

    activity.takeOutgoing();
  }

  @Node({ id: 'Gateway_0s7y3gr' })
  async whereIsMyPizza(
    @Value() value: string,
    @Data() data: { value: string },
    @Act() activity: GatewayActivity,
  ) {
    console.log('data in whereIsMyPizza is:', data);
    console.log('value in whereIsMyPizza is:', value);

    activity.takeOutgoing({ name: '60 Minutes' });
  }

  @Node({ name: '60 Minutes' })
  _60minutes(@Act() activity: EventActivity) {
    activity.takeOutgoing(undefined, { pause: true });
  }

  @Node({ name: 'Ask for the pizza' })
  async askForThePizza(
    @Value() value: string,
    @Data() data: { value: string },
    @Act() activity: TaskActivity,
  ) {
    console.log('data in askForThePizza is:', data);
    console.log('value in askForThePizza is:', value);

    activity.takeOutgoing();
  }

  @Node({ name: 'Pizza Received' })
  async pizzaReceived(
    @Value() value: string,
    @Data() data: { value: string },
    @Act() activity: EventActivity,
  ) {
    console.log('data in pizzaReceived is:', data);
    console.log('value in pizzaReceived is:', value);

    activity.takeOutgoing();

    return 'received';
  }

  @Node({ name: 'Hunger Satisfied' })
  hungerSatisfied(@Value() value: string, @Data() data: { value: string }) {
    console.log('data in hungerSatisfied is:', data);
    console.log('value in hungerSatisfied is:', value);

    data.value = value + ' ' + data.value;
  }
}

(async () => {
  const workflow = PizzaCustomer.build();

  const { context } = await workflow.execute({ data: { value: 'pizza' }, value: 'pepperoni' });

  const ctx = context.serialize(); // plain json object can store it to your DB

  console.debug('\nContext is:', JSON.stringify(ctx, null, 2));

  // After 60 Minutes

  const exec = await workflow.execute({
    context: Context.deserialize(ctx),
    node: { name: 'Ask for the pizza' },
    value: 'Hey?',
  });

  console.debug('\nContext is:', JSON.stringify(exec.context.serialize(), null, 2));
})();
