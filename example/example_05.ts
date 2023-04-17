/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from 'dotenv';
dotenv.config();

import { Act, Node, Process } from '../src/common';
import { readFile, WorkflowJS } from '../src';
import { EventActivity } from '../src/core';

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity) {
    activity.takeOutgoing();
  }
}

const workflow = WorkflowJS.build();

const { context } = workflow.execute({
  factory: () => new SimpleWorkflow(),
  xml: readFile('./example/simple-workflow.bpmn'),
});

console.debug('\nContext is:', JSON.stringify(context.serialize(), null, 2));
