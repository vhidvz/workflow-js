/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Activity,
  Arg,
  Context,
  EventActivity,
  GatewayActivity,
  Node,
  Process,
  TaskActivity,
  Token,
  WorkflowJS,
} from '../src';

@Process({
  name: 'Pizza Customer',
  path: './example/supplying-pizza.bpmn',
})
class PizzaCustomer extends WorkflowJS {
  @Node({ name: 'Hungry for Pizza' })
  public hungryForPizza(
    @Arg('value') value: any,
    @Arg('token') token: Token,
    @Arg('activity') activity: EventActivity,
  ) {
    console.log(value);
    console.log(token);
    console.log(activity);

    activity.takeOutgoing();

    return 'value from hungryForPizza to selectAPizza';
  }

  @Node({ name: 'Order a Pizza' })
  orderAPizza(@Arg('activity') activity: Activity, @Arg('token') token: Token, @Arg('data') data: any) {
    console.log(data);
    console.log(token);
    console.log(activity);

    activity.takeOutgoing();
  }

  @Node({ id: 'Gateway_0s7y3gr' })
  whereIsMyPizza(@Arg('activity') activity: GatewayActivity, @Arg('context') context: Context) {
    console.log(context);
    console.log(activity);

    activity.takeOutgoing({ name: '60 Minutes' });
  }

  @Node({ name: '60 Minutes' })
  _60minutes(@Arg('activity') activity: EventActivity, @Arg('token') token: Token) {
    console.log(token);
    console.log(activity);

    activity.takeOutgoing();
  }

  @Node({ name: 'Ask for the pizza' })
  askForThePizza(@Arg('activity') activity: TaskActivity, @Arg('token') token: Token) {
    console.log(token);
    console.log(activity);

    activity.takeOutgoing();
  }

  @Node({ name: 'Pizza Received' })
  pizzaReceived(@Arg('activity') activity: EventActivity, @Arg('token') token: Token) {
    console.log(token);
    console.log(activity);

    activity.takeOutgoing();
  }

  @Node({ name: 'Pay the Pizza' })
  payThePizza(@Arg('activity') activity: TaskActivity, @Arg('token') token: Token) {
    console.log(token);
    console.log(activity);
  }

  @Node({ name: 'Eat the Pizza' })
  eatThePizza(@Arg('activity') activity: TaskActivity, @Arg('token') token: Token) {
    console.log(token);
    console.log(activity);

    activity.takeOutgoing();
  }

  @Node({ name: 'Hunger Satisfied' })
  hungerSatisfied(@Arg('activity') activity: EventActivity, @Arg('token') token: Token) {
    console.log(token);
    console.log(activity);
  }
}

const workflow = new PizzaCustomer();

const { context } = workflow.execute({ data: { test: 'value' }, value: 1 });

console.log(workflow.execute({ identity: { name: 'Eat the Pizza' }, context }));
