# WorkflowJS

[![GitHub](https://img.shields.io/github/license/vhidvz/workflow-js?style=flat)](https://vhidvz.github.io/workflow-js/)
[![Coverage](https://raw.githubusercontent.com/vhidvz/workflow-js/master/coverage-badge.svg)](https://htmlpreview.github.io/?https://github.com/vhidvz/workflow-js/blob/master/docs/coverage/lcov-report/index.html)
[![Build, Test and Publish to NPM Package Registry](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml)

## Description

WorkflowJS is a lightweight and flexible library for building workflows and processes with NodeJS. It allows you to define processes using BPMN 2.0

## Installation

```sh
npm install workflow-js
```

## Creating a Workflow

To create a new workflow, you need to define a class with methods that represent the different steps of the workflow. You can use decorators to define the nodes and activities of the workflow. Here's an example of a simple workflow:

```ts
import { Process, Node, Value, Data, Activity } from 'workflow-js';

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  start(@Value() value: string, @Activity() activity: any) {
    console.log(value);

    activity.takeOutgoing();
  }

  @Node({ name: 'End' })
  end( @Data() data: { value: string }, @Activity() activity: any) {
    console.log(data);
  }
}
```

## Building and Executing the Workflow

Once you have defined the workflow, you can build and execute it using the WorkflowJS library. Here's how you can do it:
