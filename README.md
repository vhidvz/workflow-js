# WorkflowJS

[![npm](https://img.shields.io/npm/v/@vhidvz/wfjs)](https://www.npmjs.com/package/@vhidvz/wfjs)
[![Coverage](https://raw.githubusercontent.com/vhidvz/workflow-js/master/coverage-badge.svg)](https://htmlpreview.github.io/?https://github.com/vhidvz/workflow-js/blob/master/docs/coverage/lcov-report/index.html)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/vhidvz/workflow-js)
![npm](https://img.shields.io/npm/dm/@vhidvz/wfjs)
[![GitHub](https://img.shields.io/github/license/vhidvz/workflow-js?style=flat)](https://github.com/vhidvz/workflow-js/blob/master/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#wfjs:gitter.im)
[![documentation](https://img.shields.io/badge/documentation-click_to_read-c27cf4)](https://vhidvz.github.io/workflow-js/)
[![Build, Test and Publish](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/vhidvz/workflow-js/actions/workflows/npm-ci.yml)

WorkflowJS is a lightweight and flexible library for building workflows and processes with NodeJS. It allows you to define processes using BPMN 2.0.

This is a JavaScript library for building and executing workflows. It provides a simple, declarative syntax for defining processes, and offers a flexible and extensible framework for handling workflow events and activities.

+ [Installation](#installation)
+ [Concepts](#concepts)
+ [Quick Start](#getting-started)
+ [Examples](https://github.com/vhidvz/workflow-js/tree/master/example)
+ [License](#license)

## Installation

```sh
npm install --save @vhidvz/wfjs
```

## Concepts

| * | Concept  | Description                                                    | Type  | Decorator | Required |
|---|----------|----------------------------------------------------------------|-------|-----------|----------|
| 1 | Process  | is a BPMN lane, a collection of flow objects.                  | Class | @Process  | Yes      |
| 2 | Activity | is a Flow Object or a Node of a workflow process.              | Param | @Act()    | Yes      |
| 3 | Context  | is storing the state of the machine during execution.          | Param | @Ctx()    | No       |
| 4 | Token    | has a history of the execution state, tokens are needed.       | Param | @Sign()   | No       |
| 5 | History  | is an array of the state of a flow object or node in a token.  | --    | @Sign()   | No       |
| 6 | State    | it contains the state of each node or flows object in history. | --    | @Sign()   | No       |
| 7 | Data     | is a shared space across the execution context.                | Param | @Data()   | Maybe    |
| 8 | Value    | is an isolated space for each flow object or node.             | Param | @Value()  | Maybe    |

> Note: if you `return` a value in a `Node` the value is passed to the next available `Node` as a `Value` in a specific execution.

## Getting Started

### Define a BPMN Schema

To define a BPMN schema, you need to create a file with the extension `.bpmn` and define the schema using the BPMN 2.0 standard or use the online BPMN [editor](https://demo.bpmn.io/new). Here's an example of a simple BPMN schema:

![Simple Workflow](https://raw.githubusercontent.com/vhidvz/workflow-js/master/assets/simple-workflow.svg)

> The full definition of the simple workflow schema `.bpmn` file located in [this link](https://github.com/vhidvz/workflow-js/tree/master/example).

### Creating a Workflow Instance

To create a new workflow, you need to define a class with methods that represent the different steps of the workflow. You can use decorators to define the nodes and activities of the workflow. Here's an example of a simple workflow:

```ts
import { Act, Node, Process } from "@vhidvz/wfjs/common";
import { EventActivity } from "@vhidvz/wfjs/core";

@Process({ name: 'Simple Workflow' })
class SimpleWorkflow {
  @Node({ name: 'Start' })
  async start(@Act() activity: EventActivity) {
    activity.takeOutgoing();
  }
}
```

### Building and Executing the Workflow

Once you have defined the workflow, you can build and execute it using the WorkflowJS library. Here's how you can do it:

```ts
import { parse, readFile, WorkflowJS } from '@vhidvz/wfjs';

(async () => {
  const workflow = WorkflowJS.build();

  const { context } = await workflow.execute({
    factory: () => new SimpleWorkflow(),
    xml: readFile('./example/simple-workflow.bpmn'),
  });

  console.debug('\nContext is:', JSON.stringify(context.serialize(), null, 2));
})()
```

## [More Example](https://github.com/vhidvz/workflow-js/tree/master/example)

__Projects__: 

- [workflow-template](https://github.com/vhidvz/workflow-template) is an example of creating a simple workflow microservice with [NestJS](https://github.com/nestjs/nest) and [WorkflowJS](https://github.com/vhidvz/workflow-js).

## License

This project is licensed under the MIT License - SEE the [LICENSE](LICENSE) file for details
