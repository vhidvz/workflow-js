/* eslint-disable @typescript-eslint/no-explicit-any */
import { Arg, EventActivity, GatewayActivity, Node, Process, TaskActivity, WorkflowJS } from '../src';

@Process({
  name: 'Pizza Customer',
  path: './example/supplying-pizza.bpmn',
})
class PizzaCustomer {
  @Node({ name: 'Hungry for Pizza' })
  public hungryForPizza(
    @Arg('value') value: string,
    @Arg('data') data: { value: string },
    @Arg('activity') activity: EventActivity,
  ) {
    console.log('data in hungryForPizza is:', data);
    console.log('value in hungryForPizza is:', value);

    data.value = value + ' ' + data.value;

    activity.takeOutgoing();

    return 'selected'; // return it as value to next method
  }

  @Node({ name: 'Order a Pizza' })
  orderAPizza(
    @Arg('value') value: string,
    @Arg('data') data: { value: string },
    @Arg('activity') activity: TaskActivity,
  ) {
    console.log('data in orderAPizza is:', data);
    console.log('value in orderAPizza is:', value);

    data.value = data.value + ' ' + value;

    activity.takeOutgoing();
  }

  @Node({ id: 'Gateway_0s7y3gr' })
  whereIsMyPizza(
    @Arg('value') value: string,
    @Arg('data') data: { value: string },
    @Arg('activity') activity: GatewayActivity,
  ) {
    console.log('data in whereIsMyPizza is:', data);
    console.log('value in whereIsMyPizza is:', value);

    activity.takeOutgoing({ name: '60 Minutes' });
  }

  @Node({ name: '60 Minutes' })
  _60minutes() {
    // use your job tools to handle this
  }

  @Node({ name: 'Ask for the pizza' })
  askForThePizza(
    @Arg('value') value: string,
    @Arg('data') data: { value: string },
    @Arg('activity') activity: TaskActivity,
  ) {
    console.log('data in askForThePizza is:', data);
    console.log('value in askForThePizza is:', value);

    activity.takeOutgoing();
  }

  @Node({ name: 'Pizza Received' })
  pizzaReceived(
    @Arg('value') value: string,
    @Arg('data') data: { value: string },
    @Arg('activity') activity: EventActivity,
  ) {
    console.log('data in pizzaReceived is:', data);
    console.log('value in pizzaReceived is:', value);

    activity.takeOutgoing();

    return 'received';
  }

  @Node({ name: 'Hunger Satisfied' })
  hungerSatisfied(@Arg('value') value: string, @Arg('data') data: { value: string }) {
    console.log('data in hungerSatisfied is:', data);
    console.log('value in hungerSatisfied is:', value);
  }
}

const workflow = WorkflowJS.build();

const { target } = workflow.execute({
  handler: new PizzaCustomer(),
  data: { value: 'pizza' },
  value: 'pepperoni',
});

console.log(typeof target);

// After 60 Minutes

workflow.execute({ node: { name: 'Ask for the pizza' }, value: 'Hey?' });
