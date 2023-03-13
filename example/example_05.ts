/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from 'dotenv';
dotenv.config();

import { parse, readFile, WorkflowJS } from '../src';
import { Act, Node, Process } from '../src/common';
import { EventActivity } from '../src/core';

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  public start(@Act() activity: EventActivity) {
    activity.takeOutgoing();
  }
}

const workflow = WorkflowJS.build();

const xml = readFile('./example/simple-workflow.bpmn');

const { context } = workflow.execute({
  factory: () => new SimpleWorkflow(),
  schema: parse(xml)['bpmn:definitions'],
});

console.debug('\nContext is:', JSON.stringify(context.serialize(), null, 2));
